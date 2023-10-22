
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
      providedIn: 'root'
})
export class QueryOrgSearch {

      private endpointUrl = 'https://query.wikidata.org/sparql';
      private headers = { 'Accept': 'application/sparql-results+json' };
      array: Array<any> = [];
      uniqueArray: Array<any> = [];


      constructor(
            private http: HttpClient,
      ) { }


      queryOrganizations(orgLabel, country): Observable<any> {

            var arrayES = [];
            var arrayEN = [];
            var orgArray = [];
            var query = '';

            if (country != '') {
                  query = `SELECT ?item ?itemLabel 
        WHERE { 
        ?item wdt:P31/wdt:P279* wd:Q45400320;
              wdt:P17 wd:${country};
              rdfs:label ?itemLabel.
        FILTER(CONTAINS(LCASE(?itemLabel), "${orgLabel.toLowerCase()}")). 
        FILTER(lang(?itemLabel) = 'es' || lang(?itemLabel) = 'en') 
        }`;
            } else {
                  if (country == '') {
                        query = `SELECT ?item ?itemLabel 
        WHERE { 
        ?item wdt:P31/wdt:P279* wd:Q45400320;
              rdfs:label ?itemLabel.
        FILTER(CONTAINS(LCASE(?itemLabel), "${orgLabel}")). 
        FILTER(lang(?itemLabel) = 'es' || lang(?itemLabel) = 'en') 
        }`;
                  }
            }

            const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

            return this.http.get(fullUrl, { headers: this.headers }).pipe(
                  map((res: any) => {
                        res.results.bindings.forEach(element => {
                              ////console.log(element.itemLabel.value);
                              var wiki_id = element.item.value.split("/")
                              element.itemLabel && element.itemLabel['xml:lang'] === 'es'
                                    ?
                                    arrayES.push({
                                          QID: wiki_id[wiki_id.length - 1],
                                          label: element.itemLabel.value,
                                          lang: element.itemLabel['xml:lang']
                                    })
                                    :
                                    element.itemLabel && element.itemLabel['xml:lang'] === 'en' ?
                                          arrayEN.push({
                                                QID: wiki_id[wiki_id.length - 1],
                                                label: element.itemLabel.value,
                                                lang: element.itemLabel['xml:lang']
                                          })
                                          : ''
                        });

                        //orgArray = arrayES.concat(arrayEN);
                        orgArray = arrayEN.filter(element =>
                              !arrayES.find(({ QID }) =>
                                    element.QID === QID))
                        return arrayES.concat(orgArray);

                  }))
      }

      getSimilars(label): Observable<any> {
            var arraySimilar: Array<any> = []
            var arrayES = [];
            var arrayEN = [];
            var orgArray = [];
            
            var query = `SELECT ?item ?itemLabel ?itemDescription
            WHERE { 
            ?item wdt:P17 wd:Q241;
            rdfs:label ?itemLabel.
            FILTER(CONTAINS(LCASE(?itemLabel), "${label.toLowerCase()}")). 
            FILTER(lang(?itemLabel) = "es" || lang(?itemLabel) = "en") 
            SERVICE wikibase:label { bd:serviceParam wikibase:language  "es,en" }
            }
            GROUP BY ?item ?itemLabel ?itemDescription`;

            
            const fullUrl = this.endpointUrl + '?query=' + encodeURIComponent(query);

            return this.http.get(fullUrl, { headers: this.headers }).pipe(
                  map((res: any) => {
                        res.results.bindings.forEach(element => {
                              /* var wiki_id = element.item.value.split("/")

                              arraySimilar.push({
                                    QID: wiki_id[wiki_id.length - 1],
                                    label: element.itemLabel.value,
                                    lang: element.itemLabel['xml:lang'],
                                    description: element.description && element.description != "" ? element.description.value : ''
                              })
                        });
                        console.log(arraySimilar);
                        
                        return arraySimilar; */
                        var wiki_id = element.item.value.split("/")
                              element.itemLabel && element.itemLabel['xml:lang'] === 'es'
                                    ?
                                    arrayES.push({
                                          QID: wiki_id[wiki_id.length - 1],
                                          label: element.itemLabel.value,
                                          lang: element.itemLabel['xml:lang'],
                                          description: element.itemDescription ? element.itemDescription.value :''
                                    })
                                    :
                                    element.itemLabel && element.itemLabel['xml:lang'] === 'en' ?
                                          arrayEN.push({
                                                QID: wiki_id[wiki_id.length - 1],
                                                label: element.itemLabel.value,
                                                lang: element.itemLabel['xml:lang'],
                                                description: element.itemDescription ? element.itemDescription.value :''
                                          })
                                          : ''
                        });

                        //orgArray = arrayES.concat(arrayEN);
                        orgArray = arrayEN.filter(element =>
                              !arrayES.find(({ QID }) =>
                                    element.QID === QID))
                        return arrayES.concat(orgArray);
                  }));
      }

