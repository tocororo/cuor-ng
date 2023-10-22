import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { QueryWork } from '../../../_services/query-works.service';

@Component({
  selector: 'wiki-work-profile',
  templateUrl: './wiki-work-profile.component.html',
  styleUrls: ['./wiki-work-profile.component.scss']
})
export class WikiWorkProfileComponent implements OnInit {

  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';

  services: any = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryWork
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.QID = params['QID']
      this.title = params['label']
    })

    this.getServices();
  }

  sortArray(arr) {
    arr.sort((a, b) => {
      return a.key < b.key ? -1 : 1;
    })
  }

  getServices() {
    this.queryService.description(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 1,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Descripcion'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

    this.queryService.listAuthors(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 2,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Lista de Autores'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.topicsScore(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 3,
          type: 'bubble_chart',
          icon: 'bubble_chart',
          value: res,
          label: 'Puntuaciones de Temas'
        })
          ;
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.timeLine(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 4,
          type: 'time_line',
          icon: 'timeline',
          value: res,
          label: 'Cronología'
        })
          ;
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.relatedWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 5,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Investigaciones Relacionadas de Analysis de Co-Citacion'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.citationsToWork(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 6,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Citaciones a la Investigacion'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.citedWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 7,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Investigaciones Citadas'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.authorCitedWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 8,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Autores de Investigaciones Citadas'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.citationGraph(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 9,
          type: 'chart',
          icon: 'insert_chart',
          value: res,
          label: 'Gráfico de Citas'
        })
          ;
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.citationYear(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 10,
          type: 'graph',
          icon: 'share',
          value: res,
          label: 'Citas por Año'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.wikipediaMentions(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 11,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Mensiones en Wikipedia'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });


    this.queryService.supportStatements(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 12,
          value: res,
          type: 'table',
          icon: 'view_week',
          label: 'Soporta las siguientes declaraciones:'
        });
        this.sortArray(this.services);
      },
      error: err => console.log(err)
    });

  }

}

