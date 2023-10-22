import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
    autores, topics,
    workCombinationTopics
} from '../../../_services/query-topic.service';

@Component({
  selector: 'wiki-topics-profile',
  templateUrl: './wiki-topics-profile.component.html',
  styleUrls: ['./wiki-topics-profile.component.scss']
})
export class WikiTopicsProfileComponent implements OnInit {

  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';

  serviceTopics: any = [];
  serviceWorkCombinationTopics: any = [];
  serviceAutores: any = [];

  services: any = [];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.route.queryParams.subscribe(async (params) => {
      this.QID = params['QID']
      this.title = params['label']
      console.log(this.QID);

      this.serviceTopics = await topics(this.QID);
      this.serviceWorkCombinationTopics = await workCombinationTopics(this.QID);
      this.serviceAutores = await autores(this.QID);

      this.services = [
        {
          key: 1,
          type:'table',
          value: await this.serviceTopics,
          label: 'Publicaciones Recientes Sobre el Tema'
        },
        {
          key: 2,
          type:'table',
          value: await this.serviceWorkCombinationTopics,
          label: 'Lista de trabajos sobre cualquier combinación de estos temas'
        },
        {
          key: 3,
          type:'table',
          value: await this.serviceAutores,
          label: 'Autores que publican sobre el tema'
        }
      ]
    })
  }
}
