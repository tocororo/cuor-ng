import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { MessageHandler, Organization, Params, SearchResponse, StatusCode, User } from 'toco-lib';


import { environment } from 'src/environments/environment';

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

  private newHttp: HttpClient;
  constructor(
    private http: HttpClient,
    // private oauthStorage: OAuthStorage,
    private handler: HttpBackend
  ) {
    this.newHttp = new HttpClient(handler);
  }

  public editOrganization(org: Organization): Observable<any> {
    const payload = org.entitystringify();
    console.log(org, payload)
    const url = environment.cuorApi + this.prefix + "/" + org.id;
    return this.http.put<any>(url, payload, this.httpOptions);
  }

  public fileUpload(formData: FormData) {
    const url = environment.cuorHost + "import";

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    }
    this.httpOptions.headers.set("Authorization", "Bearer " + localStorage.getItem("access_token"));
    this.httpOptions.headers.set("Content-Type", "application/x-www-form-urlencoded");

    // const formData = new FormData();
    // formData.append("file",file, file.name);

    return this.newHttp.post<any>(url, formData);
  }

  getOrganizations(params: HttpParams): Observable<SearchResponse<Organization>> {
    const options = {
      params: params,
      // headers: this.headers
    };
    // console.log(params);
    const req = environment.cuorApi + 'organizations/';
    // console.log(req);

    return this.http.get<SearchResponse<Organization>>(req, options);
  }
  getOrganizationById(id: string): Observable<SearchResponse<Organization>> {
    const req = environment.cuorApi + 'organizations/' + id ;
    // console.log(req);

    return this.newHttp.get<SearchResponse<Organization>>(req);
  }

}


@Injectable({
  providedIn: 'root'
})
export class UserService implements CanActivate {

  user: User;

  constructor(
    protected http: HttpClient,
    private _router: Router) { }

  public getUserLogin(){
    this.http.get<any>(environment.cuorApi + 'me').subscribe(
      (user) => {
        this.user = user;
        this.loginChange()
      },
      (error: any) => {
        this.user = null;
        this.loginChange()
      },
      () => {
      }
    );
  }
  private authenticationSubject: Subject<User> = new Subject();
  /**
   * Observer to handles the behavior when a user authenticates
   */
  public authenticationSubjectObservable = this.authenticationSubject.asObservable();


  loginChange() {
    this.authenticationSubject.next(this.user);
  }
  /**
   * gives information about an user authenticated
   */
  getUserInfo(): any {
    this.user;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user != null) {
      return true;
    }
    else {
      this._router.navigate(['/']);
      return false;
    }

  }

}
