
import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-org-footer',
    templateUrl: './org-footer.component.html',
    styleUrls: ['./org-footer.component.scss']
})
export class OrgFooterComponent implements OnInit {

    @Input()
    public sites: Array< { name: string, url: string, useRouterLink: boolean } >;

    @Input()
    public information: Array< { name: string, url: string, useRouterLink: boolean } >;

    // @Input()
    // public image: string

    // @Input()
    // public extraImagePath = '';

    public constructor(public iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
      this.iconRegistry.addSvgIcon('facebook',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/images/svg/facebook.svg'));
      this.iconRegistry.addSvgIcon('twitter',this.sanitizer.bypassSecurityTrustResourceUrl('/assets/images/svg/twitter.svg'));
      this.iconRegistry.addSvgIcon('github', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/images/svg/github.svg'));
    }

    public ngOnInit(): void {
        if ( this.sites == undefined ) this.sites = new Array();
        if ( this.information == undefined ) this.information = new Array();
    }
}
