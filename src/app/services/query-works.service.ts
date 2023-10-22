import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryWork {

  private endpointUrl = 'https://query.wikidata.org/sparql';
  private headers = { 'Accept': 'application/sparql-results+json' };

  constructor(
    private http: HttpClient,
  ) { }

  description(QID): Observable<any> {
    var query = `SELECT ?description ?value ?valueUrl
        WHERE {
          BIND(wd:Q94450044 AS ?work)
          {
            BIND(1 AS ?order)
            BIND("Title" AS ?description)
            ?work wdt:P1476 ?value .
          }
          UNION
          {
            SELECT
              (2 AS ?order)
              ("Authors" AS ?description)
              (GROUP_CONCAT(?value_; separator=", ") AS ?value)
              (CONCAT("../authors/", GROUP_CONCAT(?q; separator=",")) AS ?valueUrl)
            {
              BIND(1 AS ?dummy)
              wd:Q94450044 wdt:P50 ?iri .
              BIND(SUBSTR(STR(?iri), 32) AS ?q) 
              ?iri rdfs:label ?value_string . 
              FILTER (LANG(?value_string) = 'en')
              BIND(COALESCE(?value_string, ?q) AS ?value_)
            }
            GROUP BY ?dummy
          }
          UNION
          {
            SELECT
              (3 AS ?order)
              ("Editors" AS ?description)
              (GROUP_CONCAT(?value_; separator=", ") AS ?value)
              (CONCAT("../authors/", GROUP_CONCAT(?q; separator=",")) AS ?valueUrl)
            {
              BIND(1 AS ?dummy)
              wd:Q94450044 wdt:P98 ?iri .
              BIND(SUBSTR(STR(?iri), 32) AS ?q) 
              ?iri rdfs:label ?value_string . 
              FILTER (LANG(?value_string) = 'en')
              BIND(COALESCE(?value_string, ?q) AS ?value_)
            }
            GROUP BY ?dummy
          }
          UNION
          {
            SELECT
              (3 AS ?order)
              ("Reviewers" AS ?description)
              (GROUP_CONCAT(?value_; separator=", ") AS ?value)
              (CONCAT("../authors/", GROUP_CONCAT(?q; separator=",")) AS ?valueUrl)
            {
              BIND(1 AS ?dummy)
              wd:Q94450044 wdt:P4032 ?iri .
              BIND(SUBSTR(STR(?iri), 32) AS ?q) 
              ?iri rdfs:label ?value_string . 
              FILTER (LANG(?value_string) = 'en')
              BIND(COALESCE(?value_string, ?q) AS ?value_)
            }
            GROUP BY ?dummy
          }
          UNION
          {
            BIND(4 AS ?order)
            BIND("Published in" AS ?description)
            ?work wdt:P1433 ?iri .
            BIND(SUBSTR(STR(?iri), 32) AS ?q) 
            ?iri rdfs:label ?value_string . 
            FILTER (LANG(?value_string) = 'en')
            BIND(COALESCE(?value_string, ?q) AS ?value)
            BIND(CONCAT("../venue/", ?q) AS ?valueUrl)
          }
          UNION
          {
            BIND(4 AS ?order)
            BIND("Series" AS ?description)
            ?work wdt:P179 ?iri .
            BIND(SUBSTR(STR(?iri), 32) AS ?q) 
            ?iri rdfs:label ?value_string . 
            FILTER (LANG(?value_string) = 'en')
            BIND(COALESCE(?value_string, ?q) AS ?value)
            BIND(CONCAT("../series/", ?q) AS ?valueUrl)
          }
          UNION
          {
            BIND(6 AS ?order)
            BIND("Publication date" AS ?description)
            ?work p:P577 / psv:P577 ?publication_date_value .
            ?publication_date_value wikibase:timePrecision ?time_precision ;
                                    wikibase:timeValue ?publication_date .
            BIND(IF(?time_precision = 9, YEAR(?publication_date), xsd:date(?publication_date)) AS ?value)
          }
          UNION
          {
            SELECT
              (7 AS ?order)
              ("Topics" AS ?description)
              (GROUP_CONCAT(?value_; separator=", ") AS ?value)
              (CONCAT("../topics/", GROUP_CONCAT(?q; separator=",")) AS ?valueUrl)
            {
              BIND(1 AS ?dummy)
              wd:Q94450044 wdt:P921 ?iri .
              BIND(SUBSTR(STR(?iri), 32) AS ?q) 
              ?iri rdfs:label ?value_string . 
              FILTER (LANG(?value_string) = 'en')
              BIND(COALESCE(?value_string, ?q) AS ?value_)
            }
            GROUP BY ?dummy
          }
          UNION
          {
            BIND(10 AS ?order)
            BIND("DOI" AS ?description)
            ?work wdt:P356 ?valueUrl_ .
            BIND(CONCAT("https://dx.doi.org/", ENCODE_FOR_URI(?valueUrl_)) AS ?valueUrl)
            BIND(CONCAT(?valueUrl_, " ↗") AS ?value)
          }
          UNION
          {
            BIND(11 AS ?order)
            BIND("Homepage" AS ?description)
            ?work wdt:P856 ?valueUrl .
            BIND(STR(?valueUrl) AS ?value)
          }
          UNION
          {
            BIND(12 AS ?order)
            BIND("Full text" AS ?description)
            ?work wdt:P953 ?valueUrl .
            BIND(CONCAT(STR(?valueUrl), " ↗") AS ?value)
          }
        } 
        ORDER BY ?order
        `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'description', label: 'Descripcion' },
          { key: 'value', label: 'Valor' }
        ]

        res.results.bindings.forEach(element => {
          var _valueUrl = element['valueUrl'] ? element['valueUrl'].value.split("/") : '';

          columArray.push({
            description: element.description ? element.description.value : '',
            value: {
              type: 'URL',
              URL: element.valueUrl && element.description.value != 'DOI'
                ?
                _valueUrl[_valueUrl.length - 1]
                :
                element.valueUrl && element.description.value == 'DOI'
                  ?
                  element.valueUrl.value
                  : '',
              label: element.value.value ? element.value.value : ''
            },

          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  listAuthors(QID): Observable<any> {
    var query = `SELECT DISTINCT
          # Author order
          ?order
        
          ?academic_age
        
          # Author item and label
          ?author ?authorUrl ?authorDescription
          
          ?orcid
        WHERE {
          {
            wd:${QID} p:P50 ?author_statement .
            ?author_statement ps:P50 ?author_ .
            ?author_ rdfs:label ?author .
            FILTER (LANG(?author) = 'en')
            BIND(CONCAT("../author/", SUBSTR(STR(?author_), 32)) AS ?authorUrl)
            OPTIONAL {
              ?author_statement pq:P1545 ?order_ .
              BIND(xsd:integer(?order_) AS ?order)
            }
            OPTIONAL { ?author_ wdt:P496 ?orcid_ . }
            # Either show the ORCID iD or construct part of a URL to search on the ORCID homepage
            BIND(COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ENCODE_FOR_URI(?author))) AS ?orcid)
            OPTIONAL {
              ?author_ schema:description ?authorDescription .
              FILTER (LANG(?authorDescription) = "en")
            }
          }
          UNION
          {
            wd:${QID} p:P2093 ?authorstring_statement .
            ?authorstring_statement ps:P2093 ?author_
            BIND(CONCAT("UNRESOLVED: ", ?author_) AS ?author)
            OPTIONAL {
              ?authorstring_statement pq:P1545 ?order_ .
              BIND(xsd:integer(?order_) AS ?order)
            }
            BIND(CONCAT("https://author-disambiguator.toolforge.org/names_oauth.php?doit=Look+for+author&name=", ENCODE_FOR_URI(?author_)) AS ?authorUrl)
          }
          OPTIONAL {
            SELECT ?author_ (MAX(?academic_age_) AS ?academic_age) {
              wd:${QID} wdt:P50 ?author_ ;
                           wdt:P577 ?publication_date .
              ?author_ ^wdt:P50 / wdt:P577 ?other_publication_date .
              BIND(YEAR(?publication_date) - YEAR(?other_publication_date) AS ?academic_age_)
            }
            GROUP BY ?author_
          }
        }
        ORDER BY ?order               
       `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'order', label: 'Valor' },
          { key: 'academic_age', label: 'Edad Academica' },
          { key: 'author', label: 'Autor' },
          { key: 'orcid', label: 'Orcid' }
        ]

        res.results.bindings.forEach(element => {
          var _authorUrl = element['authorUrl'] ? element['authorUrl'].value.split("/") : '';
          var _author = element['author'] ? element['author'].value.split(":") : '';

          columArray.push({
            order: element.order ? element.order.value : '',
            academic_age: element.academic_age ? element.academic_age.value : '',
            author: {
              type: 'author',
              label: element.author ? element.author.value : '',
              QID: element.authorUrl ?
                _authorUrl[_authorUrl.length - 1] :
                _author[0] == 'UNRESOLVED' ?
                  element.authorUrl.value : ''
            },
            orcid: {
              type: 'orcid',
              value: element.orcid ? element.orcid.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  topicsScore(QID): Observable<any> {
    var query = `#defaultView:BubbleChart
  SELECT ?score ?topic ?topicLabel
  WITH {
    SELECT
      (SUM(?score_) AS ?score)
      ?topic
    WHERE {
      { 
        wd:${QID} wdt:P921 ?topic .
        BIND(20 AS ?score_)
      }
      UNION
      { 
       wd:${QID} wdt:P921/wdt:P279 ?topic .
       BIND(3 AS ?score_)
      }
      UNION
      {
        # Topic of a cited work
        wd:${QID} wdt:P2860/wdt:P921 ?topic .
        BIND(1 AS ?score_)
      }
      UNION
      {
        SELECT (1 AS ?score_) ?topic WHERE {
          ?citing_work wdt:P2860 wd:${QID} .
          ?citing_work wdt:P921 ?topic . 
        }
      }
    }
    GROUP BY ?topic
  } AS %results 
  WHERE {
    INCLUDE %results
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,da,de,es,jp,no,ru,sv,zh". }
  }
  ORDER BY DESC(?score)
  LIMIT 200`

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  timeLine(QID): Observable<any> {
    var query = `#defaultView:Timeline
  SELECT DISTINCT ?datetime ?description WHERE {
    {
      wd:${QID} wdt:P577 ?datetime .
      BIND("🌞 publication date" AS ?description)
    }
    UNION 
    {
      wd:${QID} wdt:P2507 / wdt:P577 ?datetime .
      BIND("❗ erratum" AS ?description)
    }
    UNION 
    {
      wd:${QID} wdt:P5824 / wdt:P577 ?datetime .
      BIND("⛔ retracted" AS ?description)
    }
    UNION 
    {
      wd:${QID} p:P793 ?event_statement .
      ?event_statement ps:P793 ?event_type .
      ?event_type rdfs:label ?description_ .
      ?event_statement pq:P585 ?datetime .
      FILTER (LANG(?description_) = "en")
      
      # Warning icon for retraction
      BIND(
        IF(
          ?event_type = wd:Q45203135,
          CONCAT("⛔ ", ?description_),
          IF(
            ?event_type = wd:Q56478588,
            CONCAT("❓ ", ?description_),
            ?description_
            )
          ) AS ?description)
    }
    UNION
    {
      SELECT ?datetime ?description WHERE {
        wd:${QID} wdt:P2860 / wdt:P577 ?datetime
        BIND("📖➡️ cited work with earliest publication date" AS ?description)
      }
      ORDER BY ?datetime
      LIMIT 1
    }
    UNION
    {
      SELECT ?datetime ?description WHERE {
        wd:${QID} wdt:P2860 / wdt:P577 ?datetime
        BIND("📖➡️ cited work with latest publication date" AS ?description)
      }
      ORDER BY DESC(?datetime)
      LIMIT 1
    }
    UNION
    {
      SELECT ?datetime ?description WHERE {
        wd:${QID} ^wdt:P2860 / wdt:P577 ?datetime
        BIND("📖⬅️ citing work with earliest publication date" AS ?description)
      }
      ORDER BY ?datetime
      LIMIT 1
    }
    UNION
    {
      SELECT ?datetime ?description WHERE {
        wd:${QID} ^wdt:P2860 / wdt:P577 ?datetime
        BIND("📖⬅️ citing work with latest publication date" AS ?description)
      }
      ORDER BY DESC(?datetime)
      LIMIT 1
    }
      UNION
    {
      wd:${QID} (wdt:P747 | ^wdt:P629) / wdt:P577 ?datetime
      BIND("🌞 Publication of edition" AS ?description)
    }
  }`

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  relatedWorks(QID): Observable<any> {
    var query = `SELECT ?count ?work ?workLabel
        WITH {
          SELECT ?work (COUNT(?work) AS ?count)
          WHERE {
            wd:${QID} (^wdt:P2860 | wdt:P2860) / (^wdt:P2860 | wdt:P2860)? ?work .
            FILTER (wd:${QID} != ?work)
          }
          GROUP BY ?work
          LIMIT 500
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,it,jp,nl,no,ru,sv,zh" . } 
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
        ]

        res.results.bindings.forEach(element => {
          var _work = element['work'] ? element['work'].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            work: {
              type: 'work',
              QID: element.work.value ? _work[_work.length - 1] : '',
              label: element.workLabel.value ? element.workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  citationsToWork(QID): Observable<any> {
    var query = `SELECT ?citations ?publication_date ?cited_work ?cited_workLabel 
        WITH {
          SELECT (MIN(?date) AS ?publication_date) (COUNT(?citing_cited_work) AS ?citations) ?cited_work 
          WHERE {
            wd:${QID} wdt:P2860 ?cited_work . 
            OPTIONAL {
              ?cited_work wdt:P577 ?datetime .
              BIND(xsd:date(?datetime) AS ?date)
            }
            OPTIONAL { ?citing_cited_work wdt:P2860 ?cited_work }
          }
          GROUP BY ?cited_work
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,it,jp,nl,no,ru,sv,zh" . } 
        } 
        ORDER BY DESC(?citations) DESC(?date)          
       `;
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'citations', label: 'Citaciones' },
          { key: 'publication_date', label: 'Fecha de Publicacion' },
          { key: 'cited_work', label: 'Investigacion Citada' },
        ]

        res.results.bindings.forEach(element => {
          var _cited_work = element['cited_work'] ? element['cited_work'].value.split("/") : '';

          columArray.push({
            citations: element.citations ? element.citations.value : '',
            publication_date: element.publication_date ? element.publication_date.value : '',
            cited_work: {
              type: 'work',
              QID: element.cited_work.value ? _cited_work[_cited_work.length - 1] : '',
              label: element.cited_workLabel.value ? element.cited_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  citedWorks(QID): Observable<any> {
    var query = `SELECT ?citations ?publication_date ?cited_work ?cited_workLabel 
        WITH {
          SELECT (MIN(?date) AS ?publication_date) (COUNT(?citing_cited_work) AS ?citations) ?cited_work 
          WHERE {
            wd:${QID} wdt:P2860 ?cited_work . 
            OPTIONAL {
              ?cited_work wdt:P577 ?datetime .
              BIND(xsd:date(?datetime) AS ?date)
            }
            OPTIONAL { ?citing_cited_work wdt:P2860 ?cited_work }
          }
          GROUP BY ?cited_work
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,it,jp,nl,no,ru,sv,zh" . } 
        } 
        ORDER BY DESC(?citations) DESC(?date)                
       `;
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'citations', label: 'No. Citaciones' },
          { key: 'cited_work', label: 'Invetigacion Citada' },
          { key: 'publication_date', label: 'Fecha de Publicacion' },
        ]

        res.results.bindings.forEach(element => {
          columArray.push({
            citations: element.citations ? element.citations.value : '',
            cited_work: {
              type: 'work',
              value: element.cited_work ? element.cited_work.value : '',
              label: element.cited_workLabel ? element.cited_workLabel.value : ''
            },
            publication_date: element.publication_date ? element.publication_date.value : ''
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  authorCitedWorks(QID): Observable<any> {
    var query = `SELECT
          ?cited_works
        
          ?author ?authorLabel
        
          # Either show the ORCID iD or construct part of a URL to search on the ORCID homepage
          (COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ENCODE_FOR_URI(?authorLabel))) AS ?orcid)
        WITH {
          SELECT (COUNT(?cited_work) AS ?cited_works) ?author
          WHERE {
            # Find works that are cited by the queried work
            wd:${QID} wdt:P2860 ?cited_work .
            ?cited_work wdt:P50 ?author .
          }
          GROUP BY ?author
          # Limit the number of results to avoid downloading too much data
          ORDER BY DESC(?cited_works)
          LIMIT 1000
        } AS %result
        WHERE {
          # Label the result
          INCLUDE %result
          OPTIONAL { ?author wdt:P496 ?orcid_ . }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
        }
        ORDER BY DESC(?cited_works)        
       `;
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'cited_works', label: 'no. Investigaciones Citadas' },
          { key: 'author', label: 'Autor' },
          { key: 'orcid', label: 'Orcid' }
        ]

        res.results.bindings.forEach(element => {

          columArray.push({
            cited_works: element.cited_works ? element.cited_works.value : '',
            author: {
              type: 'author',
              QID: element.author ? element.author.value : '',
              label: element.authorLabel ? element.authorLabel.value : ''
            },
            orcid: {
              type: 'orcid',
              value: element.orcid ? element.orcid.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  citationGraph(QID): Observable<any> {
    var query = `#defaultView:Graph
  SELECT
    ?citing_work ?citing_workLabel ?rgb 
    ?cited_work ?cited_workLabel
  WITH { 
    SELECT (COUNT(*) AS ?count) ?citing_work WHERE {
      wd:${QID} (^wdt:P2860 | wdt:P2860) / (^wdt:P2860 | wdt:P2860)? ?citing_work .
    }
    GROUP BY ?citing_work
    ORDER BY DESC(?count)
    LIMIT 40
  } AS %citing_works
  WITH { 
    SELECT (COUNT(*) AS ?count_) ?cited_work WHERE {
      wd:${QID} (^wdt:P2860 | wdt:P2860) / (^wdt:P2860 | wdt:P2860)? ?cited_work .
    }
    GROUP BY ?cited_work
    ORDER BY DESC(?count_)
    LIMIT 40
  } AS %cited_works
  WITH {
    SELECT (MAX(?count) AS ?max_count) WHERE {
      INCLUDE %citing_works
      BIND(1 AS ?dummy)
    } 
    GROUP BY ?dummy
  } AS %max_count
  WHERE {
    INCLUDE %citing_works
    INCLUDE %max_count
    INCLUDE %cited_works
    
    ?citing_work wdt:P2860 ?cited_work .
    
    BIND(STR(xsd:integer(99 * (1 - ?count / ?max_count))) AS ?grey)
    BIND(CONCAT(SUBSTR("0", 1, 2 - STRLEN(?grey)), ?grey) AS ?padded_grey)
    BIND(CONCAT(?padded_grey, ?padded_grey, ?padded_grey) AS ?rgb)
  
    { 
        ?citing_work (p:P50) ?citing_author_statement . 
        ?citing_author_statement pq:P1545 "1" .
        ?citing_author_statement ps:P50 ?citing_author .
        ?citing_author rdfs:label ?citing_author_name .
        filter(lang(?citing_author_name) = 'en')
      }
      union 
      { 
        ?citing_work (p:P2093) ?citing_author_statement . 
        ?citing_author_statement pq:P1545 "1" .
        ?citing_author_statement ps:P2093 ?citing_author_name .
      }
    
      { 
        ?cited_work (p:P50) ?cited_author_statement . 
        ?cited_author_statement pq:P1545 "1" .
        ?cited_author_statement ps:P50 ?cited_author .
        ?cited_author rdfs:label ?cited_author_name .
        filter(lang(?cited_author_name) = 'en')
      }
      union 
      { 
        ?cited_work (p:P2093) ?cited_author_statement . 
        ?cited_author_statement pq:P1545 "1" .
        ?cited_author_statement ps:P2093 ?cited_author_name .
      }
  
      ?citing_work wdt:P577 ?citing_date . 
      ?cited_work wdt:P577 ?cited_date . 
      bind(year(?citing_date) as ?citing_year)
      bind(year(?cited_date) as ?cited_year)
      bind(concat(?citing_author_name, ", ", str(?citing_year)) as ?citing_workLabel)
      bind(concat(?cited_author_name, ", ", str(?cited_year)) as ?cited_workLabel)
  }
  ORDER BY DESC(?count)`

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  citationYear(QID): Observable<any> {
    var query = `#defaultView:BarChart
  SELECT
    (STR(?year_) AS ?year)
    (SUM(?count_) AS ?count)
    ?kind
  WHERE {
    {
      VALUES ?year_ { 2000 2001 2002 2003 2004 2005 2006 2007 2008 2009
                     2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 }
      BIND(0 AS ?count_)
      BIND("_" AS ?kind)
    }
    UNION 
    {
      SELECT
        ?year_
        (COUNT(DISTINCT ?citing_work) AS ?count_)
        ?kind
      WHERE {
        ?citing_work wdt:P2860 wd:${QID} .
    
        # Detect self-citations
        BIND(IF(EXISTS { wd:${QID} wdt:P50 ?selfauthor . ?citing_work  wdt:P50 ?selfauthor } ,
          "detected incoming self-citations",
          "citations from others or non-detected self-citations") AS ?kind)
  
        # Year of citation
        ?citing_work wdt:P577 ?date .
        BIND(YEAR(?date) AS ?year_)
      }
      GROUP BY ?year_ ?kind
    }
    UNION 
    {
      SELECT
        ?year_
        (COUNT(DISTINCT ?cited_work) AS ?count_)
        ?kind
      WHERE {
        wd:${QID} wdt:P2860 ?cited_work .
    
        # Detect self-citations
        BIND(IF(EXISTS { ?cited_work wdt:P50 ?selfauthor . wd:${QID} wdt:P50 ?selfauthor },
          "detected outgoing self-citations",
          "outgoing citations to others or non-detected self-citations") AS ?kind)
  
        # Year of citation
        ?cited_work wdt:P577 ?date .
        BIND(YEAR(?date) AS ?year_)
      }
      GROUP BY ?year_ ?kind
    }
  }
  GROUP BY ?year_ ?kind
  ORDER BY DESC(?year_) `

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  wikipediaMentions(QID): Observable<any> {
    var query = `SELECT ?title ?titleUrl ?wikipedia ?wikipediaLabel WHERE {
          {
            SELECT ?title_ ?titleUrl ?wikipedia {
              SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:endpoint "da.wikipedia.org" ;
                                wikibase:api "Search" ;
                                mwapi:srsearch '${QID} OR "10.3390/ANTIOX9050358"' ;
                                mwapi:srlimit "200" .
                ?title_ wikibase:apiOutput mwapi:title .
              }
              BIND(URI(CONCAT("https://da.wikipedia.org/wiki/", ENCODE_FOR_URI(?title_))) AS ?titleUrl)
              BIND(wd:Q181163 AS ?wikipedia)
            } 
          }
          UNION
          {
            SELECT ?title_ ?titleUrl ?wikipedia {
              SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:endpoint "en.wikipedia.org" ;
                                wikibase:api "Search" ;
                                mwapi:srsearch '${QID} OR "10.3390/ANTIOX9050358"' ;
                                mwapi:srlimit "200" .
                ?title_ wikibase:apiOutput mwapi:title .
              }
              BIND(URI(CONCAT("https://en.wikipedia.org/wiki/", ENCODE_FOR_URI(?title_))) AS ?titleUrl)
              BIND(wd:Q328 AS ?wikipedia)
            }     
          }
          hint:Prior hint:runFirst "true" .
          BIND(CONCAT(?title_, " ↗") AS ?title)
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
        }                          
       `;
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'title', label: 'Titulo' },
          { key: 'wikipedia', label: 'Wikipedia' }
        ]

        res.results.bindings.forEach(element => {
          var _wikipedia = element['wikipedia'] ? element['wikipedia'].value.split("/") : '';

          columArray.push({
            title: {
              type: 'URL',
              URL: element.title ? element.title.value : '',
              label: element.titleUrl ? element.titleUrl.value : ''
            },
            wikipedia: {
              type: 'QID',
              QID: element.wikipedia ? _wikipedia[_wikipedia.length - 1] : '',
              label: element.wikipedia ? element.wikipedia.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }

  supportStatements(QID): Observable<any> {
    var query = `SELECT ?item ?itemLabel ?property ?propertyLabel ?value ?valueLabel 
        WITH {
          SELECT ?statement WHERE { 
              ?statement prov:wasDerivedFrom/pr:P248 wd:${QID} .
          }
          LIMIT 2000
        } AS %statements 
        WITH {
          SELECT distinct ?item ?property ?value
          WHERE {
            INCLUDE %statements
            ?item ?p ?statement .
            ?property wikibase:claim ?p . 
            ?statement ?a ?value .
            ?item ?b ?value . 
          }
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,it,jp,nl,no,ru,sv,zh" . } 
        } 
        ORDER BY DESC(?itemLabel)                            
       `;
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {

        var columArray = new Array()
        var rowColum = [
          { key: 'item', label: 'Articulo' },
          { key: 'property', label: 'Propiedad' },
          { key: 'value', label: 'Valor' }
        ]

        res.results.bindings.forEach(element => {
          var _item = element['item'] ? element['item'].value.split("/") : '';
          var _property = element['property'] ? element['property'].value.split("/") : '';
          var _value = element['value'] ? element['value'].value.split("/") : '';

          columArray.push({
            item: {
              type: 'QID',
              QID: element.item ? _item[_item.length - 1] : '',
              label: element.item ? element.item.value : ''
            },
            property: {
              type: 'QID',
              QID: element.property ? _property[_property.length - 1] : '',
              label: element.property ? element.property.value : ''
            },
            value: {
              type: 'QID',
              QID: element.value ? _value[_value.length - 1] : '',
              label: element.value ? element.value.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum };
      }));
  }
}