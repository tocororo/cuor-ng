import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { EnvService, MessageHandler, Organization, Params, StatusCode } from 'toco-lib';


@Injectable({
  providedIn: 'root'
})
export class OrgService{

  private prefix = "organizations";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer ",
    }),
  };

  private newHttp: HttpClient;
  constructor(
    private env: EnvService,
    private http: HttpClient,
    private oauthStorage: OAuthStorage,
    private handler: HttpBackend
  ) 
  { 
    this.newHttp = new HttpClient(handler);
  }


  public editOrganization(org: Organization): Observable<any>{
    const url = this.env.cuorApi + this.prefix + "/" + org.id;
    return this.http.put<any>(url, JSON.stringify(org), this.httpOptions);
  }

  public fileUpload(file: File, type: string) {
    const url = this.env.cuorHost + "import";

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    }
    this.httpOptions.headers.set("Authorization", "Bearer " + this.oauthStorage.getItem("access_token"));
    this.httpOptions.headers.set("Content-Type", "application/x-www-form-urlencoded");

    const formData = new FormData();
    formData.append("file",file, file.name);

    return this.newHttp.post<any>(url, formData);
  }
}
