
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimpleAuthenticationService, OrgAddComponent } from 'toco-lib';

import { OrganizationDetailResolverService } from './organization-detail-resolver.service.ts';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';
import { OrgEditComponent } from './org-edit/org-edit.component';
import { DisambiguateComponent } from './disambiguate/disambiguate.component';
import { AdminPermissionService, CuratorPermissionService } from './permission.service';
import { ImportComponent } from './import/import.component';


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
		},
		canActivate: [SimpleAuthenticationService, AdminPermissionService]
    },
    // {
    //     path: 'add',
    //     component: OrgAddComponent
	// },
	{
		path: 'search',
		component: SearchComponent
	},
	{
		path: 'disambiguate',
		component: DisambiguateComponent,
		canActivate: [SimpleAuthenticationService, CuratorPermissionService]
	},
	{
		path: 'import',
		component: ImportComponent,
		canActivate: [SimpleAuthenticationService, AdminPermissionService]
	},
	{
		path:'',
		component: HomeComponent,
	},
    {
        path: 'faq',
        component: StaticPagesComponent,
        data: {src: 'static/organizations/assets/markdown/faq.md', title: 'FAQ'}
    },
    {
        path: 'about',
        component: StaticPagesComponent,
        data: {src: 'static/organizations/assets/markdown/about.md', title: 'Sobre Nosotros'}
    },
    {
        path: 'help',
        component: StaticPagesComponent,
        data: {src: 'static/organizations/assets/markdown/help.md', title: 'Ayuda'}
    },
    {
        path: 'contact',
        component: StaticPagesComponent,
        data: {src: 'static/organizations/assets/markdown/contact.md', title: 'Contacto'}
	},
	{
        path: 'inclussion',
        component: StaticPagesComponent,
        data: {src: 'static/organizations/assets/markdown/inclussion.md', title: '¿Nueva Organización?'}
    },
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
		//TODO: Hacer un componente 'PageNotFoundComponent' para mostrarlo aquí.
		//component: PageNotFoundComponent
	},


];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [SimpleAuthenticationService, CuratorPermissionService, AdminPermissionService]
})
export class OrgRoutingModule
{ }
