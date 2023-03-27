import {Component, OnInit, ViewChild} from '@angular/core';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import * as moment from 'moment';
import {MatLegacyPaginator as MatPaginator} from '@angular/material/legacy-paginator';

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
