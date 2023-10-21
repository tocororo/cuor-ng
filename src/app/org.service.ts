import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { Environment, Hit, Organization, SearchResponse, User } from 'toco-lib';



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

  private iso639 = [
    { label : "ab", value : "Abkhaz" },
    { label : "hy", value : "Armenio" },
    { label : "eu", value : "Vasco" },
    { label : "bg", value : "Búlgaro" },
    { label : "ca", value : "Catalán" },
    { label : "ce", value : "Chechenio" },
    { label : "ny", value : "Chichewa o Chewa o Nyanja" },
    { label : "zh", value : "Chino"},
    { label : "en", value : "Inglés" },
    { label : "eo", value : "Esperanto" },
    { label : "es", value : "Español (o Castellano)" },
    { label : "he", value : "Hebreo (moderno)" },
    { label : "hi", value : "Hindi" },
    { label : "la", value : "Latin" },
    { label : "no", value : "Noruego" },
    { label : "cu", value : "Antiguo eslavo eclesiástico o Iglesia eslava o eslavo eclesiástico o antiguo Búlgaro o Esclavo viejo" }
  ];

  private dpa = [
    {
        "name":"Pinar del Río",
        "iso":"CU-01",
        "dpa":"21",
        "municipalities": [
            { dpa: "2101", name: "Sandino"},
            { dpa: "2102", name: "Mantua"},
            { dpa: "2103", name: "Minas de Matahambre"},
            { dpa: "2104", name: "Viñales"},
            { dpa: "2105", name: "La Palma"},
            { dpa: "2106", name: "Los Palacios"},
            { dpa: "2107", name: "Consolación del Sur"},
            { dpa: "2108", name: "Pinar del Río"},
            { dpa: "2109", name: "San Luis"},
            { dpa: "2110", name: "San Juan y Martínez"},
            { dpa: "2111", name: "Guane"}
        ]
    },
    {
        "name":"Artemisa",
        "iso":"CU-15",
        "dpa":"22",
        "municipalities": [
            { dpa: "2201", name: "Bahía Honda"},
            { dpa: "2202", name: "Mariel"},
            { dpa: "2203", name: "Guanajay"},
            { dpa: "2204", name: "Caimito"},
            { dpa: "2205", name: "Bauta"},
            { dpa: "2206", name: "San Antonio de los Baños"},
            { dpa: "2207", name: "Güira de Melena"},
            { dpa: "2208", name: "Alquízar"},
            { dpa: "2209", name: "Artemisa"},
            { dpa: "2210", name: "Candelaria"},
            { dpa: "2211", name: "San Cristóbal"}
        ]
    },
    {
        "name":"La Habana",
        "iso":"CU-03",
        "dpa":"23",
        "municipalities": [
            { dpa: "2301", name: "Playa"},
            { dpa: "2302", name: "Plaza de la Revolución"},
            { dpa: "2303", name: "Centro Habana"},
            { dpa: "2304", name: "La Habana Vieja"},
            { dpa: "2305", name: "Regla"},
            { dpa: "2306", name: "Habana del Este"},
            { dpa: "2307", name: "Guanabacoa"},
            { dpa: "2308", name: "San Miguel del Padrón"},
            { dpa: "2309", name: "Diez de Octubre"},
            { dpa: "2310", name: "Cerro"},
            { dpa: "2311", name: "Marianao"},
            { dpa: "2312", name: "La Lisa"},
            { dpa: "2313", name: "Boyeros"},
            { dpa: "2314", name: "Arroyo Naranjo"},
            { dpa: "2315", name: "Cotorro"}
        ]
    },
    {
        "name":"Mayabeque",
        "iso":"CU-16",
        "dpa":"24",
        "municipalities": [
            { dpa : "2401", name : "Bejucal"},
            { dpa : "2402", name : "San José de Las Lajas"},
            { dpa : "2403", name : "Jaruco"},
            { dpa : "2404", name : "Santa Cruz del Norte"},
            { dpa : "2405", name : "Madruga"},
            { dpa : "2406", name : "Nueva Paz"},
            { dpa : "2407", name : "San Nicolás"},
            { dpa : "2408", name : "Güines"},
            { dpa : "2409", name : "Melena del Sur"},
            { dpa : "2410", name : "Batabanó"},
            { dpa : "2411", name : "Quivicán"}
        ]
    },
    {
        "name":"Matanzas",
        "iso":"CU-04",
        "dpa":"25",
        "municipalities": [
            {dpa : "2501", name : "Matanzas"},
            {dpa : "2502", name : "Cárdenas"},
            {dpa : "2503", name : "Martí"},
            {dpa : "2504", name : "Colón"},
            {dpa : "2505", name : "Perico"},
            {dpa : "2506", name : "Jovellanos"},
            {dpa : "2507", name : "Pedro Betancourt"},
            {dpa : "2508", name : "Limonar"},
            {dpa : "2509", name : "Unión de Reyes"},
            {dpa : "2510", name : "Ciénaga de Zapata"},
            {dpa : "2511", name : "Jagüey Grande"},
            {dpa : "2512", name : "Calimete"},
            {dpa : "2513", name : "Los Arabos"}
        ]
    },
    {
        "name":"Villa Clara",
        "iso":"CU-05",
        "dpa":"26",
        "municipalities": [
            { dpa: "2601", name: "Corralillo"},
            { dpa: "2602", name: "Quemado de Güines"},
            { dpa: "2603", name: "Sagua la Grande"},
            { dpa: "2604", name: "Encrucijada"},
            { dpa: "2605", name: "Camajuaní"},
            { dpa: "2606", name: "Caibarién"},
            { dpa: "2607", name: "Remedios"},
            { dpa: "2608", name: "Placetas"},
            { dpa: "2609", name: "Santa Clara"},
            { dpa: "2610", name: "Cifuentes"},
            { dpa: "2611", name: "Santo Domingo"},
            { dpa: "2612", name: "Ranchuelo"},
            { dpa: "2613", name: "Manicaragua"}
        ]
    },
    {
        "name":"Cienfuegos",
        "iso":"CU-06",
        "dpa":"27",
        "municipalities": [
            { dpa: "2701", name: "Aguada de Pasajeros"},
            { dpa: "2702", name: "Rodas"},
            { dpa: "2703", name: "Palmira"},
            { dpa: "2704", name: "Lajas"},
            { dpa: "2705", name: "Cruces"},
            { dpa: "2706", name: "Cumanayagua"},
            { dpa: "2707", name: "Cienfuegos"},
            { dpa: "2708", name: "Abreus"}
        ]
    },
    {
        "name":"Sancti Spíritus",
        "iso":"CU-07",
        "dpa":"28",
        "municipalities": [
            { dpa: "2801", name : "Jaguajay"},
            { dpa: "2802", name : "Jatibonico"},
            { dpa: "2803", name : "Taguasco"},
            { dpa: "2804", name : "Cabaiguán"},
            { dpa: "2805", name : "Fomento"},
            { dpa: "2806", name : "Trinidad"},
            { dpa: "2807", name : "Sancti Spiritus"},
            { dpa: "2808", name : "La Sierpe"}
        ]
    },
    {
        "name":"Ciego de Ávila",
        "iso":"CU-08",
        "dpa":"29",
        "municipalities": [
            { dpa: "2901", name: "Chambas"},
            { dpa: "2902", name: "Morón"},
            { dpa: "2903", name: "Bolivia"},
            { dpa: "2904", name: "Primero de Enero"},
            { dpa: "2905", name: "Ciro Redondo"},
            { dpa: "2906", name: "Florencia"},
            { dpa: "2907", name: "Majagua"},
            { dpa: "2908", name: "Ciego de Ávila"},
            { dpa: "2909", name: "Venezuela"},
            { dpa: "2910", name: "Baragua"}
          ]
    },
    {
        "name":"Camagüey",
        "iso":"CU-09",
        "dpa":"30",
        "municipalities": [
            { dpa: "3001", name: "Carlos Manuel de Céspedes"},
            { dpa: "3002", name: "Esmeralda"},
            { dpa: "3003", name: "Sierra de Cubitas"},
            { dpa: "3004", name: "Minas"},
            { dpa: "3005", name: "Nuevitas"},
            { dpa: "3006", name: "Guáimaro"},
            { dpa: "3007", name: "Sibanicú"},
            { dpa: "3008", name: "Camagüey"},
            { dpa: "3009", name: "Florida"},
            { dpa: "3010", name: "Vertientes"},
            { dpa: "3011", name: "Jimaguayú"},
            { dpa: "3012", name: "Najasa"},
            { dpa: "3013", name: "Santa Cruz del Sur"}
        ]
    },
    {
        "name":"Las Tunas",
        "iso":"CU-10",
        "dpa":"31",
        "municipalities": [
            { dpa: "3101", name: "Manatí"},
            { dpa: "3102", name: "Puerto Padre"},
            { dpa: "3103", name: "Jesús Menéndez"},
            { dpa: "3104", name: "Majibacoa"},
            { dpa: "3105", name: "Las Tunas"},
            { dpa: "3106", name: "Jobabo"},
            { dpa: "3107", name: "Colombia"},
            { dpa: "3108", name: "Amancio"}
        ]
    },
    {
        "name":"Holguín",
        "iso":"CU-11",
        "dpa":"32",
        "municipalities": [
            { dpa: "3201", name : "Gibara"},
            { dpa: "3202", name : "Rafael Freyre"},
            { dpa: "3203", name : "Banes"},
            { dpa: "3204", name : "Antilla"},
            { dpa: "3205", name : "Baguanos"},
            { dpa: "3206", name : "Holguín"},
            { dpa: "3207", name : "Calixto García"},
            { dpa: "3208", name : "Cacocum"},
            { dpa: "3209", name : "Urbano Noris"},
            { dpa: "3210", name : "Cueto"},
            { dpa: "3211", name : "Mayarí"},
            { dpa: "3212", name : "Franl País"},
            { dpa: "3213", name : "Sagua de Tánamo"},
            { dpa: "3214", name : "Moa"}
        ]
    },
    {
        "name":"Granma",
        "iso":"CU-12",
        "dpa":"33",
        "municipalities": [
            { dpa: "3301", name: "Río Cauto"},
            { dpa: "3302", name: "Cauto Cristo"},
            { dpa: "3303", name: "Jiguaní"},
            { dpa: "3304", name: "Bayamo"},
            { dpa: "3305", name: "Yara"},
            { dpa: "3306", name: "Manzanillo"},
            { dpa: "3307", name: "Campechuela"},
            { dpa: "3308", name: "Media Luna"},
            { dpa: "3309", name: "Niquero"},
            { dpa: "3310", name: "Pilón"},
            { dpa: "3311", name: "Bartolomé Masó"},
            { dpa: "3312", name: "Buey Arriba"},
            { dpa: "3313", name: "Guisa"}
        ]
    },
    {
        "name":"Santiago de Cuba",
        "iso":"CU-13",
        "dpa":"34",
        "municipalities": [
            { dpa:"3401", name: "Contramaestre"},
            { dpa:"3402", name: "Mella"},
            { dpa:"3403", name: "San Luis"},
            { dpa:"3404", name: "Segundo Frente"},
            { dpa:"3405", name: "Songo - La Maya"},
            { dpa:"3406", name: "Santiago de Cuba"},
            { dpa:"3407", name: "Palma Soriano"},
            { dpa:"3408", name: "Tercer Frente"},
            { dpa:"3409", name: "Guamá"}
        ]
    },
    {
        "name":"Guantánamo",
        "iso":"CU-14",
        "dpa":"35",
        "municipalities": [
            {dpa: "3501", name: "El Salvador"},
            {dpa: "3502", name: "Manuel Tames"},
            {dpa: "3503", name: "Yateras"},
            {dpa: "3504", name: "Baracoa"},
            {dpa: "3505", name: "Maisí"},
            {dpa: "3506", name: "Imías"},
            {dpa: "3507", name: "San Antonio del Sur"},
            {dpa: "3508", name: "Caimanera"},
            {dpa: "3509", name: "Guantánamo"},
            {dpa: "3510", name: "Niceto Pérez"}
        ]
    },
    {
        "name":"Isla de la Juventud",
        "iso":"CU-99",
        "dpa":"4001"
    }
  ];

  private newHttp: HttpClient;
  constructor(
    private http: HttpClient,
    // private oauthStorage: OAuthStorage,
    private handler: HttpBackend,
    private environment: Environment
  ) {
    this.newHttp = new HttpClient(handler);
  }

  /**
   * getISO639
   */
  public getISO639() {
    return this.iso639;
  }

  /**
   * getDPA
   */
  public getDPA() {
    return this.dpa;
  }

  public editOrganization(org: Organization): Observable<any> {
    const payload = org.entitystringify();
    console.log("payload", payload)
    console.log("edit service org ", org);
    const url = this.environment.cuorApi + this.prefix + "/" + org.id + "/curate";
    let aux = this.http.post<any>(url, payload, this.httpOptions);
    console.log("API response:", aux);
    return aux;

  }

  public fileUpload(formData: FormData) {
    const url = this.environment.cuorHost + "import";

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
    const req = this.environment.sceibaApi + 'search/organizations/';
    // console.log(req);

    return this.http.get<SearchResponse<Organization>>(req, options);
  }

  getActiveOrganizationById(id: string): Observable<Hit<Organization>> {
    const req = this.environment.sceibaApi + 'organizations/active/' + id ;
    // console.log(req);

    return this.newHttp.get<Hit<Organization>>(req);
  }

  getOrganizationById(id: string): Observable<Hit<Organization>> {
    const req = this.environment.sceibaApi + 'pid/organization/' + id ;
    // console.log(req);

    return this.newHttp.get<Hit<Organization>>(req);
  }

}


@Injectable({
  providedIn: 'root'
})
export class UserService  {

  user: User;

  constructor(
    protected http: HttpClient,
    private _router: Router,
    private environment: Environment) { }

  public getUserLogin(){
    this.http.get<any>(this.environment.cuorApi + 'me').subscribe(
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
