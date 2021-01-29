import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryAuthors } from '../../../../services/query-authors.service';

@Component({
  selector: 'app-wiki-author-profile',
  templateUrl: './wiki-author-profile.component.html',
  styleUrls: ['./wiki-author-profile.component.scss']
})
export class WikiAuthorProfileComponent implements OnInit {
  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';
  lang: any = '';
  url = '';
  orcid = '';
  content = '';

  localParams:any = JSON.parse(localStorage.getItem('localParams'));
  services: any = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private queryService: QueryAuthors
  ) { }

  redirectOrcid(url) {
    //window.location.href = (`https://orcid.org/${url}`);
    window.open(`https://orcid.org/${url}`, '_blank');
  }

  async getArticle(url) {

    this.http.get(url).subscribe({
      next: (res: Response) => {
        const extract = this.getFirstPageExtract(res);
        const divContent = document.getElementById("divContent")
        divContent.innerHTML = extract;
        divContent.innerHTML = divContent.innerHTML.substring(0, 1000);
        divContent.innerHTML = divContent.innerHTML.replace(/<sup\b[^>]*>(.*?)<\/sup>/gi, "");
        this.content = divContent.innerHTML;
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
    window.open(`https://es.wikipedia.org/wiki/${term}`, '_blank');
  }

  ngOnInit() {

   /*  this.QID = this.localParams['QID']
    this.title = this.localParams['label']
    this.lang = this.localParams['lang']; */
    this.route.queryParams.subscribe((params) => {
      this.QID = params['QID']
      this.title = params['label']
      this.lang = params['lang']
    })
   /*  this.router.navigate(['.'], {
      relativeTo:this.route, queryParams: {  },
      queryParamsHandling: 'merge'
    }) */

    var term = this.title.replace(/ /g, "%20");
    this.lang == 'es' ?
      this.url = `https://es.wikipedia.org/w/api.php?origin=*&action=query&titles=${term}&prop=extracts&format=json&exintro=1`
      :
      this.url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${term}&prop=extracts&format=json&exintro=1`;

    this.getServices();
  }

  sortArray(arr) {
    arr.sort((a, b) => {
      return a.key < b.key ? -1 : 1;
    })
  }

  getServices() {
    this.queryService.getORCID(this.QID, this.title).subscribe({
      next: res => this.orcid = res,
      error: err => console.log(err)

    })
    this.queryService.listPublications(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 1,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Lista de Publicacione'
        })

        this.sortArray(this.services)
      },
      error: err => console.log(err)

    })
    this.queryService.publicationsPerYear(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 2,
          value: res,
          type: 'chart',
          icon: 'insert_chart',
          label: 'Número de publicaciones al año'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.pagesPerYear(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 3,
          value: res,
          type: 'chart',
          icon: 'insert_chart',
          label: 'Número de páginas por año'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.topicsScore(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 4,
          value: res,
          type: 'bubble_chart',
          icon: 'bubble_chart',
          label: 'Temas'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.topicsWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 5,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Temas de Trabajo de Autores'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.venueStatisticsGraph(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 6,
          value: res,
          type: 'bubble_chart',
          icon: 'bubble_chart',
          label: 'Grafica de Estadisticas de Eventos'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.venueStatistics(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 7,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Estadisticas de Eventos'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.coAuthorGraph(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 8,
          value: res,
          type: 'graph',
          icon: 'share',
          label: 'Grafico de Coautores'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.coAuthorMap(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 9,
          value: res,
          type: 'map',
          icon: 'location_on',
          label: 'Mapa de Coautores'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.otherLocations(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 10,
          value: res,
          type: 'map',
          icon: 'location_on',
          label: 'Otras Ubicaciones de Coautores'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.timeline(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 11,
          value: res,
          type: 'time_line',
          icon: 'timeline',
          label: 'Linea de Tiempo'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.academicTree(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 12,
          value: res,
          type: 'tree',
          icon: 'account_tree',
          label: 'Arbol Academico'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.extationStatistics(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 13,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Estadisticas de Citaciones'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.citationsYear(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 14,
          value: res,
          type: 'chart',
          icon: 'insert_chart',
          label: 'Citaciones por año'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.citingAuthors(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 15,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Autores Citados'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.asociatedImages(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 16,
          value: res,
          type: 'images',
          icon: 'wallpaper',
          label: 'Imagenes Asociadas'
        })
        this.sortArray(this.services)
      },
      error: err => console.log(err)
    });
    this.queryService.events(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 17,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Eventos'
        })
        this.sortArray(this.services);
      },

      error: err => console.log(err)
    });

  }
}