      queryCountries(): Observable<any> {

            this.getCountry().subscribe({
                  next: res => {
                        res.results.bindings.forEach(element => {
                              var wiki_id = element.country.value.split("/")
                              this.array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                        });

                  },
                  error: err => console.log(err)
            })

            this.getSovereignState().subscribe({
                  next: res => {
                        res.results.bindings.forEach(element => {
                              var wiki_id = element.country.value.split("/")
                              this.array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                        });
                  },
                  error: err => console.log(err)
            })

            this.getUnitaryState().subscribe({
                  next: res => {
                        res.results.bindings.forEach(element => {
                              var wiki_id = element.country.value.split("/")
                              this.array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                        });
                  },
                  error: err => console.log(err)
            })

            this.getComunistState().subscribe({
                  next: res => {
                        res.results.bindings.forEach(element => {
                              var wiki_id = element.country.value.split("/")
                              this.array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                        });
                  },
                  error: err => console.log(err)
            })

            this.getIslandNation().subscribe({
                  next: res => {
                        res.results.bindings.forEach(element => {
                              var wiki_id = element.country.value.split("/")
                              this.array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                        });
                  },
                  error: err => console.log(err)
            })

            return of(this.array)
      }

      getCountry(): Observable<any> {
            var query_country = `SELECT ?country ?countryLabel
      WHERE {
         ?country wdt:P31 wd:Q6256.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
     }`;

            return this.http.get(this.endpointUrl + '?query=' + encodeURIComponent(query_country), { headers: this.headers }).pipe(
                  map((res: any) => {
                        /* res.results.bindings.forEach(element => {
                       var wiki_id = element.country.value.split("/")
                       array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
                 }); */
                        return res;
                  }));

      }

      getSovereignState(): Observable<any> {
            var query_sovereign_state = `SELECT ?country ?countryLabel
      WHERE {
         ?country wdt:P31 wd:Q3624078.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
     }`;

            return this.http.get(this.endpointUrl + '?query=' + encodeURIComponent(query_sovereign_state), { headers: this.headers }).pipe(
                  map((res: any) => {
                        /* res.results.bindings.forEach(element => {
                  var wiki_id = element.country.value.split("/")
                  array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
            }); */
                        return res;
                  }));
      }

      getUnitaryState(): Observable<any> {
            var query_unitary_state = `SELECT ?country ?countryLabel
      WHERE {
         ?country wdt:P31 wd:Q179164.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
     }`;


            return this.http.get(this.endpointUrl + '?query=' + encodeURIComponent(query_unitary_state), { headers: this.headers }).pipe(
                  map((res: any) => {
                        /* res.results.bindings.forEach(element => {
            var wiki_id = element.country.value.split("/")
            array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
            }); */
                        return res;
                  }));
      }

      getComunistState(): Observable<any> {
            var query_communist_state = `SELECT ?country ?countryLabel
      WHERE {
         ?country wdt:P31 wd:Q849866.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
     }`;

            return this.http.get(this.endpointUrl + '?query=' + encodeURIComponent(query_communist_state), { headers: this.headers }).pipe(
                  map((res: any) => {
                        /* res.results.bindings.forEach(element => {
            var wiki_id = element.country.value.split("/")
            array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
            }); */
                        return res;
                  }));
      }


      getIslandNation(): Observable<any> {
            var query_island_nation = `SELECT ?country ?countryLabel
      WHERE {
         ?country wdt:P31 wd:Q112099.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
     }`;

            return this.http.get(this.endpointUrl + '?query=' + encodeURIComponent(query_island_nation), { headers: this.headers }).pipe(
                  map((res: any) => {
                        /* res.results.bindings.forEach(element => {
            var wiki_id = element.country.value.split("/")
            array.push({ QID: wiki_id[wiki_id.length - 1], label: element.countryLabel.value });
            }); */
                        return res;
                  }));
      }

}