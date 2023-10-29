import { ShowErrorService } from './show-error.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Hit, Organization } from 'toco-lib';
import { OrgService } from './org.service';
import { Permission } from './permission.service';



const orgExample: any = {
	'metadata': {
		'id': '876acbf2-5a67-4b5c-92ca-040761d54595',
		'identifiers': [
			{ idtype: 'reup', value: 'reup.1760' }
		],
		'name': 'EMPRESA LABORATORIO FARMACEUTICO ORIENTE',
		'status': 'active',
		'acronyms': [],
		'established': 1977,
		'labels': [
			{ iso639: 'es', label: 'EMPRESA LABORATORIO FARMACEUTICO ORIENTE' }
		],
		'relationships': [
			{ identifiers: [{ idtype: 'reup', value: 'reup.1760' }], label: 'Grupo de las Industrias Biotecnológica y Farmacéutica', type: 'parent' },
			{ identifiers: [{ idtype: 'reup', value: 'reup.1760' }], label: 'GRUPO DE LAS INDUSTRIAS BIOTECNOLOGICA Y FARMACEUTICA', type: 'parent' }
		],
		'addresses': [
			{
				city: 'Santiago de Cuba',
				country: 'Cuba',
				country_code: 'CU',
				primary: 'True',
				state: 'Santiago de Cuba',
				state_code: 'CU-13'
			}
		]
	}
};


@Injectable({
	providedIn: 'root',
})
export class OrganizationDetailResolverService
{
	public constructor(private router: Router, private service: OrgService)
	{ }

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Hit<Organization>>
	{
		let uuid = route.paramMap.get('uuid');
		return this.service.getOrganizationById(uuid).pipe(
            take(1),
            map(hit => {
                if (hit) {
                  console.log(hit)
                    return hit;
				}
				else {
                    this.router.navigate(['/']);
                }
            })
        );
		// return of(orgExample);
	}

}


@Injectable({
	providedIn: 'root',
})
export class OrganizationActiveResolverService
{
	public constructor(
    private oauthStorage: OAuthStorage,
    private router: Router,
    private service: OrgService,
    private errorService: ShowErrorService
  )	{ }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
	{
		let uuid = route.paramMap.get('uuid');
    let serviceAnswer : Observable<Hit<Organization>>;
		if (this.hasCurationPermission){
      serviceAnswer = this.service.getOrganizationById(uuid);
    }
    else {
      serviceAnswer = this.service.getActiveOrganizationById(uuid);
    }

    return serviceAnswer.pipe(
      take(1),
      map(hit => {
          if (hit) {
            console.log(hit)
            if (hit["ERROR"]){
              console.log("Error desde el backend, ", hit["ERROR"]);
              this.errorService.sendErrors({
				  "title": "Error desde el servidor",
				  "status":"402",
				  "message": hit["ERROR"]
				});
              this.router.navigate(['error']);
            }
            else{
              return hit;
            }
          }
          else {
                      //this.router.navigate(['/']);
                      console.log("Esto es cuando no hay hit");

                  }
        })
      );
		// return of(orgExample);
	}

  /**
	 * hasPermission return true if the user have permission
	 */
	public get hasCurationPermission(): boolean {
		let permission = new Permission(this.oauthStorage);

		if (permission.hasPermissions("curator") || permission.hasPermissions("admin")) {
			return true;
		}
		return false;
	}

}

