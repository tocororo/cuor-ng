import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryAuthors {

  private endpointUrl = 'https://query.wikidata.org/sparql';
  private headers = { 'Accept': 'application/sparql-results+json' };

  constructor(
    private http: HttpClient,
  ) { }

  listPublications(QID): Observable<any> {

    var query = `SELECT
      (MIN(?dates) AS ?date)
      ?work ?workLabel
      (GROUP_CONCAT(DISTINCT ?type_label; separator=", ") AS ?type)
      (SAMPLE(?pages_) AS ?pages)
      ?venue ?venueLabel
      (GROUP_CONCAT(DISTINCT ?author_label; separator=", ") AS ?authors)
      (CONCAT("../authors/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?author), 32); separator=",")) AS ?authorsUrl)
    WHERE {
      ?work wdt:P50 wd:${QID} .
      ?work wdt:P50 ?author .
      OPTIONAL {
        ?author rdfs:label ?author_label_ . FILTER (LANG(?author_label_) = 'en')
      }
      BIND(COALESCE(?author_label_, SUBSTR(STR(?author), 32)) AS ?author_label)
      OPTIONAL { ?work wdt:P31 ?type_ . ?type_ rdfs:label ?type_label . FILTER (LANG(?type_label) = 'en') }
      ?work wdt:P577 ?datetimes .
      BIND(xsd:date(?datetimes) AS ?dates)
      OPTIONAL { ?work wdt:P1104 ?pages_ }
      OPTIONAL { ?work wdt:P1433 ?venue }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,no,ru,sv,zh". }  
    }
    GROUP BY ?work ?workLabel ?venue ?venueLabel
    ORDER BY DESC(?date)  
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'date', label: 'Fecha' },
          { key: 'work', label: 'Investigacion' },
          { key: 'type', label: 'Tipo' },
          { key: 'pages', label: 'Paginas' },
          { key: 'venue', label: 'Lugar del Evento' },
          { key: 'authors', label: 'Investigadores' }
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _work = element["work"] ? element["work"].value.split("/") : '';
          var _venue = element["venue"] ? element["venue"].value.split("/") : '';
          var _authorsUrl = element["authorsUrl"] ? element["authorsUrl"].value.split("/") : '';

          columArray.push({
            date: element.date ? element.date.value : '',
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            },
            type: element.type ? element.type.value : '',
            pages: element.pages ? element.pages.value : '',
            venue: {
              type: 'venue',
              QID: element.venue ? _venue[_venue.length - 1] : '',
              label: element.venueLabel ? element.venueLabel.value : ''
            },
            authors: {
              type: 'authors',
              label: element.authors ? element.authors.value : '',
              QID: element.authorsUrl ? _authorsUrl[_authorsUrl.length - 1] : ''
            },
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  publicationsPerYear(QID): Observable<any> {
    const query = `#defaultView:BarChart
  # Inspired from LEGOLAS - http://abel.lis.illinois.edu/legolas/
  # Shubhanshu Mishra, Vetle Torvik
  select ?year (count(?work) as ?number_of_publications) ?role where {
    {
      select (str(?year_) as ?year) (0 as ?pages) ("_" as ?role) where {
        # default values = 0
        ?year_item wdt:P31 wd:Q577 . 
        ?year_item wdt:P585 ?date .
        bind(year(?date) as ?year_)
        {
          select (min(?year_) as ?earliest_year)  (max(?year_) as ?latest_year) where {
            ?work wdt:P50 wd:${QID} .
            ?work wdt:P577 ?publication_date . 
            bind(year(?publication_date) as ?year_)
          }
        }
        bind(year(now())+1 as ?next_year)
        filter (?year_ >= ?earliest_year && ?year_ <= ?latest_year)
      }
    }
    union {
    {
      select ?work (min(?years) as ?year) (count(?coauthors) as ?number_of_authors) ?author_number where {
        ?work (p:P50|p:P2093) ?author_statement . 
        ?author_statement ps:P50 wd:${QID} .
        optional { ?author_statement pq:P1545 ?author_number . }
        ?work (wdt:P50|wdt:P2093) ?coauthors . 
        ?work wdt:P577 ?dates .
        bind(str(year(?dates)) as ?years) .
      }
      group by ?work ?author_number
    }
    bind(coalesce(if(?number_of_authors = 1,
              'Solo author',
              if(xsd:integer(?author_number) = 1,
                 'First author',
                 if(xsd:integer(?author_number) = ?number_of_authors,
                    'Last author',
                    'Middle author'))), 'Unknown')
         as ?role)
     }
  }
  group by ?year ?role
  order by ?year`

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  pagesPerYear(QID): Observable<any> {
    const query = `#defaultView:BarChart
  select ?year ?number_of_pages ?work_label where {
    {
      select ?year (sample(?pages) as ?number_of_pages) ?work_label where {
        {
          select (str(?year_) as ?year) (0 as ?pages) ("_" as ?work_label) where {
            ?year_item wdt:P31 wd:Q577 . 
            ?year_item wdt:P585 ?date .
            bind(year(?date) as ?year_)
            {
              select (min(?year_) as ?earliest_year) (max(?year_) as ?latest_year) where {
                ?work wdt:P50 wd:${QID} .
                ?work wdt:P577 ?publication_date . 
                bind(year(?publication_date) as ?year_)
              }
            }
            filter (?year_ >= ?earliest_year && ?year_ <= ?latest_year)
          }
        }
        union {
          ?work wdt:P50 wd:${QID} .
          ?work wdt:P1104 ?pages .
          ?work wdt:P577 ?date . 
          ?work rdfs:label ?long_work_label . filter(lang(?long_work_label) = 'en')
          bind(substr(?long_work_label, 1, 20) as ?work_label)
          bind(str(year(?date)) as ?year) 
        }
    } 
    group by ?year ?work ?work_label
    order by ?year 
    }
  }`

    const endpointUrl = "https://query.wikidata.org/embed.html#";
    return of(endpointUrl + encodeURIComponent(query));
  }

  topicsScore(QID): Observable<any> {
    const query = `#defaultView:BubbleChart
  SELECT ?score ?topic ?topicLabel
  WITH {
    SELECT
      (SUM(?score_) AS ?score)
      ?topic
    WHERE {
      { 
        wd:${QID} wdt:P101 ?topic .
        BIND(20 AS ?score_)
      }
      UNION
      {
        SELECT (3 AS ?score_) ?topic WHERE {
          ?work wdt:P50 wd:${QID} ;
                wdt:P921 ?topic . 
        }
      }
      UNION
      {
        SELECT (1 AS ?score_) ?topic WHERE {
          ?work wdt:P50 wd:${QID} .
          ?citing_work wdt:P2860 ?work .
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

  topicsWorks(QID): Observable<any> {
    var query = `SELECT ?count ?theme ?themeLabel ?example_work ?example_workLabel
      WITH {
        SELECT (COUNT(?work) AS ?count) ?theme (SAMPLE(?work) AS ?example_work)
        WHERE {
          ?work wdt:P50 wd:${QID} .
          ?work wdt:P921 ?theme .
        }
        GROUP BY ?theme
      } AS %result
      WHERE {
        INCLUDE %result
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" . } 
      }
      ORDER BY DESC(?count)  
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'count', label: 'No. Temas' },
          { key: 'theme', label: 'Tema' },
          { key: 'example_work', label: 'Investigacion' }
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _example_work = element["example_work"] ? element["example_work"].value.split("/") : '';
          var _theme = element["theme"] ? element["theme"].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            theme: {
              type: 'topic',
              QID: element.theme ? _example_work[_example_work.length - 1] : '',
              label: element.themeLabel ? element.themeLabel.value : ''
            },
            example_work: {
              type: 'work',
              QID: element.example_work ? _theme[_theme.length - 1] : '',
              label: element.example_workLabel ? element.example_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  venueStatisticsGraph(QID): Observable<any> {
    const query = `#defaultView:BubbleChart
  SELECT ?count ?venue (SAMPLE(?venue_label_) AS ?venue_label) 
  WITH {
    SELECT (COUNT(?work) as ?count) ?venue WHERE {
      ?work wdt:P50 wd:${QID} .
      ?work wdt:P1433 ?venue .
    }
    GROUP BY ?venue
  } AS %counts
  WHERE {
    INCLUDE %counts
    ?venue rdfs:label ?long_venue_label FILTER(LANG(?long_venue_label) = 'en')
    OPTIONAL { ?venue wdt:P1813 ?short_name . }
    BIND(COALESCE(?short_name, ?long_venue_label) AS ?venue_label_)
  }
  GROUP BY ?venue ?count
  ORDER BY DESC(?count)  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }
  venueStatistics(QID): Observable<any> {

    var query = `SELECT
      ?count (SAMPLE(?short_name_) AS ?short_name)
      ?venue ?venueLabel
      ?topics ?topicsUrl
    WITH {
      SELECT
        (COUNT(DISTINCT ?work) as ?count)
        ?venue
        (GROUP_CONCAT(DISTINCT ?topic_label; separator=", ") AS ?topics)
        (CONCAT("../topics/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?topic), 32); separator=",")) AS ?topicsUrl)
      WHERE {
        ?work wdt:P50 wd:${QID} .
        ?work wdt:P1433 ?venue .
        OPTIONAL {
          ?venue wdt:P921 ?topic .
          ?topic rdfs:label ?topic_label . FILTER(LANG(?topic_label) = 'en') }
      }
      GROUP BY ?venue
    } AS %result
    WHERE {
      INCLUDE %result
      OPTIONAL { ?venue wdt:P1813 ?short_name_ . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }  
    } 
    GROUP BY ?count ?venue ?venueLabel ?topics ?topicsUrl
    ORDER BY DESC(?count)
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'count', label: 'No. Eventos' },
          { key: 'short_name', label: 'Nombre Acortado' },
          { key: 'venue', label: 'Lugar del Evento ' },
          { key: 'topics', label: 'Temas ' }
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _venue = element["venue"] ? element["venue"].value.split("/") : '';
          var _topicsUrl = element["topicsUrl"] ? element["topicsUrl"].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            short_name: element.short_name ? element.short_name.value : '',
            venue: {
              type: 'venue',
              QID: element.venue ? _venue[_venue.length - 1] : '',
              label: element.venueLabel ? element.venueLabel.value : ''
            },
            topics: {
              type: 'topics',
              label: element.topics ? element.topics.value : '',
              QID: element.topicsUrl ? _topicsUrl[_topicsUrl.length - 1] : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  coAuthorGraph(QID): Observable<any> {
    var query = `#defaultView:Graph
  # Egocentric co-author graph for an author
  SELECT ?author1 ?author1Label ?rgb ?author2 ?author2Label
  WITH {
    SELECT (COUNT(?work) AS ?count) ?author1 ?author2 WHERE {
      # Find co-authors
      ?work wdt:P50 wd:${QID}, ?author1, ?author2 .
  
      # Filtering 
      # Only journal and conference articles, books, not (yet?) software
      # VALUES ?publication_type { wd:Q13442814 wd:Q571 wd:Q26973022}  
      # ?work wdt:P31 ?publication_type .
    }
    GROUP BY ?author1 ?author2
    ORDER BY DESC(?count)
                      
    # Limit the size of the graph, to avoid overburdening the browser
    LIMIT 1000
  } AS %authors
  WITH {
    SELECT ?author1 ?author2 ?rgb WHERE {
      INCLUDE %authors
      
      # Exclude self-links
      FILTER (?author1 != ?author2)
      
      # Color according to gender
      OPTIONAL {
        ?author1 wdt:P21 ?gender1 . 
        BIND( IF(?gender1 = wd:Q6581097, "3182BD", "E6550D") AS ?rgb)
      }
    }
  } AS %result
  WHERE {
    INCLUDE %result
    # Label the results 
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,de,ru,es,zh,jp". }
  }`

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));
  }
  coAuthorMap(QID): Observable<any> {
    const query = `PREFIX target: <http://www.wikidata.org/entity/${QID}>

  #defaultView:Map
  SELECT ?organization ?organizationLabel ?geo ?count ?layer
  WITH {
    SELECT DISTINCT ?organization ?geo (COUNT(DISTINCT ?work) AS ?count) WHERE {
      ?work wdt:P50 target: ;
            wdt:P50 ?author .
      FILTER (?author != target: )
      ?author ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* ?organization . 
      ?organization wdt:P625 ?geo .
    }
    GROUP BY ?organization ?geo ?count
    ORDER BY DESC (?count)
    LIMIT 2000
  } AS %organizations
  WHERE {
    INCLUDE %organizations
    BIND(IF( (?count < 1), "No results", IF((?count < 2), "1 result", IF((?count < 5), "1 < results ≤ 10", IF((?count < 101), "10 < results ≤ 100", IF((?count < 1001), "100 < results ≤ 1000", IF((?count < 10001), "1000 < results ≤ 10000", "10000 or more results") ) ) ) )) AS ?layer )
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }        
   }
  ORDER BY DESC (?count)
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    /* await //console.log(endpointUrl + await encodeURIComponent(query)); */

    return of(endpointUrl + encodeURIComponent(query));;
  }

  otherLocations(QID): Observable<any> {
    const query = `#defaultView:Map
  SELECT DISTINCT ?image ?item ?itemLabel ?geo (?property_item_label AS ?layer)
  WHERE {
    wd:${QID} ?property ?item . 
    ?item p:P159/pq:P625 | wdt:P276*/wdt:P625 ?geo .
    ?property_item wikibase:directClaim ?property .
    OPTIONAL { ?item wdt:P18 ?image . } 
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
    
    # No automatic labeling on the property, - for some reason.
    ?property_item rdfs:label ?property_item_label . FILTER(LANG(?property_item_label) = 'en')
  }  
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  timeline(QID): Observable<any> {
    const query = `#defaultView:Timeline
  # Timeline for an author
  SELECT ?label ?beginning ?ending ?education_degree_label
  WITH {
    SELECT ?work (MIN(?publication_date) AS ?beginning) WHERE {
      ?work wdt:P50 wd:${QID} .
      ?work wdt:P577 ?publication_date . 
    }
    GROUP BY ?work
  } AS %works_with_publication_date
  WITH {
    
    SELECT ?work ?beginning (COUNT(?citing_article) AS ?number_of_citations) WHERE {
      INCLUDE %works_with_publication_date
      OPTIONAL { ?citing_article wdt:P2860 ?work . }
    }
    GROUP BY ?work ?beginning 
  } AS %works
  WHERE {
    # { Birth wd:${QID} wdt:P569 ?beginning . BIND("Birth" AS ?label) } UNION
    {
      { 
        SELECT ?work ?beginning WHERE {
          INCLUDE %works
        }
        ORDER BY DESC(?number_of_citations)
        LIMIT 1        
      }
      BIND("📖 publication of most cited article" AS ?label)
    }
    UNION
    {
      { 
        SELECT ?work ?beginning WHERE {
          INCLUDE %works
        }
        ORDER BY ?beginning
        LIMIT 1        
      }
      BIND("📖 first publication" AS ?label)
    }
    UNION
    {
      { 
        SELECT ?work ?beginning WHERE {
          INCLUDE %works
        }
        ORDER BY DESC(?beginning)
        LIMIT 1        
      }
      BIND("📖 latest publication" AS ?label)
    }
    UNION
    {
      # Education
      wd:${QID} p:P69 ?education_statement .
      ?education_statement ps:P69 ?education .
      ?education rdfs:label ?education_label . 
      FILTER (lang(?education_label) = 'en')
      BIND(CONCAT("🦉 ", ?education_label) AS ?label)
      OPTIONAL { ?education_statement pq:P580 ?beginning . }
      OPTIONAL { ?education_statement pq:P582 ?ending . }
      OPTIONAL {
        ?education_statement pq:P512 ?education_degree . 
        ?education_degree rdfs:label ?education_degree_label .
        FILTER (lang(?education_degree_label) = 'en')
      }
    }
    UNION
    {
      # Affiliation
      wd:${QID} p:P1416 | p:P108 ?affiliation_statement .
      ?affiliation_statement ps:P1416 | ps:P108 ?affiliation .
      ?affiliation rdfs:label ?affiliation_label .
      FILTER (lang(?affiliation_label) = 'en')
      BIND(CONCAT("🏠 ",?affiliation_label) AS ?label)
      # OPTIONAL { ?affiliation wdt:P18 ?image }
      OPTIONAL { ?affiliation_statement pq:P580 ?beginning . }
      OPTIONAL { ?affiliation_statement pq:P582 ?ending . }
      OPTIONAL {
        ?affiliation_statement pq:P512 ?affiliation_degree . 
        ?affiliation_degree rdfs:label ?affiliation_degree_label .
        FILTER (lang(?affiliation_degree_label) = 'en')
      }
    }
    UNION
    {
      wd:${QID} p:P166 ?award_statement . 
      ?award_statement ps:P166 ?award .
      ?award rdfs:label ?award_label .
      FILTER (lang(?award_label) = 'en')
      BIND(CONCAT("🏆 ",?award_label) AS ?label)
      ?award_statement pq:P585 ?beginning .
    }
  
  } 
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  academicTree(QID): Observable<any> {
    const query = `#defaultView:Graph
  # Doctoral student/advisor network with a source from a spectific researcher
  PREFIX gas: <http://www.bigdata.com/rdf/gas#>
  
  SELECT DISTINCT ?student1 ?student1Label ?supervisor1 ?supervisor1Label
  WHERE {
    { 
      SELECT ?student1 ?supervisor1 (MIN(?depth1) as ?depth)
      WHERE {
        SERVICE gas:service {
          gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
                  gas:in wd:${QID} ; 
                  gas:traversalDirection "Forward" ;
                  gas:out ?student1 ;
                  gas:out1 ?depth1 ;
                  gas:out2 ?supervisor1 ;
                  gas:linkType wdt:P185 ;
        }
      }
      GROUP BY ?student1 ?supervisor1
    }
    UNION
    { 
      SELECT ?student1 ?supervisor1 (MIN(?depth1) as ?depth)
      WHERE {
        service gas:service {
          gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
                  gas:in wd:${QID} ; 
                  gas:traversalDirection "Forward" ;
                  gas:out ?supervisor1 ;
                  gas:out1 ?depth1 ;
                  gas:out2 ?student1 ;
                  gas:linkType wdt:P184 ;
        }
      }
      GROUP BY ?student1 ?supervisor1
    }
    UNION
    { 
      SELECT ?student1 ?supervisor1 (MIN(?depth1) as ?depth)
      WHERE {
        SERVICE gas:service {
          gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
                  gas:in wd:${QID} ; 
                  gas:traversalDirection "Reverse" ;
                  gas:out ?student1 ;
                  gas:out1 ?depth1 ;
                  gas:out2 ?supervisor1 ;
                  gas:linkType wdt:P184 ;
        }
      }
      GROUP BY ?student1 ?supervisor1
    }
    UNION
    { 
      SELECT ?student1 ?supervisor1 (MIN(?depth1) as ?depth)
      WHERE {
        SERVICE gas:service {
          gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
                  gas:in wd:${QID} ; 
                  gas:traversalDirection "Reverse" ;
                  gas:out ?supervisor1 ;
                  gas:out1 ?depth1 ;
                  gas:out2 ?student1 ;
                  gas:linkType wdt:P185 ;
        }
      }
      GROUP BY ?student1 ?supervisor1
    }
    
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,sv,jp,zh,ru,fr,de" .  } 
  }  
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  extationStatistics(QID): Observable<any> {

    var query = `SELECT ?count ?work ?workLabel 
      WITH {
        SELECT (count(?citing_work) as ?count) ?work WHERE {
          ?work wdt:P50 wd:${QID} .
          OPTIONAL { ?citing_work wdt:P2860 ?work . }
        }
        GROUP BY ?work
      } AS %result
      WHERE {
        INCLUDE %result
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,jp". }        
      }  
      ORDER BY DESC(?count)
      LIMIT 500  
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'count', label: 'No. Citaciones' },
          { key: 'work', label: 'Investigacion' },
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _work = element["work"] ? element["work"].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  citationsYear(QID): Observable<any> {
    const query = `#defaultView:BarChart
  SELECT ?year (count(distinct ?citing_work) as ?count) ?kind  WHERE {
    ?work wdt:P50 wd:${QID} .
    ?citing_work wdt:P2860 ?work .
    bind(if (exists { ?citing_work wdt:P50 wd:${QID} }, "self-citations", "citations from others") as ?kind)
    ?citing_work wdt:P577 ?date .
    BIND(str(YEAR(?date)) AS ?year)
  } group by ?year ?kind
  order by desc(?year)    
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  citingAuthors(QID): Observable<any> {

    var query = `SELECT
      ?count
      ?citing_author ?citing_authorLabel
    
      # Either show the ORCID iD or construct part of a URL to search on the ORCID homepage
      (COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ENCODE_FOR_URI(?citing_authorLabel))) AS ?orcid)
    WITH {
      SELECT (COUNT(?citing_work) AS ?count) ?citing_author WHERE {
        ?work wdt:P50 wd:${QID} .
        ?citing_work wdt:P2860 ?work . 
        MINUS { ?citing_work wdt:P50 wd:${QID} }
        ?citing_work wdt:P50 ?citing_author .
      }
      GROUP BY ?citing_author 
      ORDER BY DESC(?count)
      LIMIT 500
    } AS %counts
    WITH {
      # An author might have multiple ORCID iDs
      SELECT
        ?count
        ?citing_author
        (SAMPLE(?orcids) AS ?orcid_)
      WHERE {
        INCLUDE %counts
        OPTIONAL { ?citing_author wdt:P496 ?orcids }
      }
      GROUP BY ?count ?citing_author
    } AS %result
    WHERE {
      INCLUDE %result
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
    } 
    ORDER BY DESC(?count)
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'count', label: 'No. Citaciones' },
          { key: 'citing_author', label: 'Autores  Citados' },
          { key: 'orcid', label: 'ORCID' },
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _citing_author = element["citing_author"] ? element["citing_author"].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            citing_author: {
              type: 'author',
              QID: element.citing_author ? _citing_author[_citing_author.length - 1] : '',
              label: element.citing_authorLabel ? element.citing_authorLabel.value : ''
            },
            orcid: {
              type: 'orcid',
              value: element.orcid ? element.orcid.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  asociatedImages(QID): Observable<any> {
    const query = `#defaultView:ImageGrid
  SELECT DISTINCT ?image WHERE {
    {
      # Images of the person
      wd:${QID} wdt:P18 ?image .
    }
    UNION {
      # Images from whatever property value is linked.
      
      # Excluded "different from" property and take all other properties
      wd:${QID} !wdt:P1889 ?item .
  
      ?item wdt:P18 ?image . 
      
      # All people are humans, so these images are excluded.
      FILTER (?item != wd:Q5)
    }
    UNION {
      # Images associated with works of the author, both direct images,
      # images of topics of the works and images of coauthors.
      wd:${QID} ^wdt:P50 / (wdt:P921* | wdt:P50) / wdt:P18 ?image .
    }
  }     
  `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  events(QID): Observable<any> {

    var query = `SELECT
      (xsd:date(MIN(?start)) AS ?date)  
      ?event
      ?eventLabel
      (GROUP_CONCAT(DISTINCT ?role; separator=", ") AS ?roles)
      (GROUP_CONCAT(DISTINCT ?location_label; separator=", ") AS ?locations)
    WHERE {
        BIND(wd:${QID} AS ?person)
        {  # speaker
          ?event wdt:P823 ?person .
          BIND("speaker" AS ?role)
        } UNION {  # organizer
          ?event wdt:P664 ?person .
          BIND("organizer" AS ?role)
        } UNION {  # participant
          ?person wdt:P1344 | ^wdt:P710 ?event  .
          BIND("participant" AS ?role)
        } UNION {  # editor
          ?person ^wdt:P98 / wdt:P4745 ?event  .
          BIND("editor of proceedings" AS ?role)
        } UNION {  # author
          ?person ^wdt:P50 / wdt:P1433 / wdt:P4745 ?event  .
          BIND("author" AS ?role)
        } UNION {  # program committee member
          ?event wdt:P5804 ?person .
          BIND("program committee member" AS ?role)
        }
        OPTIONAL { ?event wdt:P276 ?location . ?location rdfs:label ?location_label . FILTER (LANG(?location_label) = 'en')}
        OPTIONAL { ?event wdt:P580 | wdt:P585 ?start }
     
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,da,de,es,fr,jp,no,ru,sv,zh". }
    }
    GROUP BY ?event ?eventLabel
    ORDER BY DESC(?date) 
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'date', label: 'Fecha' },
          { key: 'event', label: 'Evento' },
          { key: 'roles', label: 'Roles' },
          { key: 'locations', label: 'Localizacion' },
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _event = element["event"] ? element["event"].value.split("/") : '';

          columArray.push({
            count: element.count ? element.count.value : '',
            event: {
              type: 'QID',
              QID: element.event ? _event[_event.length - 1] : '',
              label: element.eventLabel ? element.eventLabel.value : ''
            },
            roles: element.roles ? element.roles.value : '',
            locations: element.locations ? element.locations.value : ''
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  /* 
  ............authors....................
   */

  authors(strQID): Observable<any> {

    var str = strQID.split(',')
    var chart: string = '';

    str.forEach(element => {
      chart += ` wd:${element} `;
    });

    var query = `
  SELECT ?author ?authorLabel ?authorDescription ?example_work ?example_workLabel
  WITH {
    SELECT ?author (SAMPLE(?work) AS ?example_work) WHERE {
      VALUES ?author {${chart}}
      OPTIONAL { ?work wdt:P50 ?author }
    }
    GROUP BY ?author
  } AS %result
  WHERE {
    INCLUDE %result
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,es,fr,nl,no,ru,sv,zh". }
  }
  
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'author', label: 'Autor' },
          { key: 'authorDescription', label: 'Descripcion del Autor' },
          { key: 'example_work', label: 'Muestra de la Investigacion' },
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          var _author = element["author"] ? element["author"].value.split("/") : '';
          var _example_work = element["_example_work"] ? element["example_work"].value.split("/") : '';

          columArray.push({
            author: {
              type: 'author',
              QID: element.author ? _author[_author.length - 1] : '',
              label: element.authorLabel ? element.authorLabel.value : ''
            },
            authorDescription: element.authorDescription ? element.authorDescription.value : '',
            example_work: {
              type: 'work',
              QID: element.example_work ? _example_work[_example_work.length - 1] : '',
              label: element.example_workLabel ? element.example_workLabel.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  jointlyAuthoredWorks(strQID): Observable<any> {

    var str = strQID.split(',')
    var chart: string = '';

    str.forEach(element => {
      chart += ` wd:${element} `;
    });

    var query = `
  SELECT
    ?coauthor_count
    ?work ?workLabel
    ?authors ?authorsUrl
  WITH {
    SELECT 
      (COUNT(?author) AS ?coauthor_count)
      ?work 
      (GROUP_CONCAT(?author_label; separator=", ") AS ?authors)
      (GROUP_CONCAT(SUBSTR(STR(?author), 32); separator=",") AS ?authorsUrl)
    {
      VALUES ?author {${chart}}
      ?work wdt:P50 ?author .
      OPTIONAL { ?author rdfs:label ?author_label . FILTER(LANG(?author_label) = 'en') }
    }
    GROUP BY ?work
    HAVING(?coauthor_count > 1)
  } AS %result
  WHERE {
    INCLUDE %result
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,es,fr,nl,no,ru,sv,zh". }
  }
  ORDER BY DESC(?coauthor_count)
  
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        //console.log(queryResult);

        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'coauthor_count', label: 'No. CoAutores' },
          { key: 'work', label: 'Investigacion' },
          { key: 'authors', label: 'Autores' },
        ]
        //console.log(rowColum);

        res.results.bindings.forEach(element => {
          //var _authors = element["authors"] ? element["authors"].value.split("/") :'';
          var _work = element["author"] ? element["_work"].value.split("/") : '';

          columArray.push({
            coauthor_count: element.coauthor_count ? element.coauthor_count.value : '',
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            },
            authors: {
              type: 'authors',
              label: element.authors ? element.authors.value : '',
              QID: element.authorsUrl ? element.authorsUrl.value : ''
            }
          });
        });
        return { rowCell: columArray, rowColum: rowColum }
      }))//console.log(columArray);

  }

  worksPublicationYear(strQID): Observable<any> {
    var str = strQID.split(',')
    var chart: string = '';

    str.forEach(element => {
      chart += ` wd:${element} `;
    });
    var query = `#defaultView:BarChart
  SELECT ?year ?number_of_works ?author_label WHERE {
    {
      SELECT ?year ?number_of_works ?author ?author_label_
      WHERE {
        {
          SELECT ?author ?year (COUNT(?work) AS ?number_of_works) WHERE {
            hint:Query hint:optimizer "None".
            VALUES ?author {${chart}}
            ?work wdt:P50 ?author .
            ?work wdt:P577 ?publication_date .
            BIND(STR(YEAR(?publication_date)) AS ?year)
          }
          GROUP BY ?author ?year 
        } 
        ?author rdfs:label ?author_label_ .
        FILTER (LANG(?author_label_) = 'en')
      }
    }
    # Represent the author by name and Q identifier
    BIND (CONCAT(?author_label_, " (", SUBSTR(STR(?author), 32), ")") AS ?author_label)
  }
  ORDER BY ?year`

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  citationsPublicationYear(strQID): Observable<any> {
    var str = strQID.split(',')
    var chart: string = '';

    str.forEach(element => {
      chart += ` wd:${element} `;
    });
    var query = `#defaultView:BarChart
  SELECT ?year ?number_of_citations ?author_label 
  WHERE {
    {
      SELECT ?year ?number_of_citations ?author ?author_label_
      WHERE {
        {
          SELECT ?author ?year (COUNT(?citing_work) AS ?number_of_citations) WHERE {
            hint:Query hint:optimizer "None".
            VALUES ?author {${chart}}
            ?work wdt:P50 ?author .
            ?work wdt:P577 ?publication_date .
            ?citing_work wdt:P2860 ?work
            BIND(STR(YEAR(?publication_date)) AS ?year)
          }
          GROUP BY ?author ?year 
        } 
        ?author rdfs:label ?author_label_ .
        FILTER (LANG(?author_label_) = 'en')
      }
    }
    # Represent the author by name and Q identifier
    BIND (CONCAT(?author_label_, " (", SUBSTR(STR(?author), 32), ")") AS ?author_label)
  }
  ORDER BY ?year`

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  coAuthorsGraph(strQID): Observable<any> {
    var str = strQID.split(',')
    var chart: string = '';

    str.forEach(element => {
      chart += ` wd:${element} `;
    });
    var query = `#defaultView:Graph
  PREFIX gas: <http://www.bigdata.com/rdf/gas#>
  
  SELECT ?author ?authorLabel ?work ?workLabel 
  WITH {
   SELECT ?work ?author WHERE { 
    { }
               UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q74409278 ;
             gas:target wd:Q94450043 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
          UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q58404475 ;
             gas:target wd:Q74409278 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
             UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q58404475 ;
             gas:target wd:Q94450043 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
          UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q46368608 ;
             gas:target wd:Q74409278 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
       UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q46368608 ;
             gas:target wd:Q58404475 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
           UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q46368608 ;
             gas:target wd:Q94450043 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
          UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q43298899 ;
             gas:target wd:Q74409278 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
       UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q43298899 ;
             gas:target wd:Q58404475 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
       UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q43298899 ;
             gas:target wd:Q46368608 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
         UNION {
     SELECT ?work ?author WHERE {
      SERVICE gas:service {
       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.BFS" ;
             gas:in wd:Q43298899 ;
             gas:target wd:Q94450043 ;
             gas:traversalDirection "Undirected" ;
             gas:out ?work ;
             gas:linkType wdt:P50 ;
            gas:maxVisited 5000 .
      }
      ?work wdt:P50 ?author
     }
    } # UNION END
                      } 
  } AS %result 
  WHERE {
   INCLUDE %result 
   SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,he,jp,nl,no,ru,sv,zh" . }
  } `

    const endpointUrl = "https://query.wikidata.org/embed.html#";

    return of(endpointUrl + encodeURIComponent(query));;
  }

  /* 
  .......................others....................... 
  */

  getORCID(QID, label): Observable<any> {

    var query: string = '';
    var queryResult: any = '';
    var ORCID: any = "";

    query = `
  #defaultView:Table
  SELECT
    ?author ?authorLabel
  
    # Either show the ORCID iD or construct part of a URL to search on the ORCID homepage
    (COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ENCODE_FOR_URI(?citing_authorLabel))) AS ?orcid)
  
  WITH {
    # An author might have multiple ORCID iDs
    SELECT
      ?author
      (SAMPLE(?orcids) AS ?orcid_)
    WHERE {
      ?work wdt:P50 wd:${QID} .
      ?work wdt:P50 ?author .
      OPTIONAL { ?author wdt:P496 ?orcids }
    }
    GROUP BY ?author
  } AS %result
  WHERE {
    INCLUDE %result
    
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
  } 
     `;

    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

    return this.http.get(fullUrl, { headers: this.headers }).pipe(
      map((res: any) => {
        res.results.bindings.forEach(element => {
          var _label = label.replace(/%20/g, " ");

          if (element["authorLabel"] && element["authorLabel"].value == _label)
            ORCID = element["orcid"].value
        })
        return ORCID;
      }))
  }
}