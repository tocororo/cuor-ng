
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-org-footer',
    templateUrl: './org-footer.component.html',
    styleUrls: ['./org-footer.component.scss']
})
export class OrgFooterComponent implements OnInit {

    @Input()
    public extraImagePath="";

    @Input()
    public sites: Array< { name: string, url: string, useRouterLink: boolean } >;

    @Input()
    public information: Array< { name: string, url: string, useRouterLink: boolean } >;

    @Input()
    public image: string

    public constructor() { }

    public ngOnInit(): void {
        if ( this.sites == undefined ) this.sites = new Array();
        if ( this.information == undefined ) this.information = new Array();
    }
}
