import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  authorsCited, authorsPublishingAbout,



  awardsRecived, coOccurringTopics, earliestWorksTopic,


  publicationsPerYear, publishingAbaut, recentWorksTopic
} from '../../../../services/query-topic.service';

@Component({
  selector: 'app-wiki-topic-profile',
  templateUrl: './wiki-topic-profile.component.html',
  styleUrls: ['./wiki-topic-profile.component.scss']
})
export class WikiTopicProfileComponent implements OnInit {

  justify: string = 'flex-end';
  title: string = '';
  QID: any = '';

  serviceRecentWorksTopic: any = [];
  serviceEarliestWorksTopic: any = [];
  serviceAuthorsPublishingAbout: any = [];
  serviceCoOccurringTopics: any = [];
  servicePublishingAbaut: any = [];
  serviceAuthorsCited: any = [];
  serviceAwardsRecived: any = [];
  servicePublicationsPerYear: any =[];

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
      this.QID = params['QID'];
      this.title = params['label'];

      this.serviceRecentWorksTopic = await recentWorksTopic(this.QID);
      this.serviceEarliestWorksTopic = await earliestWorksTopic(this.QID);
      this.serviceAuthorsPublishingAbout = await authorsPublishingAbout(this.QID);
      this.serviceCoOccurringTopics = await coOccurringTopics(this.QID);
      this.servicePublishingAbaut = await publishingAbaut(this.QID);
      this.serviceAuthorsCited = await authorsCited(this.QID);
      this.serviceAwardsRecived = await awardsRecived(this.QID);
      this.servicePublicationsPerYear = publicationsPerYear(this.QID)

      this.services = [
        {
          key: 1,
          type:'table',
          value: await this.serviceRecentWorksTopic,
          label: 'Publicaciones Recientes Sobre el Tema'
        },
        {
          key: 2,
          type:'table',
          value: await this.serviceEarliestWorksTopic,
          label: 'Primeras Investigaciones Publicados Sobre el Tema'
        },
        {
          key: 3,
          type:'table',
          value: await this.serviceAuthorsPublishingAbout,
          label: 'Autores que publican sobre el tema'
        },
        {
          key: 4,
          type:'table',
          value: await this.serviceCoOccurringTopics,
          label: 'Temas Concurrentes'
        },
        {
          key: 5,
          type:'table',
          value: await this.servicePublishingAbaut,
          label: 'Sedes y trabajos de publicación de series sobre el tema'
        },
        {
          key: 6,
          type:'table',
          value: await this.serviceAuthorsCited,
          label: 'Autores citados de trabajos sobre el tema'
        },
        {
          key: 7,
          type:'table',
          value: await this.serviceAwardsRecived,
          label: 'Premios recibidos por autores que publicaron sobre el tema'
        },
        {
          key: 8,
          type:'chart',
          value: await this.servicePublicationsPerYear,
          label: 'Publicaciones por Año'
        }
      ]
    })
  }
}
