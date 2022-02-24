import {Component, Input, OnInit} from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-excel',
  templateUrl: './pdf-excel.component.html',
  styleUrls: ['./pdf-excel.component.scss']
})


export class PdfExcelComponent implements OnInit {

  @Input() inputValue: any = null;
  @Input() pdfType: 'list' | 'single' = 'single';
  @Input() type: 'pdf' | 'excel' = 'pdf';

  constructor() { }

  ngOnInit() {
  }

  identifiers(value, tableLayout) {
    const _value = value || this.inputValue.identifiers;
    return _value && _value > 0 ? [
      {text: 'Lista de los identificadores de la organización', style: 'header'},
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
    return _value && _value > 0 ? [
      {text: 'Lista de otros nombres con los que se conoce la organización :', style: 'header'},
      {text: _value.join(', '), style: 'text'}] : [null];
  }

  acronyms(value, ) {
    const _value = value || this.inputValue.acronyms;
    return _value && _value > 0 ? [
      {text: 'Lista de los acrónimos con que se conoce la organización :', style: 'header'},
      {text: this.inputValue.acronyms.join(', '), style: 'text'}] : [null];
  }

  types(value, ) {
    const _value = value || this.inputValue.types;
    return _value && _value > 0 ? [
      {text: 'Lista de los tipos que describen la organización :', style: 'header'},
      {text: _value.join(', '), style: 'text'}] : [null];
  }

  wikipedia(value, ) {
    const _value = value || this.inputValue.wikipedia_url;
    return _value ? [
      {text: 'URL de la página de Wikipedia de la organización :', style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  redirect(value, ) {
    const _value = value || this.inputValue.redirect;
    return _value ? [
      {text: 'URL de la página originaria de la organización :', style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  emailAddress(value, ) {
    const _value = value || this.inputValue.email_address;
    return _value ? [
      {text: 'Correo electrónico de contacto de la organización :', style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

  founded(value, ) {
    const _value = value || this.inputValue.established;
    return _value ? [{
      columns: [
        {
          style: 'columnHeader',
          text: 'Año de fundada la organización :'
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
          text: 'Número de registro en la ONEI :'
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
    return _value ? [{text: 'Lista de los enlaces conocidos de la organización :', style: 'header'},
      {text: _value, style: 'text'}] : [null];
  }

    labels(value, tableLayout) {
    const _value = value || this.inputValue.labels;
    return _value && _value > 0 ? [{
      text: 'Nombre de la organización en diferentes lenguajes :',
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
    return _value && _value > 0 ?
      [{text: 'Direcciones conocidas de la organización :', style: 'header'},
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
    return _value && _value > 0 ?
      [{text: 'Relaciones con otras organizaciones :', style: 'header'},
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

  saveAsPDF() {
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

    const content = this.pdfType === 'single' ? [
      { text: this.inputValue.name, style: 'header'},
      { text: `SceibaOrgID: ${ this.inputValue.id }`, style: 'text'},
      { text: `Estatus de la organización: ${ this.inputValue.status }`, style: 'text'},
      ...this.identifiers(null, tableLayout),
      ...this.aliasses(null),
      ...this.acronyms(null),
      ...this.types(null),
      ...this.wikipedia(null),
      ...this.redirect(null),
      ...this.emailAddress(null),
      ...this.founded(null),
      ...this.oneiRegistry(null),
      ...this.links(null),
      ...this.labels(null, tableLayout),
      ...this.addresses(null),
      // ...relationships
    ] : [this.inputValue].map( val => (
      this.identifiers(val.metadata, tableLayout),
      this.aliasses(val.metadata),
      this.acronyms(val.metadata),
      this.types(val.metadata),
      this.wikipedia(val.metadata),
      this.redirect(val.metadata),
      this.emailAddress(val.metadata),
      this.founded(val.metadata),
      this.oneiRegistry(val.metadata),
      this.links(val.metadata),
      this.labels(val.metadata, tableLayout),
      this.addresses(val.metadata)));

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
}
