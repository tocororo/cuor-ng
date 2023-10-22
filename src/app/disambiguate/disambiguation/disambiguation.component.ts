import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hit, MessageHandler, Organization, Relationship, StatusCode } from 'toco-lib';
import { OrgService } from '../../_services/org.service';


@Component({
  selector: 'app-disambiguation',
  templateUrl: './disambiguation.component.html',
  styleUrls: ['./disambiguation.component.scss']
})
export class DisambiguationComponent implements OnInit, OnChanges {

  @Input() masterOrganization: Organization;
  @Input() secundariesOrganizations: Organization[];
  @Input() posSecundaryOrg: number;
  @Input() showSecundaries = false;

  selectedsecundaryOrganization: Organization;
  isDisabledNavigatePrevious: boolean;
  isDisabledNavigateNext: boolean;


  constructor(
    private _snackBar: MatSnackBar,
    private _orgService: OrgService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isDisabledNavigatePrevious = true;
    this.isDisabledNavigateNext = false;

    // var master = localStorage.getItem('master')
    // this.masterOrganization = JSON.parse(master)
    // console.log("masterrrrrrrrrrr: ", master, this.masterOrganization);

    // this.secundariesOrganizations = JSON.parse(localStorage.getItem('secundaries'))

    if (this.masterOrganization && this.secundariesOrganizations && this.secundariesOrganizations.length > 0) {
      //console.log("cargo las cosas", this.loaded);
      this.posSecundaryOrg = 0;
      this.SelectSecundaryOrganization()
    }


    //localStorage.removeItem('master');
    //localStorage.removeItem('secundaries');

    //console.log("la seleccionada: ", this.selectedsecundaryOrganization, this.secundariesOrganizations);

  }

  ngOnChanges(){
    if (this.masterOrganization)
      console.log("changes ", this.masterOrganization.relationships);

  }

  loaded(){
    return (this.masterOrganization && this.secundariesOrganizations && this.secundariesOrganizations.length > 0)
  }

  changingShowSecundaries(){
    if(!this.showSecundaries){
      this.posSecundaryOrg = 0;
      this.SelectSecundaryOrganization();
    }
    this.showSecundaries = !this.showSecundaries;

  }

  changingSecundaryPos(deletedPos:number){
    //console.log("*-*-*-*-*-*-*-*-*-*-*-*", deletedPos, this.posSecundaryOrg, this.secundariesOrganizations.length);
    //en este caso length ya tiene rebajado un elemento, pues se llama despues de eliminar para estar seguros
    //de no cambiar por gusto, por eso el tratamiento es diferente
    if(deletedPos > 0 && (deletedPos < this.posSecundaryOrg||deletedPos==this.secundariesOrganizations.length)){
      this.posSecundaryOrg = this.posSecundaryOrg - 1;
      //console.log("*-*-*-*-*-*-*-*-*-*-*-*", deletedPos, this.posSecundaryOrg, this.secundariesOrganizations.length);
    }
    this.SelectSecundaryOrganization();
  }


  // public ngOnChanges(): void{
  //   console.log("entro a ONCHANGES *************************************");


  // }

  canGoNext(){
    //console.log("pos: ", this.posSecundaryOrg, " ------- lenght: ", this.secundariesOrganizations.length);

    if (this.posSecundaryOrg < this.secundariesOrganizations.length - 1){
      return true;
    }
    return false;
  }

  canGoPrevius(){
    if (this.posSecundaryOrg > 0) {
      return true;
    }
    return false;
  }

