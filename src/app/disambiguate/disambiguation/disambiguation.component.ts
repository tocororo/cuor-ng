import { Component, OnInit, OnChanges } from '@angular/core';
import { Organization, Hit, MessageHandler, StatusCode, Relationship, Address, Identifier } from 'toco-lib';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-disambiguation',
  templateUrl: './disambiguation.component.html',
  styleUrls: ['./disambiguation.component.scss']
})
export class DisambiguationComponent implements OnInit, OnChanges {

  masterOrganization: Hit<Organization> = null;
  posSecundaryOrg: number = -1;
  selectedsecundaryOrganization: Hit<Organization> = null;
  secundariesOrganizations: Hit<Organization>[] = null;
  loaded: boolean = false;
  isDisabledNavigatePrevious: boolean;
  isDisabledNavigateNext: boolean;
  showSecundaries = false;

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.isDisabledNavigatePrevious = true;
    this.isDisabledNavigateNext = false;

    var master = localStorage.getItem('master')
    this.masterOrganization = JSON.parse(master)
    console.log("masterrrrrrrrrrr: ", master, this.masterOrganization);
    
    this.secundariesOrganizations = JSON.parse(localStorage.getItem('secundaries'))
    if (this.masterOrganization && this.secundariesOrganizations && this.secundariesOrganizations.length > 0) {
      this.loaded = true;
      //console.log("cargo las cosas", this.loaded);
      
      this.posSecundaryOrg = 0;
      this.SelectSecundaryOrganization()
    }
    

    //localStorage.removeItem('master');
    //localStorage.removeItem('secundaries');

    //console.log("la seleccionada: ", this.selectedsecundaryOrganization, this.loaded);    
    
  }

  public ngOnChanges(): void{
    console.log("entro a ONCHANGES *************************************");
    

  }

  nextOrg(){
    if (this.posSecundaryOrg < this.secundariesOrganizations.length - 1){
      this.isDisabledNavigateNext = false;
      this.isDisabledNavigatePrevious = false;
      this.posSecundaryOrg++;
      this.SelectSecundaryOrganization();
    }
    else {
      this.isDisabledNavigateNext = true;
      const m = new MessageHandler(this._snackBar);
      m.showMessage(StatusCode.OK, 'No hay más versiones para mostrar')
    }
    if (this.posSecundaryOrg == this.secundariesOrganizations.length - 1) {
      this.isDisabledNavigateNext = true;
    }
  }
  
  previousOrg(){
    if (this.posSecundaryOrg > 0) {
      this.isDisabledNavigatePrevious = false;
      this.isDisabledNavigateNext = false;
      this.posSecundaryOrg--;
      this.SelectSecundaryOrganization();

    }
    else {

        this.isDisabledNavigatePrevious = true;
        const m = new MessageHandler(this._snackBar);
        m.showMessage(StatusCode.OK, 'No hay más organizaciones para mostrar')

    }
    if (this.posSecundaryOrg == 0) {
        this.isDisabledNavigatePrevious = true;
    }

  }

  SelectSecundaryOrganization() {
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

    }
  }

  mergeIdentifiers(pids){
    var oldPids = this.masterOrganization.metadata.identifiers;        
    var newOnes = pids.filter(a => {return !oldPids.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.metadata.identifiers = oldPids.concat(newOnes);    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }   
  }

  mergeAcronyms(acronyms:[]){
    //console.log(acronyms);    
    var oldAcronyms = this.masterOrganization.metadata.acronyms;        
    var newOnes = acronyms.filter(a => {return !oldAcronyms.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.metadata.acronyms = oldAcronyms.concat(newOnes);    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }   
    //console.log(" nuevos acronimossssssssssssssssssssssss", this.masterOrganization);    

  }

  mergeAliases(aliases:[]){
    var oldAliases = this.masterOrganization.metadata.aliases;        
    var newOnes = aliases.filter(a => {return !oldAliases.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.metadata.aliases = oldAliases.concat(newOnes);    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }   

  }

  mergeTypes(types:[]){
    var oldTypes = this.masterOrganization.metadata.types;        
    var newOnes = types.filter(a => {return !oldTypes.some(x => x == a) })
    if(newOnes && newOnes.length > 0) {
      this.masterOrganization.metadata.types = oldTypes.concat(newOnes);    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "Ya existen en la organización principal");
    }   

  }

  mergeEstablished(newEstablished){
    var old = this.masterOrganization.metadata.established;  
    if(newEstablished && newEstablished !== old) {
      this.masterOrganization.metadata.established = newEstablished;    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "El año es coincidente con el de la organziación principal");
    }   
  }


  mergeWikipedia_url(newWikipedia_url){
    var old = this.masterOrganization.metadata.wikipedia_url;  
    if(newWikipedia_url && newWikipedia_url !== old) {
      this.masterOrganization.metadata.wikipedia_url = newWikipedia_url;    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "La URL es coincidente con el de la organziación principal");
    }   
  }


  mergeEmail_address(newEmail_Address){
    var old = this.masterOrganization.metadata.email_address;  
    if(newEmail_Address && newEmail_Address !== old) {
      this.masterOrganization.metadata.email_address = newEmail_Address;    
    }
    else {
      const m = new MessageHandler(this._snackBar);                        
      m.showMessage(StatusCode.serverError, "El correo electrónico es coincidente con el de la organziación principal");
    }   
  }

  mergeRelationships(newRelationships){
    console.log(newRelationships);    
    var orgPrincipal = new Organization();  
    orgPrincipal.deepcopy(this.masterOrganization.metadata)
    var realOnes = new Array<Relationship>();
    
    for(let newR of newRelationships){ //por cada nueva relacion que se quiere agregar reviso los pids
      var newPids = newR.identifiers; //asumo q inicialmente son todos  
      let addThisOne = true;   
      for (let index = 0; index < orgPrincipal.relationships.length; index++) { //recorro todas las que ya tiene
        //tomo los pids de cada una para ver si ya tiene relacion con la org
        var oldPids = orgPrincipal.relationships[index].identifiers;
        var realNewPids = newPids.filter(a => {return !oldPids.some(x => x.value == a.value) })
                
        //sacando los nuevos que no estan, se compara la longitud y ya se ve si es diferente es que alguno esta
        //y la organizacion existe pero faltan id por poner si queda alguno 
        // o ya estan todos si esta vacio
        //si es 0 es que todos estan en esta instancia, o sea, es la misma org que ya esta presente
        //si devuelve < que la q habia, la org es esta misma, ya esta presente en la principal, pero faltan pids porponer
        //si es == es que no es esta org, hay que probar si es otra

        if(realNewPids.length < newPids.length){
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
        else if(!realNewPids.length){
          addThisOne = false;
          index = orgPrincipal.relationships.length;

          const m = new MessageHandler(this._snackBar);                        
          m.showMessage(
              StatusCode.serverError, 
              "Organización principal ya tiene registrada la relación."
              );
        }
        
      }//segundo for

      //si llega aqui sin haber interceociones es que despues de recorrerlas todas no hubo coincidencias
      //entonces se agrega desde cero
      if(addThisOne){
        realOnes.push(newR)    
            
      }
    }//primer for
    console.log("nuevas finalmente puestas: ", realOnes);
    this.masterOrganization.metadata.relationships = realOnes.concat(orgPrincipal.relationships)
    console.log("Finalmenteeeeeeee : ", this.masterOrganization.metadata.relationships);
    

  }//cierre del metodo

  approve(){
    console.log("approve()");
    
  }

  editVersion(){
    console.log("editVersion()");
    
  }

}