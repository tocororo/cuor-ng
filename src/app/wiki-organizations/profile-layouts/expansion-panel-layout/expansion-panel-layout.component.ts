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
  /* @Input()
  services$: Observable<Array<any>> ; */
  /* @Input()
  getServices: () => Observable<Array<any>> */

  safeSrc: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { 
    
  }

  ngOnInit() { 
    console.log(this.services);
    
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
