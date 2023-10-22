export const recentWorksTopic = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        SELECT ?date ?work ?workLabel 
          ?topicsUrl ?topics 
        WITH {
          SELECT DISTINCT ?work WHERE {
            ?work wdt:P921 / (wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) ) wd:${QID} .
          }
        } AS %works
        WITH {
          SELECT (MAX(?dates) as ?datetime) ?work (GROUP_CONCAT(DISTINCT ?topic_label; separator=" // ") AS ?topics) 
                                            (CONCAT("../topics/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?topic), 32); separator=",")) AS ?topicsUrl) 
          WHERE {
            INCLUDE %works
            ?work wdt:P921 ?topic . 
            OPTIONAL { ?work wdt:P577 ?dates . }
            ?topic rdfs:label ?topic_label .  FILTER (lang(?topic_label) = 'en')
          }
          GROUP BY ?work
        } AS %result
        WHERE {
          INCLUDE %result
        
          # There is a problem with BC dates
          # BIND(xsd:date(?datetime) AS ?date)
          BIND(REPLACE(STR(?datetime), 'T.*', '') AS ?date)
            
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
        }
        GROUP BY ?date ?work ?workLabel ?topicsUrl ?topics
        ORDER BY DESC(?date)
        LIMIT 500   
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'date', label: 'Fecha' },
    { key: 'work', label: 'Investigacion' },
    { key: 'topics', label: 'Tema' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _topics = element['topics'] ? element['topics'].value.split("/") : '';
    var _work = element['work'] ? element['work'].value.split("/") : '';

    columArray.push({
      date: element.date ? element.date.value : '',
      topics: {
        type: 'topic',
        label: element.topics ? element.topics.value : '',
        QID: element.topicsrUrl ? _topics[_topics.length - 1] : ''
      },
      work: {
        type: 'work',
        QID: element.work ? _work[_work.length - 1] : '',
        label: element.workLabel ? element.workLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const earliestWorksTopic = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        SELECT ?date ?work ?workLabel ?topicsUrl ?topics 
        WITH {
          SELECT DISTINCT ?work WHERE {
            ?work wdt:P921 / (wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) ) wd:${QID} .
          }
        } AS %works
        WITH {
          SELECT (MAX(?dates) as ?datetime) ?work (GROUP_CONCAT(DISTINCT ?topic_label; separator=" // ") AS ?topics) 
                                            (CONCAT("../topics/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?topic), 32); separator=",")) AS ?topicsUrl) 
                                            WHERE {
            INCLUDE %works
            ?work wdt:P921 ?topic . 
            ?work wdt:P577 ?dates . 
            FILTER (!isBLANK(?dates)) .
            ?topic rdfs:label ?topic_label .  FILTER (lang(?topic_label) = 'en')
          }
          GROUP BY ?work
        } AS %result
        WHERE {
          INCLUDE %result
        
          # There is a problem with BC dates
          # BIND(xsd:date(?datetime) AS ?date)
          BIND(REPLACE(STR(?datetime), 'T.*', '') AS ?date)
            
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh". }
        }
        GROUP BY ?date ?work ?workLabel ?topicsUrl ?topics
        ORDER BY ASC(?date)
        LIMIT 500
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'date', label: 'Fecha' },
    { key: 'work', label: 'Investigacion' },
    { key: 'topics', label: 'Tema' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _topics = element['topics'] ? element['topics'].value.split("/") : '';
    var _work = element['work'] ? element['work'].value.split("/") : '';

    columArray.push({
      date: element.date ? element.date.value : '',
      topics: {
        type: 'topic',
        label: element.topics ? element.topics.value : '',
        QID: element.topicsrUrl ? _topics[_topics.length - 1] : ''
      },
      work: {
        type: 'work',
        QID: element.work ? _work[_work.length - 1] : '',
        label: element.workLabel ? element.workLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const authorsPublishingAbout = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        #defaultView:Table
        SELECT ?count ?author ?authorLabel (COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ?authorLabel)) AS ?orcid) 
        WITH {
          SELECT (count(?work) as ?count) ?author WHERE {
            { ?work wdt:P921/wdt:P31*/wdt:P279* wd:${QID} . }
            union { ?work wdt:P921/wdt:P361+ wd:${QID} . }
            union { ?work wdt:P921/wdt:P1269+ wd:${QID} . }
            ?work wdt:P50 ?author .
          }
          GROUP BY ?author
        } AS %result
        WHERE {
          INCLUDE %result
                  
          # Include optional ORCID iD
          OPTIONAL { ?author wdt:P496 ?orcid_ . }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" . } 
        }
        ORDER BY DESC(?count)
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'count', label: 'No. Autores' },
    { key: 'author', label: 'Autor' },
    { key: 'orcid', label: 'Orcid' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _author = element['author'] ? element['author'].value.split("/") : '';

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
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const coOccurringTopics = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        #defaultView:Table
        SELECT ?count ?author ?authorLabel (COALESCE(?orcid_, CONCAT("orcid-search/quick-search/?searchQuery=", ?authorLabel)) AS ?orcid) 
        WITH {
          SELECT (count(?work) as ?count) ?author WHERE {
            { ?work wdt:P921/wdt:P31*/wdt:P279* wd:${QID} . }
            union { ?work wdt:P921/wdt:P361+ wd:${QID} . }
            union { ?work wdt:P921/wdt:P1269+ wd:${QID} . }
            ?work wdt:P50 ?author .
          }
          GROUP BY ?author
        } AS %result
        WHERE {
          INCLUDE %result
                  
          # Include optional ORCID iD
          OPTIONAL { ?author wdt:P496 ?orcid_ . }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" . } 
        }
        ORDER BY DESC(?count)
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'count', label: 'No. Investigaciones' },
    { key: 'topic', label: 'Tema' },
    { key: 'example_work', label: 'Muestra de Investigacion' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _topic = element['topic'] ? element['topic'].value.split("/") : '';
    var _example_work = element['example_work'] ? element['example_work'].value.split("/") : '';

    columArray.push({
      count: element.count ? element.count.value : '',
      academic_age: element.academic_age ? element.academic_age.value : '',
      topic: {
        type: 'topic',
        QID: element.topic ? _topic[_topic.length - 1] : '',
        label: element.topicLabel ? element.topicLabel.value : ''
      },
      example_work: {
        type: 'work',
        QID: element.author ? _example_work[_example_work.length - 1] : '',
        label: element.authorLabel ? element.authorLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const publishingAbaut = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        #defaultView:Table
        SELECT ?count ?short_name ?venue ?venueLabel
        WITH {
          SELECT (count(?work) as ?count) ?venue (SAMPLE(?short_name_) AS ?short_name) WHERE {
            { ?work wdt:P921/wdt:P31*/wdt:P279* wd:${QID} . }
            union { ?work wdt:P921/wdt:P361+ wd:${QID} . }
            union { ?work wdt:P921/wdt:P1269+ wd:${QID} . }
            ?work wdt:P1433/wdt:P179* ?venue .
            OPTIONAL { ?venue wdt:P1813 ?short_name_ . }
          }
          GROUP BY ?venue
        } AS %result
        WHERE {
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,da,de,es,fr,jp,nl,no,ru,sv,zh" . } 
        }
        ORDER BY DESC(?count)
        LIMIT 200
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'count', label: 'No. Eventos' },
    { key: 'short_name', label: 'Nombre Acotado' },
    { key: 'venue', label: 'Evento' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _venue = element['venue'] ? element['venue'].value.split("/") : '';

    columArray.push({
      count: element.count ? element.count.value : '',
      short_name: element.short_name ? element.short_name.value : '',
      venue: {
        type: 'venue',
        QID: element.venue ? _venue[_venue.length - 1] : '',
        label: element.venueLabel ? element.venueLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const authorsCited = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        SELECT ?number_of_citations ?author ?authorLabel ?cited_work_example ?cited_work_exampleLabel
        WITH {
          # Find works about the topic
          SELECT DISTINCT ?work WHERE {
              ?work wdt:P921 / (wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) ) wd:${QID} .
          }
        } AS %works
        WITH {
          # Find cited works
          SELECT (COUNT(?work) AS ?number_of_citations) ?author (SAMPLE(?cited_work) AS ?cited_work_example)
          WHERE {
            INCLUDE %works
            ?cited_work wdt:P50 ?author . 
            ?work wdt:P2860 ?cited_work .
          } 
          GROUP BY ?author
        } AS %result
        WHERE {
          # Label the results
          INCLUDE %result
          SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
        } 
        ORDER BY DESC(?number_of_citations)
        LIMIT 200    
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'number_of_citations', label: 'No. Citaciones' },
    { key: 'author', label: 'Autor' },
    { key: 'cited_work_example', label: 'Muestra Investigacion Citada' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _cited_work_example = element['cited_work_example'] ? element['cited_work_example'].value.split("/") : '';

    columArray.push({
      number_of_citations: element.number_of_citations ? element.number_of_citations.value : '',
      short_name: element.short_name ? element.short_name.value : '',
      cited_work_example: {
        type: 'work',
        QID: element.cited_work_example ? _cited_work_example[_cited_work_example.length - 1] : '',
        label: element.cited_work_exampleLabel ? element.cited_work_exampleLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const awardsRecived = async (QID) => {

  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  query = `
        SELECT ?count ?award ?awardLabel ?recipients ?recipientsUrl
        WITH {
          SELECT (COUNT(?researcher) AS ?count) ?award 
          (GROUP_CONCAT(DISTINCT ?researcher_label; separator=", ") AS ?recipients) 
          (CONCAT("../authors/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?researcher), 32); separator=",")) AS ?recipientsUrl)
          WHERE {
            { 
              SELECT DISTINCT ?researcher ?award WHERE {
                hint:Query hint:optimizer "None" .
                ?work wdt:P921 wd:${QID} .
                ?work wdt:P50 ?researcher .
                ?researcher wdt:P166 ?award .
              } 
              LIMIT 100
            }
            ?researcher rdfs:label ?researcher_label . FILTER (LANG(?researcher_label) = 'en')
          }
          GROUP BY ?award 
        } AS %result
        WHERE {
          INCLUDE %result
            ?award rdfs:label ?awardLabel . FILTER (LANG(?awardLabel) = 'en')
        }
        GROUP BY ?count ?award ?awardLabel ?recipients ?recipientsUrl
        ORDER BY DESC(?count)
        
       `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum = [
    { key: 'count', label: 'No. Premios' },
    { key: 'award', label: 'Premio' },
    { key: 'recipients', label: 'Premiados' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _recipients = element['_recipients'] ? element['_recipients'].value.split("/") : '';

    columArray.push({
      number_of_citations: element.number_of_citations ? element.number_of_citations.value : '',
      short_name: element.short_name ? element.short_name.value : '',
      award: element.awardLabel ? element.awardLabel.value : '',
      recipients: {
        type: 'author',
        QID: element.recipients ? _recipients[_recipients.length - 1] : '',
        label: element.recipientsLabel ? element.recipientsLabel.value : ''
      }
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const publicationsPerYear = (QID) => {
  var query = `
  # tool: scholia
#defaultView:BarChart
# title: publications per year for this chemical
# Inspired from LEGOLAS - http://abel.lis.illinois.edu/legolas/
# Shubhanshu Mishra, Vetle Torvik
select ?year (count(?work) as ?number_of_publications) where {
  {
    select (str(?year_) as ?year) (0 as ?pages) where {
      # default values = 0
      ?year_item wdt:P31 wd:Q577 . 
      ?year_item wdt:P585 ?date .
      bind(year(?date) as ?year_)
      {
        select (min(?year_) as ?earliest_year) where {
          { ?work wdt:P921/wdt:P31*/wdt:P279* wd:${QID} . }
          union { ?work wdt:P921/(^wdt:P361)+ wd:${QID} . }
          union { ?work wdt:P921/wdt:P1269+ wd:${QID} . }
          union { wd:${QID} ?propp ?statement .
                  ?statement a wikibase:BestRank ;
                             prov:wasDerivedFrom/pr:P248 ?work . }
          ?work wdt:P577 ?publication_date . 
          bind(year(?publication_date) as ?year_)
        }
      }
      bind(year(now()) as ?next_year)
      filter (?year_ >= ?earliest_year && ?year_ <= ?next_year)
    }
  }
  union {
    select ?work (min(?years) as ?year) where {
      { ?work wdt:P921/wdt:P31*/wdt:P279* wd:${QID} . }
      union { ?work wdt:P921/wdt:P527+ wd:${QID} . }
      union { ?work wdt:P921/wdt:P1269+ wd:${QID} . }
      union { wd:${QID} ?propp ?statement .
              ?statement a wikibase:BestRank ;
                         prov:wasDerivedFrom/pr:P248 ?work . }
      ?work wdt:P577 ?dates .
      bind(str(year(?dates)) as ?years) .
    }
    group by ?work 
  }
}
group by ?year 
order by ?year`

const endpointUrl = "https://query.wikidata.org/embed.html#"
return endpointUrl + encodeURIComponent(query)
}

/*
...................Topics...................
 */

export const topics = async (strQID) => {
  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  var str = strQID.split(',')
  var chart: string = '';

  str.forEach(element => {
    chart += ` wd:${element} `;
  });

  query = `
  SELECT ?topic ?topicLabel ?example_work ?example_workLabel
  WITH {
    SELECT ?topic (SAMPLE(?work) AS ?example_work) WHERE {
      VALUES ?topic {  wd:Q7162  wd:Q123619  }
      OPTIONAL { 
        ?work wdt:P921 ?topic ; wdt:P31 wd:Q13442814 .
      }
    }
    GROUP BY ?topic
  } AS %result
  WHERE {
    INCLUDE %result
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
  }
    
     `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'topic', label: 'Tema' },
    { key: 'example_work', label: 'Muestra de la Investigacion' },
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _example_work = element["example_work"] ? element["example_work"].value.split("/") :'';

    columArray.push({
      topic: {
        type: 'topic',
        QID: element.topic ? element.topic.value : '',
        label: element.topicLabel ? element.topicLabel.value : ''
      },
      example_work: {
        type: 'work',
        QID: element.example_work ? _example_work[_example_work.length - 1] : '',
        label: element.example_workLabel ? element.example_workLabel.value : ''}
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const workCombinationTopics = async (strQID) => {
  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  var str = strQID.split(',')
  var chart: string = '';

  str.forEach(element => {
    chart += ` wd:${element} `;
  });

  query = `
  SELECT
    ?count 
    (MIN(?publication_date_) AS ?publication_date)
    ?work ?workLabel
    ?topics ?topicsUrl
  WITH {
    SELECT (COUNT(?topic) AS ?count) ?work
      (GROUP_CONCAT(DISTINCT ?topic_label; separator=" // ") AS ?topics) 
      (CONCAT("../topics/", GROUP_CONCAT(DISTINCT SUBSTR(STR(?topic), 32); separator=",")) AS ?topicsUrl)                                    
    WHERE {
      VALUES ?topic {${chart}}
      
      # A broad query including "(wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) )" seems to take
      # long time and time out.
      ?work wdt:P921 ?topic  .
      ?topic rdfs:label ?topic_label .
      FILTER(LANG(?topic_label) = 'en')
    }
    GROUP BY ?work ?topics
    HAVING(?count > 1)
    ORDER BY DESC(?count)
    LIMIT 200
  } AS %results
  WHERE {
    INCLUDE %results
    OPTIONAL {
      ?work wdt:P577 ?publication_datetime .
      BIND(xsd:date(?publication_datetime) AS ?publication_date_)
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
  }
  GROUP BY ?count ?work ?workLabel ?topics ?topicsUrl
  ORDER BY DESC(?count) DESC(?publication_date)
    
     `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'count', label: 'No. Investigaciones' },
    { key: 'publication_date', label: 'Fecha de Publicacion' },
    { key: 'work', label: 'Investigacion' },
    { key: 'topics', label: 'Temas' },
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _topicsUrl = element["topicsUrl"] ? element["topicsUrl"].value.split("/") :'';
    var _work = element["work"] ? element["work"].value.split("/") :'';

    columArray.push({
      count: element.count ? element.count.value :'',
      publication_date: element.publication_date ? element.publication_date : '',
      topics: {
        type: 'topics',
        QID: element.topicsUrl ? _topicsUrl[_topicsUrl.length-1] : '',
        label:element.topics ? element.topics.value : ''
      },
      work: {
        type: 'work',
        QID: element.work ? _work[_work.length - 1] : '',
        label: element.workLabel ? element.workLabel.value : ''}
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

export const autores = async (strQID) => {
  var query: string = '';
  var queryResult: any = '';
  var object: Object = {};

  var str = strQID.split(',')
  var chart: string = '';

  str.forEach(element => {
    chart += ` wd:${element} `;
  });

  query = `
  SELECT
    ?score
    ?author ?authorLabel
    ?example_work ?example_workLabel
  WITH {
    SELECT (COUNT(?topic) AS ?score) ?author (SAMPLE(?work_) AS ?example_work)
      WHERE {
      VALUES ?topic {${chart}}
      
      # A broad query including "(wdt:P361+ | wdt:P1269+ | (wdt:P31* / wdt:P279*) )" seems to take
      # long time and time out.
      ?work wdt:P921 ?topic  .
      ?work wdt:P2860 ?cited_work .
      { ?cited_work wdt:P50 ?author . BIND(?cited_work AS ?work_) }
      UNION
      { ?work wdt:P50 ?author . BIND(?work AS ?work_) }
    }
    GROUP BY ?author
    ORDER BY DESC(?score)
    LIMIT 200
  } AS %results
  WHERE {
    INCLUDE %results
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" . }
  }
  ORDER BY DESC(?score)
  
     `;

  queryResult = await riseQuery(query);
  console.log(queryResult);

  var columArray = new Array()
  var rowColum: Array<Object> = [
    { key: 'score', label: 'Puntuacion' },
    { key: 'author', label: 'Autor' },
    { key: 'example_work', label: 'Muestra Investigacion' }
  ]
  console.log(rowColum);

  await queryResult.results.bindings.forEach(element => {
    var _author = element["author"] ? element["author"].value.split("/") :'';
    var _example_work = element["example_work"] ? element["example_work"].value.split("/") :'';

    columArray.push({
      score: element.score ? element.score.value :'',
      author: {
        type: 'author',
        QID: element.author ? _author[_author.length-1] : '',
        label:element.authorLabel ? element.authorLabel.value : ''
      },
      example_work: {
        type: 'work',
        QID: element.example_work ? _example_work[_example_work.length - 1] : '',
        label: element.example_workLabel ? element.example_workLabel.value : ''}
    });
  });

  //console.log(columArray);
  return object = { rowCell: columArray, rowColum: rowColum };
}

const riseQuery = (query) => {
  const endpointUrl = 'https://query.wikidata.org/sparql'
  const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query);
  const headers = { 'Accept': 'application/sparql-results+json' };

  return fetch(fullUrl, { headers }).then(body => body.json());
}