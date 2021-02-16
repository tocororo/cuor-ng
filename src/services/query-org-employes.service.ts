import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QueryOrgEmployes {

  private endpointUrl = 'https://query.wikidata.org/sparql';
  private headers = { 'Accept': 'application/sparql-results+json' };

  constructor(
    private http: HttpClient,
  ) { }

  employes(QID):Observable<any> {

  var query = `SELECT
        (SAMPLE(?number_of_works_) AS ?works)
        (SAMPLE(?wikis_) AS ?wikis)
        ?researcher ?researcherLabel ?researcherDescription
        (SAMPLE(?orcid_) AS ?orcid)
      WITH {
        SELECT DISTINCT ?researcher WHERE {
          ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} . 
        } 
      } AS %researchers
      WITH {
        SELECT
          (COUNT(?work) AS ?number_of_works_) ?researcher
        WHERE {
          INCLUDE %researchers
          OPTIONAL { ?work wdt:P50 ?researcher . }
        } 
        GROUP BY ?researcher
      } AS %researchers_and_number_of_works
      WHERE {
        INCLUDE %researchers_and_number_of_works
        OPTIONAL { ?researcher wdt:P496 ?orcid_ . }
        OPTIONAL { ?researcher wikibase:sitelinks ?wikis_ }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es" . } 
      }
      GROUP BY ?researcher ?researcherLabel ?researcherDescription 
      ORDER BY DESC(?works)
       `;
      
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        //adjust data before return

        var columArray = new Array()
        var rowColum = [
          { key: 'works', label: 'No. Investigaciones' },
          { key: 'wikis', label: 'Wikis' },
          { key: 'researcher', label: 'Investigador' },
          { key: 'researcherDescription', label: 'Descripcion de la Investigacion' },
          { key: 'orcid', label: 'ORCID' }
        ]
        //console.log(rowColum);
      
         res.results.bindings.forEach(element => {
          var _researcher = element['researcher'] ? element['researcher'].value.split("/") :'';
          columArray.push({
            works: element.works ? element.works.value : '',
            wikis: element.wikis ? element.wikis.value : '',
            researcher: {
              type: 'author',
              QID: element.researcher ? _researcher[_researcher.length - 1] : '',
              label: element.researcherLabel ? element.researcherLabel.value : ''
            },
            researcherDescription: element.researcherDescription ? element.researcherDescription.value : '',
            orcid: {
              type: 'orcid',
              value: element.orcid ? element.orcid.value : ''
            }
          });
        });
        //console.log( { rowCell: columArray, rowColum: rowColum });
        
        return { rowCell: columArray, rowColum: rowColum }
      })
    );
  }

  coAuthorGraph(QID):Observable<any> {
  var query = `#defaultView:Graph
SELECT
  ?author1 ?author1Label ?image1 ?rgb
  ?author2 ?author2Label ?image2 
WITH {
  SELECT
    ?author1 (SAMPLE(?image1_) AS ?image1)
    ?author2 (SAMPLE(?image2_) AS ?image2)
    (SAMPLE(?rgb_) AS ?rgb)
  WHERE {
    wd:${QID} ^wdt:P361* / ^( wdt:P108 | wdt:P1416 | wdt:P463 ) ?author1 , ?author2 . 
    ?work wdt:P50 ?author1 , ?author2 .

    # Only display co-authorship for certain types of documents
    # Journal and conference articles, books, not (yet?) software
    VALUES ?publication_type { wd:Q13442814 wd:Q571 wd:Q26973022 wd:Q17928402 wd:Q947859 wd:Q54670950 }
    FILTER EXISTS { ?work wdt:P31 ?publication_type . }

    # No self-links.
    FILTER (?author1 != ?author2)

    # Images
    OPTIONAL { ?author1 wdt:P18 ?image1_ }
    OPTIONAL { ?author2 wdt:P18 ?image2_ }

    # Coloring of the nodes
    BIND("FFFFFF" AS ?rgb_)
  }
  GROUP BY ?author1 ?author2
} AS %result
WHERE {
  INCLUDE %result
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,sv,ru,zh".
  }
}`

const endpointUrl = 'https://query.wikidata.org/embed.html#'
//console.log(endpointUrl + encodeURIComponent(query));

return of ( endpointUrl + encodeURIComponent(query));
}

  advisorGraph(QID):Observable<any> {
var query = `
#defaultView:Graph
SELECT ?author1 ?author1Label ?rgb ?author2 ?author2Label 
WITH {
  SELECT ?author1 ?author2 ?rgb WHERE {
    { ?author1 wdt:P108 wd:${QID} . } union { ?author1 wdt:P1416 [ wdt:P361* wd:${QID} ] .  }
    { ?author2 wdt:P108 wd:${QID} . } union { ?author2 wdt:P1416 [ wdt:P361* wd:${QID} ] .  }
    {?author1 wdt:P184 ?author2 }
    UNION
    {?author2 wdt:P185 ?author1 }
    ?author1 wdt:P21 ?gender1 . 
    BIND ( IF(?gender1 = wd:Q6581097, "3182BD", "E6550D") AS ?rgb)
  }
} AS %result
WHERE {
  INCLUDE %result
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,sv,ru,zh".
  }
}
`
const endpointUrl = 'https://query.wikidata.org/embed.html#'
return of ( endpointUrl + encodeURIComponent(query));
}

  topicsPublished(QID):Observable<any> {

  var query = `SELECT
        ?researchers
        ?topic ?topicLabel
        ("🔎" AS ?zoom)
        (CONCAT("${QID}/topic/", SUBSTR(STR(?topic), 32)) AS ?zoomUrl)
        ?topicDescription
        ?samplework ?sampleworkLabel
      WITH {
        SELECT DISTINCT ?researcher WHERE {
          ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} . 
        } 
      } AS %researchers
      WITH {
        SELECT DISTINCT ?topic
          (COUNT(DISTINCT ?researcher) AS ?researchers)
          (SAMPLE(?work) AS ?samplework)
        WHERE {
          INCLUDE %researchers
          ?work wdt:P50 ?researcher . 
          ?work wdt:P921 ?topic . 
        } 
        GROUP BY ?topic
        ORDER BY DESC(?researchers)
        LIMIT 500
      } AS %works_and_number_of_researchers
      WHERE {
        INCLUDE %works_and_number_of_researchers
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,nl,no,ru,sv,zh" . } 
      }
      GROUP BY ?researchers ?topic ?topicLabel ?topicDescription ?samplework ?sampleworkLabel
      ORDER BY DESC(?researchers)
       `;

  
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        //adjust data before return
        var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'researcher', label: 'No. Investigadores' },
    { key: 'topic', label: 'Tema' },
    //{ key: 'zoom', label: 'Zoom' },
    { key: 'topicDescription', label: 'Descripcion del Tema' },
    { key: 'samplework', label: 'Muestra de Trabajo' }
  ]

  res.results.bindings.forEach(element => {
    var _topic = element["topic"] ? element["topic"].value.split("/") :'';
    var samplework = element["samplework"] ? element["samplework"].value.split("/") :'';

    columArray.push({
      researcher: element.researchers ? element.researchers.value : '',
      topic: {
        type: 'topic',
        label: element.topicLabel ? element.topicLabel.value : '',
        QID: element.topic ? _topic[_topic.length - 1] : ''
      },
     /*  zoom: {
        type: 'URL',
        label: element.zoom ? element.zoom.value : '',
        URL: element.zoomUrl ? element.zoomUrl.value : ''
      }, */
      topicDescription: element.topicDescription ? element.topicDescription.value : '',
      samplework: {
        type: 'work',
        label: element.sampleworkLabel ? element.sampleworkLabel.value : '',
        QID: element.samplework ? samplework[samplework.length - 1] : ''
      }
    })
  });
        return {rowCell: columArray, rowColum: rowColum}; 
      })
    );
  }

  recentPublications(QID):Observable<any> {

  var query = `SELECT
        ?publication_date
        ?work ?workLabel
        ?researchers ?researchersUrl
      WITH {
        SELECT 
          (MIN(?publication_datetimes) AS ?publication_datetime) ?work 
          (GROUP_CONCAT(DISTINCT ?researcher_label; separator=', ') AS ?researchers)
          (CONCAT("../authors/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?researcher), 32); separator=",")) AS ?researchersUrl)
        WHERE {                                                         
          ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} .
          ?work wdt:P50 ?researcher .
          ?researcher rdfs:label ?researcher_label . FILTER (LANG(?researcher_label) = 'en')
          OPTIONAL {
            ?work wdt:P577 ?publication_datetimes .
          }
        }
        GROUP BY ?work
        ORDER BY DESC(?publication_datetime)
        LIMIT 200  
      } AS %results
      WHERE {
        INCLUDE %results
        BIND(xsd:date(?publication_datetime) AS ?publication_date)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,nl,ru,zh". }
      }
      ORDER BY DESC(?publication_date)
      `;

  
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        
        var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'publication_date', label: 'Fecha de Publicacion' },
    { key: 'work', label: 'Investigaciones' },
    { key: 'researchers', label: 'Investigadores' }
  ]
  //console.log(rowColum);

   res.results.bindings.forEach(element => {

    var _work = element["work"].value.split("/");

    columArray.push({
      publication_date: element.publication_date ? element.publication_date.value : '',
      work: {
        type: 'work',
        QID: element.work ? _work[_work.length - 1] : '',
        label: element.workLabel ? element.workLabel.value : ''
      },
      researchers: {
        type: 'URL',
        URL: element.researchersUrl ? element.researchersUrl.value : '',
        label: element.researchers ? element.researchers.value : ''
      }
    });
  });
        return { rowCell: columArray, rowColum: rowColum }; 
      })
    );

  }

  pageProduction(QID):Observable<any> { 

  var query = `#defaultView:BarChart
# Pages per year bar chart of an organization
SELECT
  ?year
  (SUM(?pages_per_author) AS ?number_of_pages)
  ?researcher_label
WHERE {
  {
    SELECT
      ?researcher_label ?work ?year
      (SAMPLE(?pages) / COUNT(?researcher_of_paper) AS ?pages_per_author)
    WHERE {
      # Find authors associated with organization
      FILTER EXISTS { ?researcher wdt:P108 | wdt:P463 | (wdt:P1416 / wdt:P361*) wd:${QID} . }
      
      ?work (wdt:P50|wdt:P2093) ?researcher_of_paper .
      
      # Disabled to only look on scholarly articles
      # ?work wdt:P31 wd:Q13442814 .
      
      ?work wdt:P50 ?researcher .
      ?work wdt:P1104 ?pages .
      ?work wdt:P577 ?date . 
      BIND(STR(YEAR(?date)) AS ?year) 
      ?researcher rdfs:label ?researcher_label . FILTER(LANG(?researcher_label) = 'en')
    } 
    GROUP BY ?work ?researcher_label ?year
  }
}
GROUP BY ?year ?researcher_label 
ORDER BY ?year
`;

const endpointUrl = 'https://query.wikidata.org/embed.html#';
return of ( endpointUrl + encodeURIComponent(query));
}

  recentCitations(QID):Observable<any> {

  var query = `SELECT DISTINCT ?publication_date ?citing_work ?citing_workLabel ?work ?workLabel
  WHERE {
    ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} .
    ?work wdt:P50 ?researcher .
    ?citing_work wdt:P2860 ?work .
    ?citing_work wdt:P577 ?publication_datetime .
    BIND(xsd:date(?publication_datetime) AS ?publication_date)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,nl,ru,sv,zh". }
   }
  ORDER BY DESC(?publication_date)
  LIMIT 200
 `;

  
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        var columArray = new Array()
        var rowColum: Array<Object> = [
          { key: 'publication_date', label: 'Fecha de Publicacion' },
          { key: 'citing_work', label: 'Citando Investigacion' },
          { key: 'work', label: 'Investigacion' }
        ];
        //console.log(rowColum);
        
        res.results.bindings.forEach(element => {
          var _citing_work = element["citing_work"] ? element["citing_work"].value.split("/") :'';
          var _work = element["work"] ? element["work"].value.split("/") :'';
      
          columArray.push({
            publication_date: element.publication_date ? element.publication_date.value : '',
            citing_work: {
              type: 'work',
              QID: element.citing_work ? _citing_work[_citing_work.length - 1] : '',
              label: element.citing_workLabel ? element.citing_workLabel.value : ''
            },
            work: {
              type: 'work',
              QID: element.work ? _work[_work.length - 1] : '',
              label: element.workLabel ? element.workLabel.value : ''
            }
          });
        });
      
        return { rowCell: columArray, rowColum: rowColum }; 
      })
    );
  }

  citedWorks(QID):Observable<any> {
  var query = `
#defaultView:BubbleChart
# Bubble chart of most cited works of first author associated
# with an organization
SELECT
  ?count ?work ?workLabel
WITH {
  # Find researchers associated with the organization and count
  # the number of citations.
  SELECT
    (COUNT(DISTINCT ?citing_work) AS ?count)
    ?work
  WHERE {
    ?researcher wdt:P108 | wdt:P463 | (wdt:P1416 / wdt:P361*) wd:${QID} .
    ?work p:P50 ?researcher_statement .
    ?researcher_statement ps:P50 ?researcher .
    ?researcher_statement pq:P1545 "1" .
    ?citing_work wdt:P2860 ?work .
  }
  GROUP BY ?work                   
  ORDER BY DESC(?count)
  LIMIT 20
} AS %works
WHERE {
  # Label the works
  INCLUDE %works
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" .
  }
}
ORDER BY DESC(?count)`

const endpointUrl = 'https://query.wikidata.org/embed.html#'
return of ( endpointUrl + encodeURIComponent(query));
}

  coAuthorCitations(QID):Observable<any> {
  var query = `
#defaultView:BarChart
SELECT ?year (SUM(?citations_per_author_) AS ?citations_per_author) ?researcherLabel
WITH {
  # Find researchers affiliated with the organization
  SELECT DISTINCT ?researcher WHERE {
    ?researcher wdt:P108 | wdt:P463 | wdt:P1416/wdt:P361* wd:${QID} .
  }
} AS %researchers 
WITH {
  # Find works of the researchers and count the number of citations
  SELECT
    ?researcher ?work ?year (COUNT(DISTINCT ?citing_work) / COUNT(DISTINCT ?researcher_of_paper) AS ?citations_per_author_)
  WHERE {
    INCLUDE %researchers
    ?work wdt:P50 | wdt:P2093 ?researcher_of_paper .
    ?work wdt:P50 ?researcher .
    ?citing_work wdt:P2860 ?work .
    ?work wdt:P577 ?date . 
    BIND(STR(YEAR(?date)) AS ?year)
  }
  GROUP BY ?work ?researcher ?year
} AS %counts
WHERE {
  # Label the results
  INCLUDE %counts    
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
}
GROUP BY ?year ?researcher ?researcherLabel
ORDER BY ?year
`
const endpointUrl = 'https://query.wikidata.org/embed.html#'
return of ( endpointUrl + encodeURIComponent(query));
}

  awards(QID):Observable<any> {

  var query = `SELECT ?count ?award ?awardLabel ?recipients
  WITH {
    SELECT (COUNT(?researcher) AS ?count) ?award (GROUP_CONCAT(?researcher_label; separator=", ") AS ?recipients) WHERE {
      hint:Query hint:optimizer "None" .
      { 
        SELECT DISTINCT ?researcher WHERE {
          ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} .
        } 
      }
      ?researcher wdt:P166 ?award .
      ?researcher rdfs:label ?researcher_label . FILTER (LANG(?researcher_label) = 'en')
    }
    GROUP BY ?award 
  } AS %result
  WHERE {
    INCLUDE %result
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" . } 
  }
  ORDER BY DESC(?count)
 `;

  
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'count', label: 'No. Premios' },
    { key: 'award', label: 'Premio' },
    { key: 'recipients', label: 'Premiados' }
  ]
  //console.log(rowColum);

   res.results.bindings.forEach(element => {
    //var _award = element["award"].value.split("/");

    columArray.push({
      count: element.count ? element.count.value : '',
      award: element.awardLabel ? element.awardLabel.value : '',
      recipients: element.recipients ? element.recipients.value : ''
    });
  });

        return { rowCell: columArray, rowColum: rowColum }; 
      })
    );

  }

  genderDistribution(QID):Observable<any> {
  
  var queryResult: any = '';
  var object: Object = {};

  var query = ` SELECT ?count ?gender ?genderLabel 
  WITH {
    SELECT (COUNT(DISTINCT ?researcher) AS ?count) ?gender WHERE {
      ?researcher ( wdt:P108 | wdt:P463 | wdt:P1416 ) / wdt:P361* wd:${QID} .
      ?researcher wdt:P21 ?gender . 
    } 
    GROUP BY ?gender
  } AS %result
  WHERE {
    INCLUDE %result
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,ep,fr,jp,nl,no,ru,sv,zh" . } 
  } 
   ORDER BY DESC(?count)
 `;

  
    const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);
    
    return this.http.get(fullUrl,  {headers:this.headers}).pipe(
      map((res: any) => {
        var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'count', label: 'No. Investigadores por Genero' },
    { key: 'gender', label: 'Genero' }
  ]
  //console.log(rowColum);

   res.results.bindings.forEach(element => {
    //var _gender = element["gender"].value.split("/");

    columArray.push({
      count: element.count ? element.count.value : '',
      gender: element.genderLabel ? element.genderLabel.value : ''
    });
  });
        return { rowCell: columArray, rowColum: rowColum }; 
      })
    );
  }

}

