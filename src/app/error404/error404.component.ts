import { Component, OnInit } from '@angular/core';
import { Environment } from 'toco-lib';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  public env: Environment;

  constructor(private environment: Environment) { this.env = this.environment;}

  ngOnInit() {
  }

}
