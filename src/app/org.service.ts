import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService, Organization } from 'toco-lib';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  private prefix = "organizations";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer ",
    }),
  };

  constructor(
    private env: EnvService,
    private http: HttpClient
  ) { }

  public editOrganization(org: Organization): Observable<any>{
    const url = this.env.cuorApi + this.prefix + "/" + org.id;
    return this.http.put<any>(url, JSON.stringify(org), this.httpOptions);
  }
}
