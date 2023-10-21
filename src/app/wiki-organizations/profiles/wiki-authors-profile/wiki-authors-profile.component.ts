import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryAuthors } from 'src/services/query-authors.service';

@Component({
  selector: 'wiki-authors-profile',
  templateUrl: './wiki-authors-profile.component.html',
  styleUrls: ['./wiki-authors-profile.component.scss']
})
export class WikiAuthorsProfileComponent implements OnInit {
  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';
  localParams:any = JSON.parse(localStorage.getItem('localParams'));

  services: any = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private querService: QueryAuthors
  ) { }

  async ngOnInit() {
   /*  this.QID = this.localParams.QID
    this.title = this.localParams.label */

    this.route.queryParams.subscribe((params) => {
      this.QID = params['QID']
      this.title = params['label']
    })

    /* this.router.navigate(['.'], {
      relativeTo:this.route, queryParams: {  },
      queryParamsHandling: 'merge'
    }) */

    this.getServices();
  }

  sortArray(arr) {
    arr.sort((a, b) => {
      return a.key < b.key ? -1 : 1;
    })
  }

  getServices(){
    this.querService.authors(this.QID).subscribe({
      next: res => {
        this.services.push({
           key: 1,
        type: 'table',
       icon: 'view_week',
        value:res,
        label: 'Lista de Publicaciones'
        })
        this.sortArray(this.services)
      }
    });

    this.querService.jointlyAuthoredWorks(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 2,
          value: res,
        type: 'table',
       icon: 'view_week',
        label: 'Temas de Trabajo de Autores'
        })
        this.sortArray(this.services)
      }
    });

    this.querService.worksPublicationYear(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 3,
          value: res,
        type: 'chart',
       icon: 'insert_chart',
        label: 'Número de Trabajos por Año de Publicación'
        })
        this.sortArray(this.services)
      }
    });

    this.querService.citationsPublicationYear(this.QID).subscribe({
      next: res => {
        this.services.push({
           key: 4,
           value: res,
        type: 'chart',
       icon: 'insert_chart',
        label: 'Número de Citas por Año de Publicación'
        })
        this.sortArray(this.services)
      }
    });

  /*   this.querService.coAuthorsGraph(this.QID).subscribe({
      next: res => {
        this.services.push({
          key: 5,
          value: res,
          type: 'grap',
         icon: 'share',
          label: 'Gráfico de Coautores'
        })
        this.sortArray(this.services)
      }
    }); */

  }
}

