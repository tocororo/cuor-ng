
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
// import { OAuthStorage } from 'angular-oauth2-oidc';
import { Organization, MetadataService } from 'toco-lib';
import { Permission } from '../permission.service'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-org-view',
  templateUrl: './org-viewer.component.html',
  styleUrls: ['./org-viewer.component.scss']
})
export class OrgViewerComponent implements OnInit {
  public org: Organization = null;

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    public iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private metadata: MetadataService
    ) { }
  loading = true;
  view_type:boolean = true;
  data:any = '';

  identifiers = [];

  public ngOnInit(): void {

    this.iconRegistry.addSvgIcon('wikidata',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/Wikidata-logo.svg'));
    /* Gets the `Organization` data. */

    this._activatedRoute.data.subscribe(
      (data) => {
        this.org = data.org.metadata;
        this.loading = false;
        // this.org = data.org;

        this.identifiers = data.org.metadata.identifiers.map( (ident) => ([{text: ident.idtype, style: 'text'}, {text: ident.value, style: 'text'}]));
      }
    );

    this._activatedRoute.data.subscribe(
      (data) => {
        this.metadata.meta.updateTag({name:"DC.title", content:this.org.name});
        this.metadata.meta.updateTag({name:"description", content:"Metadatos de organización en Sistema de identificación de Organizaciones Cubanas"});
        this.metadata.meta.updateTag({name:"generator", content:"Sceiba en Organizaciones Cubanas Proyecto Vlir Joint"});
        this.metadata.meta.updateTag({name:"keywords", content:"Sceiba, organizaciones, identificación persistente, Cuba"});
        this.metadata.meta.updateTag({name:"robots", content:"index,follow"});
        console.log("entrando en metadata");

      })

  }

  /**
  * hasPermission return true if the user have permission
  */
  public get hasPermission(): boolean {
    let permission = new Permission();

    if (permission.hasPermissions("curator") || permission.hasPermissions("admin")) {
      return true;
    }
    return false;
  }

  showWikidataButton(){
    return this.org.identifiers.find(id => id.idtype === "wkdata" ) !== undefined;
  }

    /* This function redirect to the profile for employes and afiliates od the organization
   *
   */
  /* redirectProfile() {
    this.router.navigate(['wiki-organizations/organization'], {
      queryParams: { QID: this.org.identifiers.find(id => id.idtype === "wkdata" ).value, label: this.org.name, lang: "es" },
      queryParamsHandling: 'merge'
    })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }; */

  changeView(): void {
    this.view_type = !this.view_type;
    this.showWikidata();
  }

  showWikidata() {
    this.data = {
      QID: this.org.identifiers.find(id => id.idtype === "wkdata" ).value,
      //label: this.org.name,
      label: this.org.labels.find(id => id.iso639 === "es" ).label,
      lang: this.org.labels.find(id => id.iso639 === "es" ).iso639
    }
    console.log( this.data);
  };
  saveAsPDF() {
    console.log('this.org.aliases===',  this.org.aliases);
    const empty = '------------------------------------------------------------------------------------------------------------------------------------';
    const identifiers = this.org.identifiers.map( (val) => ([{text: val.idtype, style: 'text'}, {text: val.value, style: 'text'}]));
    const labels = this.org.labels.map( (val) => ([{text: val.label, style: 'text'}, {text: val.iso639, style: 'text'}]));
    const addresses = this.org.addresses.map( (val) => ([
      {text: val.city, style: 'subHeader'}, {text: val.country, style: 'subHeader'},
      {text: val.country_code, style: 'subHeader'}, {text: val.lat, style: 'subHeader'},
      {text: val.lng, style: 'subHeader'},
      {text: val.primary, style: 'subHeader'}
    ]));
    // const relationships = this.org.relationships.map( (val) => ([
    //   {text: val.city, style: 'subHeader'}, {text: val.country, style: 'subHeader'},
    //   {text: val.country_code, style: 'subHeader'}, {text: val.lat, style: 'subHeader'},
    //   {text: val.lng, style: 'subHeader'},
    //   {text: val.primary, style: 'subHeader'}
    // ]));
    const tableLayout = {
      hLineWidth: (i, node) => {
        return (i === 0 || i === node.table.body.length) ? 2 : 1;
      },
      vLineWidth: (i, node) => {
        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
      },
      hLineColor: (i, node) => {
        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
      },
      vLineColor: (i, node) => {
        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
      },
      fillColor: (rowIndex, node, columnIndex) => {
        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
      }
    };

    const documentDefinition = {
      content : [
        { text: this.org.name, style: 'header'},
        { text: `SceibaOrgID: ${ this.org.id }`, style: 'text'},
        { text: `Estatus de la organización: ${ this.org.status }`, style: 'text'},
        { text: 'Lista de los identificadores de la organización', style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Identifier type', style: 'tableHeader'}, {text: 'Identifier value', style: 'tableHeader'}],
              ...identifiers
            ]
          },
          layout: tableLayout,
        },
        { text: 'Lista de otros nombres con los que se conoce la organización :', style: 'header'},
        { text: this.org.aliases.length > 0 ? this.org.aliases.join(', ') : empty, style: 'text'},
        { text: 'Lista de los acrónimos con que se conoce la organización :', style: 'header'},
        { text: this.org.acronyms.length > 0 ? this.org.acronyms.join(', ') : empty, style: 'text'},
        { text: 'Lista de los tipos que describen la organización :', style: 'header'},
        { text: this.org.types.length > 0 ? this.org.types.join(', ') : empty, style: 'text'},
        { text: 'URL de la página de Wikipedia de la organización :', style: 'header'},
        { text: this.org.wikipedia_url || empty, style: 'text'},
        { text: 'URL de la página originaria de la organización :', style: 'header'},
        { text: this.org.redirect ? this.org.redirect.properties.value : empty, style: 'text'},
        { text: 'Correo electrónico de contacto de la organización :', style: 'header'},
        { text: this.org.email_address || empty, style: 'text'},
        {
          columns: [
            {
              style: 'columnHeader',
              text: 'Año de fundada la organización :'
            },
            {
              style: 'columnText',
              text: this.org.established || '----------'
            },
          ]
        },
        {
          columns: [
            {
              style: 'columnHeader',
              text: 'Número de registro en la ONEI :'
            },
            {
              style: 'columnText',
              text: this.org.onei_registry || '----------'
            },
          ]
        },
        { text: 'Lista de los enlaces conocidos de la organización :', style: 'header'},
        { text: this.org.links || empty, style: 'text'},
        { text: 'Nombre de la organización en diferentes lenguajes :', style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Institute name in a language variant', style: 'tableHeader'}, {text: 'ISO-639-1 language code', style: 'tableHeader'}],
              ...labels
            ]
          },
          layout: tableLayout,
        },
        { text: 'Direcciones conocidas de la organización :', style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Nombre de la Ciudad', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Nombre del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Código ISO 3166-1 alpha-2 del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Latidtud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Longitud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Especifica si esta dirección identifica la dirección principal', style: 'tableHeader', fillColor: '#CCCCCC'}
              ],
              ...addresses
            ]
          },
        },
        { text: 'Relaciones con otras organizaciones :', style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Nombre de la Ciudad', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Nombre del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Código ISO 3166-1 alpha-2 del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Latidtud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Longitud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Especifica si esta dirección identifica la dirección principal', style: 'tableHeader', fillColor: '#CCCCCC'}
              ],
              // ...relationships
            ]
          },
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        subHeader: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        text: {
          fontSize: 10,
          margin: [0, 5, 0, 0]
        },
        table: {
          margin: [0, 5, 0, 0]
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 0]
        },
        columnHeader: {
          margin: [0, 15, 0, 0],
          fontSize: 14,
          bold: true,
          width: 'auto',
        },
        columnText: {
          margin: [0, 18, 0, 0],
          fontSize: 12,
          width: 'auto',
        }
      },
    };

    pdfMake.createPdf(documentDefinition).open();
  };

}
