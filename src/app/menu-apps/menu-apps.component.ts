
import { Component } from '@angular/core';
import { Environment } from 'toco-lib';

@Component({
    selector: 'sceiba-menu-apps',
    templateUrl: './menu-apps.component.html',
    styleUrls: ['./menu-apps.component.scss']
})
export class SceibaMenuAppsComponent {
  public env;

  public constructor(
      private _env: Environment
  ) { }

  ngOnInit(){
      this.env = this._env;
  }


}
