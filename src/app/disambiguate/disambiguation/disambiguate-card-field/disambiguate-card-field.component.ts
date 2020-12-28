import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-disambiguate-card-field',
  templateUrl: './disambiguate-card-field.component.html',
  styleUrls: ['./disambiguate-card-field.component.scss']
})
export class DisambiguateCardFieldComponent implements OnInit {

  @Input() isMaster: boolean = true;
  @Input() cardTitle: string = null;
  @Input() cardSubtitles: string[] = null;
  @Input() cardContent: string = null;

  constructor() { }

  ngOnInit() {
    //console.log(" aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiii     ", this.title, this.subtitles);

  }

}
