import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryOrgSearch } from 'src/services/query-wiki-org-search.service';
import { QueryOrgEmployes } from '../../../../services/query-org-employes.service';

@Component({
  selector: 'wiki-org-employes-profile',  //'app-wiki-profile',
  templateUrl: './wiki-org-employes-profile.component.html',
  styleUrls: ['./wiki-org-employes-profile.component.scss']
})
export class WikiOrgEmployesProfileComponent implements OnInit {
  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';
  lang: any = '';
  content = '';
  url = '';
  localParams: any = JSON.parse(localStorage.getItem('localParams'));
  services: any = [];
  similars: Array<any> = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() data_viewer:any ;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private queryQueryOrgEmployes: QueryOrgEmployes,
    private querySimilar: QueryOrgSearch
  ) { }



  ngOnInit() {

    /* this.QID = this.localParams.QID
    this.title = this.localParams.label
    this.lang = this.localParams.lang */

    if (this.data_viewer) {
      this.QID = this.data_viewer.QID;
      this.title = this.data_viewer.label
      this.lang = this.data_viewer.label
    }
    else{
      this.route.queryParams.subscribe( {
        next:(params) => {
        this.QID = params['QID'];
        this.title = params['label'];
        this.lang = params['lang'];
      },
      error: err => console.log(err)
      })
    }

    /* this.router.navigate(['.'], {
      relativeTo:this.route, queryParams: {  } ,
      queryParamsHandling: 'merge'
    }) */

    var term = this.title.replace(/ /g, "%20");
    //console.log(term);
    this.data_viewer.lang == 'es' ?
      this.url = `https://es.wikipedia.org/w/api.php?origin=*&action=query&titles=${term}&prop=extracts&format=json&exintro=1`
      :
      this.url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${term}&prop=extracts&format=json&exintro=1`;

      this.getSimilars();

    this.getArticle(this.url);

    this.getServices();

  }

  getSimilars() {
    this.querySimilar.getSimilars(this.title).subscribe({
      next:res => {this.similars = res
      },
    error: err => console.log(err)
    }
     )
  }

  getArticle(url) {

    this.http.get(url).subscribe({
      next: (res: Response) => {
        const extract = this.getFirstPageExtract(res);
        const divContent = document.getElementById("divContent")
        divContent.innerHTML = extract;
        divContent.innerHTML = divContent.innerHTML.substring(0, 1000);
        divContent.innerHTML = divContent.innerHTML.replace(/<sup\b[^>]*>(.*?)<\/sup>/gi, "");
        this.content = extract;
      },
      error: err => console.log(err)

    })
  };


  getFirstPageExtract = jsonResponse => {
    const pages = jsonResponse.query.pages;
    const pageIds = Object.keys(pages);
    const firstPageId = pageIds.length ? pageIds[0] : null;
    return firstPageId ? pages[firstPageId].extract : null;
  };

  goWikipedia() {
    var term = this.title.replace(/ /g, "%20");
    return "https://es.wikipedia.org/wiki/" + term;
  };

  redirectHere(newQID, newlabel, newlang) {
    //localStorage.setItem('localParams',JSON.stringify({QID:QID, label:newlabel, lang:lang}))
    /* this.router.navigate(['wiki-organizations/organization'], {
      queryParams: { QID: newQID, label: newlabel, lang: newlang },
      queryParamsHandling: 'merge'
    }) *//* .then( () => window.location.reload) */
    this.services = [];
    this.data_viewer = {
      QID: newQID,
      label: newlabel,
      lang: newlang
    }
    console.log(this.data_viewer);
    this.getSimilars();
    this.getServices();
    /* this.router.routeReuseStrategy.shouldReuseRoute = () => false; */
  };

  sortArray(arr) {
    arr.sort((a, b) => {
      return a.key < b.key ? -1 : 1;
    })
  }

  getServices() {
    this.queryQueryOrgEmployes.employes(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 1,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Empleados y afiliados'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    })

    this.queryQueryOrgEmployes.coAuthorGraph(this.data_viewer.QID).subscribe(res => {
      this.services.push({
        key: 2,
        value: res,
        type: 'graph',
        icon: 'share',
        label: 'Gráfico de coautor'
      })
    })

    this.queryQueryOrgEmployes.advisorGraph(this.data_viewer.QID).subscribe(res => {
      this.services.push({
        key: 3,
        value: res,
        type: 'graph',
        icon: 'share',
        label: 'Gráfico de asesor'
      })
    })

    this.queryQueryOrgEmployes.topicsPublished(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 4,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Temas sobre los que trabajadores y afiliados han trabajado'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    })

    this.queryQueryOrgEmployes.recentPublications(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 5,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Publicaciones Recientes'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    })

    this.queryQueryOrgEmployes.pageProduction(this.data_viewer.QID).subscribe(res => {
      this.services.push({
        key: 6,
        value: res,
        type: 'chart',
        icon: 'insert_chart',
        label: 'Producción de páginas'
      })
    })

    this.queryQueryOrgEmployes.recentCitations(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 7,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Citaciones Recientes'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    })

    this.queryQueryOrgEmployes.citedWorks(this.data_viewer.QID).subscribe(res => {
      this.services.push({
        key: 8,
        value: res,
        type: 'bubble_chart',
        icon: 'bubble_chart',
        label: 'Artículos más citados con primer autor afiliado'
      })
    })

    this.queryQueryOrgEmployes.coAuthorCitations(this.data_viewer.QID).subscribe(res => {
      this.services.push({
        key: 9,
        value: res,
        type: 'chart',
        icon: 'insert_chart',
        label: 'Citas normalizadas por coautores por año'
      })
    })

    this.queryQueryOrgEmployes.awards(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 10,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Premios'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    })

    this.queryQueryOrgEmployes.genderDistribution(this.data_viewer.QID).subscribe({
      next: res => {
        this.services.push({
          key: 11,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Distribucion de Genero'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)

    })
  }
}
