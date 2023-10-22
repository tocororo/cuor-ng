import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryVenue {

  private endpointUrl = 'https://query.wikidata.org/sparql';
  private headers = { 'Accept': 'application/sparql-results+json' };

  constructor(
    private http: HttpClient,
  ) { }

  recentWorks(QID): Observable<any> {
    var query = `
        # Recent works published in venue
        SELECT
          (MIN(?publication_date_) AS ?publication_date)
          ?work ?workLabel
          (GROUP_CONCAT(?author_label; separator=", ") AS ?authors)
          (CONCAT("../authors/", GROUP_CONCAT(SUBSTR(STR(?author), 32); separator=",")) AS ?authorsUrl)
        WHERE {
          ?work wdt:P1433 wd:${QID} .
          OPTIONAL {
            ?work wdt:P577 ?publication_datetime . 
            BIND(xsd:date(?publication_datetime) AS ?publication_date_)
          }
          OPTIONAL {
            ?work wdt:P50 ?author .
            ?author rdfs:label ?author_label .
            FILTER (LANG(?author_label) = 'en')
          }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        GROUP BY ?work ?workLabel
        ORDER BY DESC(?publication_date)
        LIMIT 1000
                     
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'publication_date', label: 'Fecha de Publicacion' },
          { key: 'work', label: 'Investigacion' },
          { key: 'authors', label: 'Autores' }
        ]

        res.results.bindings.forEach(element => {
          var _authorsUrl = element['authorsUrl'] ? element['authorsUrl'].value.split("/") : '';
          var _work = element['work'] ? element['work'].value.split("/") : '';

          columArray.push({
            publication_date: element.publication_date ? element.publication_date.value : '',
            academic_age: element.academic_age ? element.academic_age.value : '',
            authors: {
              type: 'authorURL',
              label: element.authors ? element.authors.value : '',
              QID: element.authorsrUrl ? _authorsUrl[_authorsUrl.length - 1] : ''
            },
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  topics(QID): Observable<any> {
    var query = `
        #defaultView:Table
        # Count of topics in published work in specified venue
        SELECT ?count ?topic ?topicLabel ?example_work ?example_workLabel
        WITH {
          SELECT 
            (COUNT(?work) as ?count)
            ?topic
            (SAMPLE(?work) AS ?example_work)
          WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?work wdt:P921 ?topic .
          }
          GROUP BY ?topic
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
                  
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Temas' },
          { key: 'topic', label: 'Tema' },
          { key: 'example_work', label: 'Muestra de Investigacion' }
        ]

        res.results.bindings.forEach(element => {

          var _topic = element["topic"].value.split("/");
          var _example_work = element['example_work'].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            topic: {
              type: 'topic',
              QID: element.topic ? _topic[_topic.length - 1] : '',
              label: element.topicLabel ? element.topicLabel.value : ''
            },
            example_work: {
              type: 'work',
              QID: element.example_work ? _example_work[_example_work.length - 1] : '',
              label: element.example_workLabel ? element.example_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  authorImages(QID): Observable<any> {
    var query = `#defaultView:ImageGrid
  SELECT (SAMPLE(?image_) AS ?image) ?author ?authorLabel ?count
  WITH {
    SELECT ?author (COUNT(?work) AS ?count) WHERE {
      ?work wdt:P1433 wd:${QID};
            wdt:P50 ?author .
    }
    GROUP BY ?author
  } AS %authors
  WHERE {
    INCLUDE %authors
    ?author wdt:P18 ?image_ .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl.no,ru,sv,zh" . } 
  }
  GROUP BY ?author ?authorLabel ?count
  ORDER BY DESC(?count)
  LIMIT 50  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  prolificAuthors(QID): Observable<any> {
    var query = `
        # Prolific authors for a specific journal
        SELECT ?count ?author ?authorLabel ?orcid ?example_work ?example_workLabel
        WITH {
          # Count the number of works author by the author publishing in the journal
          SELECT
            ?author
            (COUNT(?work) AS ?count)
            (SAMPLE(?work) AS ?example_work)
          WHERE {
            ?work wdt:P50 ?author ;
                  wdt:P1433 wd:${QID} .
          }
          GROUP BY ?author
        } AS %result
        WHERE {
          INCLUDE %result 
                  
          # Include optional ORCID iD
          OPTIONAL { ?author wdt:P496 ?orcid . }
          
          # Label the results
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
        LIMIT 50        
                
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Investigaciones' },
          { key: 'author', label: 'Autor' },
          { key: 'orcid', label: 'Orcid' },
          { key: 'example_work', label: 'Muestra de Investigacion' }
        ]

        res.results.bindings.forEach(element => {

          var _author = element["author"].value.split("/");
          var _example_work = element['example_work'] ? element['example_work'].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            orcid: {
              type: 'orcid',
              value: element.orcid ? element.orcid.value : ''
            },
            author: {
              type: 'author',
              QID: element.author ? _author[_author.length - 1] : '',
              label: element.authorLabel ? element.authorLabel.value : ''
            },
            example_work: {
              type: 'work',
              QID: element.example_work ? _example_work[_example_work.length - 1] : '',
              label: element.example_workLabel ? element.example_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  coAuthorGraph(QID): Observable<any> {
    var query = `#defaultView:Graph
  SELECT ?author1 ?author1Label ?rgb ?author2 ?author2Label
  WITH {
    # Find works published in the given venue
    SELECT ?work WHERE {
      ?work wdt:P1433 wd:${QID} .
    }
  } AS %works
  WITH {
    # Limit the number of authors
    SELECT (COUNT(?work) AS ?count1) ?author1 WHERE {
      INCLUDE %works
      ?work wdt:P50 ?author1 .
    }
    GROUP BY ?author1
    ORDER BY DESC(?count1)
    LIMIT 15
  } AS %authors1
  WITH {
    # Limit the number of coauthors
    SELECT DISTINCT ?author2 ?author1  (COUNT(?work) AS ?count2)  WHERE {
      INCLUDE %works
      INCLUDE %authors1
      ?work wdt:P50 ?author1 , ?author2 .
      FILTER (?author1 != ?author2) 
    }
    GROUP BY ?author2 ?author1 
    ORDER BY DESC(?count2)
    LIMIT 150
  } AS %authors2
  WHERE {
  #  INCLUDE %authors1
    INCLUDE %authors2
    OPTIONAL { ?author1 wdt:P21 ?gender1 . }
    BIND( IF(?gender1 = wd:Q6581097, "3182BD", "E6550D") AS ?rgb)
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "en,fr,de,ru,es,zh,jp".
    }
  }
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  mostCitedArticles(QID): Observable<any> {
    var query = `
        #defaultView:Table
        # Most cited works published in venue
        SELECT
          ?count
          ?work ?workLabel
          ?example_citing_work ?example_citing_workLabel
        WITH {
          # Count citations
          SELECT
            (COUNT(?citing_work) AS ?count)
            ?work
            (SAMPLE(?citing_work) AS ?example_citing_work)
          WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?citing_work wdt:P2860 ?work.
          }
          GROUP BY ?work
          ORDER BY DESC(?count)
          LIMIT 1000  
        } AS %result
        WHERE {
          # Label results
          INCLUDE %result
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
           
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Investigaciones' },
          { key: 'work', label: 'Investigacion' },
          { key: 'example_citing_work', label: 'Muestra de Cita de Investigacion' }
        ]

        res.results.bindings.forEach(element => {

          var _work = element["work"].value.split("/");
          var _example_citing_work = element['example_citing_work'].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            orcid: element.orcid ? element.orcid.value : '',
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            },
            example_citing_work: {
              type: 'work',
              QID: element.example_citing_work ? _example_citing_work[_example_citing_work.length - 1] : '',
              label: element.example_citing_workLabel ? element.example_citing_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  mostCitedAuthors(QID): Observable<any> {
    var query = `
        # Most cited authors published in venue
        SELECT
          ?count
          ?author ?authorLabel
          ?orcid
          ?example_cited_work ?example_cited_workLabel
          ?example_citing_work ?example_citing_workLabel
        WITH {
          # Count the number of citations
          SELECT
            ?author
            (COUNT(?cited_work) AS ?count)
            (SAMPLE(?cited_work) AS ?example_cited_work)
            (SAMPLE(?citing_work) AS ?example_citing_work)
          WHERE {
            ?cited_work wdt:P1433 wd:${QID} .
            ?citing_work wdt:P2860 ?cited_work .
            ?cited_work wdt:P50 ?author .
          }
          GROUP BY ?author
        } AS %result
        WHERE {
          INCLUDE %result 
                  
          # Include optional ORCID iD
          OPTIONAL { ?author wdt:P496 ?orcid . }
          
          # Label the results
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
        LIMIT 100
          
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Investigaciones' },
          { key: 'author', label: 'Investigacion' },
          { key: 'orcid', label: 'Orcid' },
          { key: 'example_cited_work', label: 'Muestra de Cita de Investigacion' },
          { key: 'example_citing_work', label: 'Muestra de Investigacion Citadas' }
        ]

        res.results.bindings.forEach(element => {

          var _author = element["author"].value.split("/");
          var _example_citing_work = element['example_citing_work'].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            orcid: element.orcid ? element.orcid.value : '',
            author: {
              type: 'author',
              QID: element.author ? _author[_author.length - 1] : '',
              label: element.authorLabel ? element.authorLabel.value : ''
            },
            example_citing_work: {
              type: 'work',
              QID: element.example_citing_work ? _example_citing_work[_example_citing_work.length - 1] : '',
              label: element.example_citing_workLabel ? element.example_citing_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  citationDistribution(QID): Observable<any> {
    var query = `#defaultView:LineChart
  select ?number_of_citations (count(?work) as ?count) where {
    {
      SELECT ?work (COUNT(?citing_work) AS ?number_of_citations)
      WHERE {
        ?work wdt:P1433 wd:${QID}.   
        optional { ?citing_work wdt:P2860 ?work . }
      }
      GROUP BY ?work 
    }
  } 
  group by ?number_of_citations
  order by desc(?number_of_citations)  
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  citedVenues(QID): Observable<any> {
    var query = `
        # Cited venues from specific journal
        SELECT
          ?count
          ?short_name
          ?cited_journal ?cited_journalLabel
        WITH {
          SELECT
            (COUNT(?cited_work) AS ?count)
            ?cited_journal
            (SAMPLE(?short_name_) AS ?short_name)
          WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?work wdt:P2860 ?cited_work .
            ?cited_work wdt:P1433 ?cited_journal . 
            OPTIONAL {
              ?work wdt:P577 ?publication_datetime .
              BIND(xsd:date(?publication_datetime) AS ?publication_date)
            }
            OPTIONAL { ?cited_journal wdt:P1813 ?short_name_ . }
          }
          GROUP BY ?cited_journal
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
        LIMIT 200
        
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Eventos' },
          { key: 'short_name', label: 'Nombre Acotado' },
          { key: 'cited_journal', label: 'Revista Citada' }
        ]

        res.results.bindings.forEach(element => {

          var _cited_journal = element["cited_journal"].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            short_name: element.short_name ? element.short_name.value : '',
            cited_journal: {
              type: 'venue',
              QID: element.cited_journal ? _cited_journal[_cited_journal.length - 1] : '',
              label: element.cited_journalLabel ? element.cited_journalLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  venuesCitedFrom(QID): Observable<any> {
    var query = `
        #defaultView:Table
        # Venues citing articles from this specific journal
        SELECT
          ?count
          ?short_name
          ?citing_journal ?citing_journalLabel 
        WITH {
          SELECT
            (COUNT(?citing_work) as ?count)
            ?citing_journal
            (SAMPLE(?short_name_) AS ?short_name)
          WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?citing_work wdt:P2860 ?work .
            ?citing_work wdt:P1433 ?citing_journal .
            OPTIONAL { ?citing_journal wdt:P1813 ?short_name_ . }
          }
          GROUP BY ?citing_journal
          ORDER BY DESC(?count)
          LIMIT 1000
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        }
        ORDER BY DESC(?count)
          
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Eventos' },
          { key: 'short_name', label: 'Nombre Acotado' },
          { key: 'citing_journal', label: 'Citando Revista ' }
        ]

        res.results.bindings.forEach(element => {

          var _citing_journal = element["citing_journal"].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            short_name: element.short_name ? element.short_name.value : '',
            citing_journal: {
              type: 'venue',
              QID: element.citing_journal ? _citing_journal[_citing_journal.length - 1] : '',
              label: element.citing_journalLabel ? element.citing_journalLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  retractedArticles(QID): Observable<any> {
    var query = `
        SELECT DISTINCT
          ?retracted_work ?retracted_workLabel
          ?date
          ?citing_work ?citing_workLabel
        WITH {
          # Find retracted papers indicated by instance of retracted paper, 
          # by retraction notice property or by significant event
          SELECT DISTINCT ?retracted_work WHERE {
            # articles marked as "retracted"
            { ?retracted_work wdt:P31 wd:Q45182324 }
            UNION
            # articles linked to a retraction notice
            { ?retracted_work wdt:P5824 [] }
            UNION
            # articles with a 'retraction' event
            { ?retracted_work wdt:P793 wd:Q45203135 }
          }
        } AS %retracted_works
        WHERE {
          INCLUDE %retracted_works
          ?citing_work wdt:P2860 ?retracted_work ; wdt:P1433 wd:${QID} .
          OPTIONAL {
            ?retracted_work wdt:P5824 ?retraction .
            ?retraction wdt:P577 ?retraction_datetime
            FILTER ( ?citing_work != ?retraction )
          }
          MINUS { ?citing_work wdt:P31 wd:Q1348305 }
          OPTIONAL {
            ?retracted_work p:P793 [ ps:P793 wd:Q45203135 ; pq:P585 ?keyevent_datetime ]
          }
          BIND(COALESCE(xsd:date(COALESCE(?retraction_datetime, ?keyevent_datetime)), "Unknown date") AS ?date)
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        ORDER BY DESC(?date)
         
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'retracted_work', label: 'Investigacion Retirada' },
          { key: 'date', label: 'Fecha' },
          { key: 'citing_work', label: 'Citando Revista' }
        ]

        res.results.bindings.forEach(element => {

          var _retracted_work = element["retracted_work"].value.split("/");
          var _citing_work = element["citing_work"].value.split("/");

          columArray.push({
            count: element.count ? element.count.value : '',
            short_name: element.short_name ? element.short_name.value : '',
            retracted_work: {
              type: 'work',
              QID: element.retracted_work ? _retracted_work[_retracted_work.length - 1] : '',
              label: element.retracted_workLabel ? element.retracted_workLabel.value : ''
            },
            citing_work: {
              type: 'work',
              QID: element.citing_work ? _citing_work[_citing_work.length - 1] : '',
              label: element.citing_workLabel ? element.citing_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  genderDistribution(QID): Observable<any> {
    var query = `
        SELECT ?count ?gender ?genderLabel 
        WITH {
          SELECT (COUNT(DISTINCT ?author) AS ?count) ?gender WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?work wdt:P50 ?author .
            ?author wdt:P21 ?gender .
          } 
          GROUP BY ?gender
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        } 
         ORDER BY DESC(?count)
         
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Autores' },
          { key: 'gender', label: 'Genero' },
        ]

        res.results.bindings.forEach(element => {
          columArray.push({
            count: element.count ? element.count.value : '',
            gender: element.genderLabel ? element.genderLabel.value : '',
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  authorships(QID): Observable<any> {
    var query = `
        SELECT ?count ?gender ?genderLabel 
        WITH {
          SELECT (COUNT(?author) AS ?count) ?gender WHERE {
            ?work wdt:P1433 wd:${QID} .
            ?work wdt:P50 ?author .
            ?author wdt:P21 ?gender .
          } 
          GROUP BY ?gender
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . } 
        } 
         ORDER BY DESC(?count)
         
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'count', label: 'No. Autores' },
          { key: 'gender', label: 'Genero' },
        ]

        res.results.bindings.forEach(element => {
          columArray.push({
            count: element.count ? element.count.value : '',
            gender: element.genderLabel ? element.genderLabel.value : '',
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  authorAwards(QID): Observable<any> {
    var query = `
        SELECT DISTINCT
          ?year 
          ?author ?authorLabel
          ?award ?awardLabel ?awardDescription
        WHERE {
          [] wdt:P1433 wd:${QID} ;
             wdt:P50 ?author .
          ?author p:P166 ?award_statement .
          ?award_statement ps:P166 ?award .
          OPTIONAL {
            { ?award_statement pq:P585 ?time }
            UNION
            { ?award_statement pq:P580 ?time }
            BIND(YEAR(?time) AS ?year)
          }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }  
        }
        ORDER BY DESC(?year)
        LIMIT 500
         
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'year', label: 'No. Autores' },
          { key: 'author', label: 'Genero' },
          { key: 'award', label: 'Genero' },
        ]

        res.results.bindings.forEach(element => {
          var _author = element["author"].value.split('/');

          columArray.push({
            count: element.count ? element.count.value : '',
            author: {
              type: 'author',
              QID: element.author ? _author[_author.length - 1] : '',
              label: element.authorLabel ? element.author.valueLabel : ''
            },
            award: element.awardLabel ? element.awardLabel.value : ''
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }
}