import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-request-changes-list',
  templateUrl: './request-changes-list.component.html',
  styleUrls: ['./request-changes-list.component.scss']
})
export class RequestChangesListComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['description', 'classification', 'emiter', 'createdAt', 'actions' ];
  columnsLabels = ['Organización', 'Curador', 'Solicitante', 'Creada', ''];
  public moment: any = moment;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

}
