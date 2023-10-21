import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { QueryVenue } from '../../../../services/query.venue.service';

const getFirstPageExtract = jsonResponse => {
  const pages = jsonResponse.query.pages;
  const pageIds = Object.keys(pages);
  const firstPageId = pageIds.length ? pageIds[0] : null;
  return firstPageId ? pages[firstPageId].extract : null;
};

@Component({
  selector: 'app-wiki-venue-profile',
  templateUrl: './wiki-venue-profile.component.html',
  styleUrls: ['./wiki-venue-profile.component.scss']
})
export class WikiVenueProfileComponent implements OnInit {

  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';
  lang: any = '';
  content = '';
  url = '';

  services: any = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryVenue,
    private http: HttpClient
  ) { }

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

  async ngOnInit() {
    await this.route.queryParams.subscribe(async (params) => {
      this.QID = params['QID'];
      this.title = params['label'];
      this.lang = params['lang'];
    })

    var term = this.title.replace(/ /g, "%20");
    //console.log(term);
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
    this.queryService.recentWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 1,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Investigaciones Recientes'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.topics(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 2,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Temas'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.authorImages(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 3,
          type: 'images',
          icon: 'wallpaper',
          value: res,
          label: 'Imágenes de autor'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.prolificAuthors(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 4,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Autores Prolificos'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.coAuthorGraph(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 5,
          type: 'graph',
          icon: 'share',
          value: res,
          label: 'Gráfico de coautor'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.mostCitedArticles(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 6,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Articulos mas Citados'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.mostCitedAuthors(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 7,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Autores mas Citados'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.citationDistribution(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 8,
          type: 'chart',
          icon: 'insert_chart',
          value: res,
          label: 'Distribución de citas'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.citedVenues(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 9,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Evenetos Citados'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.venuesCitedFrom(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 10,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Eventos Citados de:'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.retractedArticles(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 11,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Articulos Citando Articulos Retirados'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.genderDistribution(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 12,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Distribucion de Genero'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.authorships(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 13,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Autorias'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.authorAwards(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 14,
          type: 'table',
          icon: 'view_week',
          value: res,
          label: 'Autores Premiados'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

  };
}
