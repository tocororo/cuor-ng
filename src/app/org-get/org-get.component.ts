
import { Component } from '@angular/core';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { EventEmitter, Output } from '@angular/core';
import { Environment, Organization } from 'toco-lib';
import { OrgService } from '../_services/org.service';



@Component({
  selector: 'app-org-get',
  templateUrl: './org-get.component.html',
  styleUrls: ['./org-get.component.scss']
})
export class OrgGetComponent{
  public org: Organization = null;
  @Output()
  selectedOrg: EventEmitter<Organization> = new EventEmitter<Organization>();
  pid = ""
  public constructor(
    private env: Environment,
    private _orgService: OrgService,
  ) { }

  public pidUpdated(event){
    this.pid = event.target.value;
  }
  public getOrg(){
    console.log(this.pid)
    this._orgService.getOrganizationById(this.pid).subscribe({
      next: (response)=>{
        console.log(response)
        if(response)
          this.selectedOrg.emit(response.metadata);
      }
    });

  }
}
