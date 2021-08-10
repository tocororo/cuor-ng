
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-card-item-info',
  templateUrl: './card-item-info.component.html',
  styleUrls: ['./card-item-info.component.scss']
})
export class CardItemInfoComponent implements OnInit {

  @Input()
  public title : string;

  @Input()
  public info: { label: string, icon: string, text: string }[];

  /**
   * Represents the selected position. 
   * If its value equals -1, then there is nothing to select. 
   */
  public selectedPos: number;

  public constructor(private _transServ: TranslateService)
  {
    this.title = '';
    this.info = [ ];

    this.selectedPos = -1;  /* There is nothing to select. */
  }

  public ngOnInit(): void
  {
    if (this.info)
    {
      this.selectedPos = 0;
    }
  }
}
