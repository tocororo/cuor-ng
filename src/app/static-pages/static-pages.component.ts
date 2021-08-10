/*
 *   Copyright (c) 2020 Universidad de Pinar del Río "Hermanos Saíz Montes de Oca"
 *   All rights reserved.
 */

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { MetadataService } from 'toco-lib';

@Component({
    selector: 'toco-static-pages',
    templateUrl: './static-pages.component.html',
    styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit
{
    @Input()
    public src: string;

    @Input()
    public title: string;

    public constructor(private metadata: MetadataService,
        private activatedRoute: ActivatedRoute,
        public transServ: TranslateService)
    { }

    public ngOnInit(): void
    {
        if (this.src == undefined) this.src = '';
        if (this.title == undefined) this.title = '';
        // this.metadata.setTitleDescription(this.title, '');

        this.activatedRoute.data.subscribe({
            next: (data: { src: string, title: string }) => {
                if (data)
                {
                    // console.log('data', data);

                    this.src = data.src + ((this.transServ.currentLang == 'es') ? 'es.md' : 'en.md');
                    this.title = data.title;
                    // this.metadata.setTitleDescription(this.title, '');

                    /* Changes the translation when the language changes. */
                    this.transServ.onLangChange.subscribe((params: LangChangeEvent) => {
                        this.src = data.src + ((params.lang == 'es') ? 'es.md' : 'en.md');
                    });
                    this.metadata.meta.updateTag({name:"DC.title", content:data['title']});
                    this.metadata.meta.updateTag({name:"DC.description", content:data['src'].substring(0,160)});
                    this.metadata.meta.updateTag({name:"generator", content:"Sceiba Organizaciones Cubanas en Proyecto Vlir Joint"});
                    this.metadata.meta.updateTag({name:"keywords", content:"Sceiba, organizaciones, identificación persistente, Cuba, " + data['title'] });
                    this.metadata.meta.updateTag({name:"robots", content:"index,follow"});
                }

            },
            error: (e: any) => { console.log(e); },
            complete: () => { }
        });
    }

}
