import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'table-layout',
  templateUrl: './table-layout.component.html',
  styleUrls: ['./table-layout.component.scss']
})
export class TableLayoutComponent implements OnInit, OnChanges {

  @Input()
  queryService: any = []

  displayedColumns: any = [];
  displayedColumnsKeys: string[] = [];
  dataSource: MatTableDataSource<[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {  }

  ngOnChanges() {
    this.displayedColumns =  this.queryService.rowColum
    this.dataSource = new MatTableDataSource( this.queryService.rowCell);

    if (this.displayedColumns != undefined) {
      this.displayedColumns.forEach(element => {
        this.displayedColumnsKeys.push(element.key)
      });
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /* authorProfile(QID, newlabel) {
    //localStorage.setItem('localParams',JSON.stringify({QID: QID, label: newlabel}))
    this.router.navigate(['wiki-organizations/author'], {
      queryParams: { QID: QID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  authorsProfile(strQID, newlabel){
    //localStorage.setItem('localParams',JSON.stringify({strQID: strQID, label: newlabel}))
    this.router.navigate(['wiki-organizations/authors'], {
      queryParams: { QID: strQID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  workProfile(QID, newlabel) {

 //localStorage.setItem('localParams',JSON.stringify({QID: QID, label: newlabel}))
  this.router.navigate(['wiki-organizations/work'], {
      queryParams: { QID: QID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  venueProfile(QID, newlabel) {

//localStorage.setItem('localParams',JSON.stringify({QID: QID, label: newlabel}))
  this.router.navigate(['wiki-organizations/venue'], {
      queryParams: { QID: QID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  topicProfile(QID, newlabel) {

//localStorage.setItem('localParams',JSON.stringify({QID: QID, label: newlabel}))
  this.router.navigate(['wiki-organizations/topic'], {
      queryParams: { QID: QID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  topicsProfile(QID, newlabel) {
    //localStorage.setItem('localParams',JSON.stringify({QID: QID, label: newlabel}))
    this.router.navigate(['wiki-organizations/topics'], {
      queryParams: { QID: QID, label: newlabel },
      queryParamsHandling: 'merge'
    })
  }

  redirectOrcid(url) {
    //window.location.href = (`https://orcid.org/${url}`);
    window.open(`https://orcid.org/${url}`, '_blank');
  } */


}
