
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrgEditComponent, OrgAddComponent } from '@toco/tools/organizations';

import { OrganizationDetailResolverService } from './organization-detail-resolver.service.ts';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';


const routes: Routes = [
	{
		path:':uuid/view',
		component: OrgViewerComponent,
		resolve: {
			'org': OrganizationDetailResolverService
		}
	},
	{
		path:':uuid/edit',
		component: OrgEditComponent,
		resolve: {
			'org': OrganizationDetailResolverService
		}
    },
    {
        path: 'add',
        component: OrgAddComponent
	},
	{
		path: 'search',
		component: SearchComponent
	},
	{
		path:'',
		component: HomeComponent,
	},
    {
        path: 'faq',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/faq.md', title: 'FAQ'}
    },
    {
        path: 'about',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/about.md', title: 'Sobre Nosotros'}
    },
    {
        path: 'help',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/help.md', title: 'Ayuda'}
    },
    {
        path: 'contact',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/contact.md', title: 'Contacto'}
	},
	{
        path: 'inclussion',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/inclussion.md', title: '¿Nueva Organización?'}
    },
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
		//TODO: Hacer un componente 'PageNotFoundComponent' para mostrarlo aquí. 
		//component: PageNotFoundComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class OrgRoutingModule
{ }
