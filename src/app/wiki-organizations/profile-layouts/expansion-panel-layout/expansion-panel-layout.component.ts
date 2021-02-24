import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'expansion-panel-layout',
  templateUrl: './expansion-panel-layout.component.html',
  styleUrls: ['./expansion-panel-layout.component.scss']
})
export class ExpansionPanelLayoutComponent implements OnInit {
  step = 1;
  @Input()
  services: any ;
  _services: any;
  loading = true;
  /* @Input()
  services$: Observable<Array<any>> ; */
  /* @Input()
  getServices: () => Observable<Array<any>> */

  safeSrc: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { 
    
  }

  ngOnInit() { 
    setTimeout(() => {
      this._services = this.services;
      this.loading = false;
    }, 4000);
    // document.getElementById("iframe").setAttribute("src", this.load(this.services[1].value));
    
  }

  load(value){
      return this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(value);
     
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
