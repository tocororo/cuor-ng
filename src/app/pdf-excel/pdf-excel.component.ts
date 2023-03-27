import {Component, Inject, Input, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const options = [ { key: 'identifiers', value: 'Lista de los identificadores de la organización'},
  { key: 'aliases', value: 'Lista de otros nombres con los que se conoce la organización'},
  { key: 'acronyms', value: 'Lista de los acrónimos con que se conoce la organización'},
  { key: 'types', value: 'Lista de los tipos que describen la organización'},
  { key: 'wikipedia_url', value: 'URL de la página de Wikipedia de la organización'},
  { key: 'redirect', value: 'URL de la página originaria de la organización'},
  { key: 'email_address', value: 'Correo electrónico de contacto de la organización'},
  { key: 'established', value: 'Año de fundada la organización'},
  { key: 'onei_registry', value:  'Número de registro en la ONEI' },
  { key: 'links', value:  'Lista de los enlaces conocidos de la organización' },
  {key: 'labels', value:  'Nombre de la organización en diferentes lenguajes' },
  { key: 'addresses', value: 'Direcciones conocidas de la organización'},
  { key: 'relationships', value: 'Relaciones con otras organizaciones'},]

@Component({
  selector: 'app-pdf-excel',
  templateUrl: './pdf-excel.component.html',
  styleUrls: ['./pdf-excel.component.scss']
})


export class PdfExcelComponent implements OnInit {

  @Input() inputValue: any = null;
  @Input() pdfType: 'list' | 'single' = 'single';
  @Input() type: 'pdf' | 'excel' | null = null;
  @Input() viewType: 'icon' | 'button' = 'icon';

  orgFormGroup: UntypedFormGroup = this._formBuilder.group({ id: ''},[]);
  keys: string[] = []
  pdfArray: any = []

  tableLayout = {
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

  constructor(public PdfDialog: MatDialog,
  private _formBuilder: UntypedFormBuilder,) { }

  ngOnInit() {
    this.orgFormGroup = this._formBuilder.group({
      identifiers: new UntypedFormControl(false),
      aliases: new UntypedFormControl(false),
      acronyms: new UntypedFormControl(false),
      types: new UntypedFormControl(false),
      wikipedia_url: new UntypedFormControl(false),
      redirect: new UntypedFormControl(false),
      email_address: new UntypedFormControl(false),
      established: new UntypedFormControl(false),
      onei_registry: new UntypedFormControl(false),
      links: new UntypedFormControl(false),
      labels: new UntypedFormControl(false),
      addresses: new UntypedFormControl(false),
      relationships: new UntypedFormControl((false),)
    })
  }
  identifiers(value, tableLayout) {
    const _value = value || this.inputValue.identifiers;
    return _value && _value.length > 0 ? [
      {text: options[0].value, style: 'header'},
      {
        style: 'table',
        table: {
          body: [
            [{text: 'Identifier type', style: 'tableHeader'}, {text: 'Identifier value', style: 'tableHeader'}],
            ..._value.map((val) => ([{text: val.idtype, style: 'text'}, {
              text: val.value,
              style: 'text'
            }]))
          ]
        },
        layout: tableLayout,
      }] : [null];
  }

  aliasses(value, ) {
    const _value = value || this.inputValue.aliases;
    return _value && _value.length > 0 ? [
      {text: options[1].value, style: 'header'},
      {text: _value.join(', '), style: 'text'}] : [null];
  }

  acronyms(value, ) {
    const _value = value || this.inputValue.acronyms;
    return _value && _value.length > 0 ? [
      {text: options[2].value, style: 'header'},
      {text: this.inputValue.acronyms.join(', '), style: 'text'}] : [null];
  }

  types(value, ) {
    const _value = value || this.inputValue.types;
    return _value && _value.length > 0 ? [
      {text: options[3].value, style: 'header'},
      {text: _value.join(', '), style: 'text'}] : [null];
  }

  wikipedia(value, ) {
    const _value = value || this.inputValue.wikipedia_url;
    return _value ? [
      {text: options[4].value, style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  redirect(value, ) {
    const _value = value || this.inputValue.redirect;
    return _value ? [
      {text: options[5].value, style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  emailAddress(value, ) {
    const _value = value || this.inputValue.email_address;
    return _value ? [
      {text: options[6].value, style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  founded(value, ) {
    const _value = value || this.inputValue.established;
    return _value ? [{
      columns: [
        {
          style: 'columnHeader',
          text: options[7].value
        },
        {
          style: 'columnText',
          text: _value
        },
      ]
    }] : [null];
  }

  oneiRegistry(value, ) {
    const _value = value || this.inputValue.onei_registry;
    return _value ? [{
      columns: [
        {
          style: 'columnHeader',
          text: options[8].value
        },
        {
          style: 'columnText',
          text: _value
        },
      ]
    }] : [null];
  }

  links(value, ) {
    const _value = value || this.inputValue.links;
    return _value ? [{text: options[9].value, style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

    labels(value, tableLayout) {
    const _value = value || this.inputValue.labels;
    return _value && _value.length > 0 ? [{
      text: options[10].value,
      style: 'header'
    },
      {
        style: 'table',
        table: {
          body: [
            [{text: 'Institute name in a language variant', style: 'tableHeader'}, {
              text: 'ISO-639-1 language code',
              style: 'tableHeader'
            }],
            ..._value.map((val) => ([{text: val.label, style: 'text'}, {
              text: val.iso639,
              style: 'text'
            }]))
          ]
        },
        layout: tableLayout,
      }] : [null];
  }

  addresses(value, ) {
    const _value = value || this.inputValue.addresses;
    return _value && _value.length > 0 ?
      [{text: options[11].value, style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Nombre de la Ciudad', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Nombre del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Código ISO 3166-1 alpha-2 del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Latidtud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Longitud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {
                  text: 'Especifica si esta dirección identifica la dirección principal',
                  style: 'tableHeader',
                  fillColor: '#CCCCCC'
                }
              ],
              ..._value.map((val) => ([
                {text: val.city, style: 'subHeader'}, {text: val.country, style: 'subHeader'},
                {text: val.country_code, style: 'subHeader'}, {text: val.lat, style: 'subHeader'},
                {text: val.lng, style: 'subHeader'},
                {text: val.primary, style: 'subHeader'}
              ]))
            ]
          },
        }] : [null];
  }

  relationships(value, ) {
    const _value = value || this.inputValue.relationships;
    return _value && _value.length > 0 ?
      [{text: options[12].value, style: 'header'},
        {
          style: 'table',
          table: {
            body: [
              [{text: 'Nombre de la Ciudad', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Nombre del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Código ISO 3166-1 alpha-2 del país', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Latidtud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {text: 'Longitud ( Coordenadas geográficas )', style: 'tableHeader', fillColor: '#CCCCCC'},
                {
                  text: 'Especifica si esta dirección identifica la dirección principal',
                  style: 'tableHeader',
                  fillColor: '#CCCCCC'
                }
              ],
              ..._value.map((val) => ([
                {text: val.city, style: 'subHeader'}, {text: val.country, style: 'subHeader'},
                {text: val.country_code, style: 'subHeader'}, {text: val.lat, style: 'subHeader'},
                {text: val.lng, style: 'subHeader'},
                {text: val.primary, style: 'subHeader'}
              ]))
            ]
          },
        }] : [null];
  }

  createPdfArray() {
    this.inputValue.forEach( (val, i) => {
      this.pdfArray.push(...[
        { text: val.metadata.name, pageBreak: i > 0 ? 'before' : '', style: 'header'},
        { text: `SceibaOrgID: ${ val.metadata.id }`, style: 'text'},
        { text: `Estatus de la organización: ${ val.metadata.status }`, style: 'text'},
        ...this.identifiers( this.keys.includes('identifiers') ? val.metadata.identifiers : null, this.tableLayout),
        ...this.aliasses(this.keys.includes('aliasses') ? val.metadata.aliasses : null),
        ...this.acronyms(this.keys.includes('acronyms') ? val.metadata.acronyms : null),
        ...this.types(this.keys.includes('types') ? val.metadata.types : null),
        ...this.wikipedia(this.keys.includes('wikipedia_url') ? val.metadata.wikipedia_url : null),
        ...this.redirect(this.keys.includes('redirect') ? val.metadata.redirect : null),
        ...this.emailAddress(this.keys.includes('emailAddress') ? val.metadata.emailAddress : null),
        ...this.founded(this.keys.includes('founded') ? val.metadata.founded : null),
        ...this.oneiRegistry(this.keys.includes('oneiRegistry') ? val.metadata.oneiRegistry : null),
        ...this.links(this.keys.includes('links') ? val.metadata.links : null),
        ...this.labels(this.keys.includes('labels') ? val.metadata.labels : null, this.tableLayout),
        ...this.addresses(this.keys.includes('addresses') ? val.metadata.addresses : null)
      ])
    })
  }

  saveAsPDF() {

    const content = this.pdfType === 'single' ? [
      { text: this.inputValue.name, style: 'header'},
      { text: `SceibaOrgID: ${ this.inputValue.id }`, style: 'text'},
      { text: `Estatus de la organización: ${ this.inputValue.status }`, style: 'text'},
      ...this.identifiers(null, this.tableLayout),
      ...this.aliasses(null),
      ...this.acronyms(null),
      ...this.types(null),
      ...this.wikipedia(null),
      ...this.redirect(null),
      ...this.emailAddress(null),
      ...this.founded(null),
      ...this.oneiRegistry(null),
      ...this.links(null),
      ...this.labels(null, this.tableLayout),
      ...this.addresses(null),
      // ...relationships
    ] : this.pdfArray

    const documentDefinition = {
      content,
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
  }

  openDialog(): void {
    const dialogRef = this.PdfDialog.open(PdfDialogComponent, {
      width: '600px',
      data: this.orgFormGroup
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.keys = options.filter( o => this.orgFormGroup.get(o.key).value === true ).map( o => o.key)
        await this.createPdfArray()
        this.saveAsPDF()
      }
    });
  }

  saveAsEXCEL() {
    const newBook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet([this.inputValue]);
    XLSX.utils.book_append_sheet(newBook, newSheet, 'Sheet1');
    XLSX.writeFile(newBook, 'new-book.xlsx');
  }
}

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: 'pdf-dialog.component.html',
})

export class PdfDialogComponent {
  public options = options

  constructor(
    public dialogRef: MatDialogRef<PdfExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UntypedFormGroup) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