  nextOrg(){
    this.isDisabledNavigatePrevious = false;

    if (this.posSecundaryOrg < this.secundariesOrganizations.length - 1){
      this.isDisabledNavigateNext = false;

      this.posSecundaryOrg++;
      this.SelectSecundaryOrganization();
    }
    else if (this.posSecundaryOrg == this.secundariesOrganizations.length - 1) {
      this.isDisabledNavigateNext = true;

      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.OK, 'No hay más versiones para mostrar')
    }

  }

  previousOrg(){
    this.isDisabledNavigateNext = false;

    if (this.posSecundaryOrg > 0) {
      this.isDisabledNavigatePrevious = false;

      this.posSecundaryOrg--;
      this.SelectSecundaryOrganization();

    }
    else if (this.posSecundaryOrg == 0) {
        this.isDisabledNavigatePrevious = true;

        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, 'No hay más organizaciones para mostrar')

    }

  }

  SelectSecundaryOrganization() {
    //console.log("estamos dento de select secundary: ", this.posSecundaryOrg, this.secundariesOrganizations);

    if (this.secundariesOrganizations.length >= 0 &&
        this.posSecundaryOrg >= 0 &&
        this.posSecundaryOrg < this.secundariesOrganizations.length) {

        // load the selected journal
        let version = new Hit<Organization>();
        //console.log("antes de copiar: ", this.secundariesOrganizations[this.posSecundaryOrg]);
        //console.log("----------------------------------------");

        //version.deepcopy(this.secundariesOrganizations[this.posSecundaryOrg]);
        //console.log("despues: ", version);
        //this.selectedsecundaryOrganization = version;

        this.selectedsecundaryOrganization = this.secundariesOrganizations[this.posSecundaryOrg];
        //console.log("seleccionando la secundary org ---->>>>>", this.selectedsecundaryOrganization, this.posSecundaryOrg);

    }
  }

  mergeIdentifiers(pids){
    var oldPids = this.masterOrganization.identifiers;
    var newOnes = pids.filter(a => {return !oldPids.some(x => x.value == a.value) })
    console.log("merging pids: ", oldPids, newOnes);

    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.identifiers = oldPids.concat(newOnes);
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }
  }

  mergeAcronyms(acronyms:[]){
    //console.log(acronyms);
    var oldAcronyms = this.masterOrganization.acronyms;
    var newOnes = acronyms.filter(a => {return !oldAcronyms.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.acronyms = oldAcronyms.concat(newOnes);
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }
    //console.log(" nuevos acronimossssssssssssssssssssssss", this.masterOrganization);

  }

  mergeAliases(aliases:[]){
    var oldAliases = this.masterOrganization.aliases;
    var newOnes = aliases.filter(a => {return !oldAliases.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.aliases = oldAliases.concat(newOnes);
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }

  }

  mergeTypes(types:[]){
    console.log(this.masterOrganization);

    var oldTypes = this.masterOrganization.types;
    var newOnes = types.filter(a => {return !oldTypes.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.types = oldTypes.concat(newOnes);
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }

  }

  mergeEstablished(newEstablished){
    var old = this.masterOrganization.established;
    if(newEstablished && newEstablished !== old) {
      this.masterOrganization.established = newEstablished;
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "El año es coincidente con el de la organziación principal");
    }
  }


  mergeOnei(newOneiRegistry){
    var old = this.masterOrganization.onei_registry;
    if(newOneiRegistry && newOneiRegistry !== old) {
      this.masterOrganization.onei_registry = newOneiRegistry;
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "El año es coincidente con el de la organziación principal");
    }
  }


  mergeWikipedia_url(newWikipedia_url){
    var old = this.masterOrganization.wikipedia_url;
    if(newWikipedia_url && newWikipedia_url !== old) {
      this.masterOrganization.wikipedia_url = newWikipedia_url;
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "La URL es coincidente con el de la organziación principal");
    }
  }


  mergeEmail_address(newEmail_Address){
    var old = this.masterOrganization.email_address;
    if(newEmail_Address && newEmail_Address !== old) {
      this.masterOrganization.email_address = newEmail_Address;
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "El correo electrónico es coincidente con el de la organziación principal");
    }
  }

  mergeRelationships(newRelationships){
    if(newRelationships != undefined){
      //console.log(newRelationships);
      var orgPrincipal = new Organization();
      orgPrincipal.deepcopy(this.masterOrganization)
      var realOnes = new Array<Relationship>();

      for(let newR of newRelationships){ //por cada nueva relacion que se quiere agregar reviso los pids
        var newPids = newR.identifiers; //asumo q inicialmente son todos
        let addThisOne = true;
        for (let index = 0; index < orgPrincipal.relationships.length; index++) { //recorro todas las que ya tiene
          //tomo los pids de cada una para ver si ya tiene relacion con la org
          var oldPids = orgPrincipal.relationships[index].identifiers;
          var realNewPids = newPids.filter(a => {return !oldPids.some(x => x.value == a.value) })
          //console.log("revisando pids", oldPids, newPids, realNewPids);

          //sacando los nuevos que no estan, se compara la longitud y ya se ve si es diferente es que alguno esta
          //y la organizacion existe pero faltan id por poner si queda alguno
          // o ya estan todos si esta vacio
          //si es 0 es que todos estan en esta instancia, o sea, es la misma org que ya esta presente
          //si devuelve < que la q habia, la org es esta misma, ya esta presente en la principal, pero faltan pids porponer
          //si es == es que no es esta org, hay que seguir probando con el resto de los identificadores a ver si es otra

          if(!realNewPids || realNewPids.length == 0){
            addThisOne = false;
            index = orgPrincipal.relationships.length;

            const m = new MessageHandler(this._snackBar);
            m.showMessage(
                StatusCode.serverError,
                "Organización principal ya tiene registrada la relación."
                );
          }
          else if(realNewPids.length < newPids.length){
            addThisOne = false;
            orgPrincipal.relationships[index].identifiers = oldPids.concat(realNewPids);
            if(orgPrincipal.relationships[index].type !== newR.type){
              const m = new MessageHandler(this._snackBar);
              m.showMessage(
                StatusCode.serverError,
                "Se encontraron relaciones entre organizaciones con tipos diferentes de relación, se mantiene el tipo registrado en la organziación principal."
                );
            }
            index = orgPrincipal.relationships.length;
          }

        }//segundo for

        //si llega aqui sin haber interceociones es que despues de recorrerlas todas no hubo coincidencias
        //entonces se agrega desde cero
        if(addThisOne){
          realOnes.push(newR)
          //console.log("revisando problema---> ", realOnes);
        }
      }//primer for

      //console.log("nuevas finalmente puestas: ", realOnes, " antes ", orgPrincipal.relationships);
      this.masterOrganization.relationships = realOnes.concat(orgPrincipal.relationships)
      //console.log("Finalmenteeeeeeee : ", this.masterOrganization.relationships);
    }

  }//cierre del metodo


  mergeLinks(links: string[]){
    var oldlinks = this.masterOrganization.links;
    var newOnes = links.filter(a => {return !oldlinks.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.links = oldlinks.concat(newOnes);
    }
    else {
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }
  }

  /***********************************************************
   * help for step 3
   ***********************************************************/
  openHelpStep3() {

    const dialogRef = this._dialog.open(Step3DisambiguateHelp, {
      width: '80%',
    });

  }


}


@Component({
  selector: 'disambiguate-step3-help',
  template: `
    <h1 mat-dialog-title> Ayuda para la desambiguación de metadatos </h1>
    <div mat-dialog-content>
      <div markdown [src]="'/assets/markdown/help.step3.disambiguation.md'"></div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()" cdkFocusInitial color="primary">Cerrar</button>
    </div>
  `,
  styleUrls: ['./disambiguation.component.scss']
})
export class Step3DisambiguateHelp {

  constructor(
    public dialogRef: MatDialogRef<Step3DisambiguateHelp>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
