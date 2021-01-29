
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthAuthenticationService } from 'toco-lib';
import { DisambiguateComponent } from './disambiguate/disambiguate.component';
import { HomeComponent } from './home/home.component';
import { ImportComponent } from './import/import.component';
import { OrgEditComponent } from './org-edit/org-edit.component';
import { OrgViewerComponent } from './org-viewer/org-viewer.component';
import { UserService } from './org.service';
import { OrganizationDetailResolverService } from './organization-detail-resolver.service.ts';
import { AdminPermissionService, CuratorPermissionService } from './permission.service';
import { SearchComponent } from './search/search.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { WikiAuthorProfileComponent } from './wiki-organizations/profiles/wiki-author-profile/wiki-author-profile.component';
import { WikiAuthorsProfileComponent } from './wiki-organizations/profiles/wiki-authors-profile/wiki-authors-profile.component';
import { WikiOrgEmployesProfileComponent } from './wiki-organizations/profiles/wiki-org-employes-profile/wiki-org-employes-profile.component';
import { WikiTopicProfileComponent } from './wiki-organizations/profiles/wiki-topic-profile/wiki-topic-profile.component';
import { WikiTopicsProfileComponent } from './wiki-organizations/profiles/wiki-topics-profile/wiki-topics-profile.component';
import { WikiVenueProfileComponent } from './wiki-organizations/profiles/wiki-venue-profile/wiki-venue-profile.component';
import { WikiWorkProfileComponent } from './wiki-organizations/profiles/wiki-work-profile/wiki-work-profile.component';
import { WikiOrganizationsComponent } from './wiki-organizations/wiki-organizations.component';
// import { SimpleAuthenticationService, OrgAddComponent } from 'toco-lib';




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
		canActivate: [OauthAuthenticationService, CuratorPermissionService, AdminPermissionService]
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
		canActivate: [OauthAuthenticationService, CuratorPermissionService, AdminPermissionService]
	},
	{
		path: 'import',
		component: ImportComponent,
		canActivate: [OauthAuthenticationService, AdminPermissionService]
	},
	{
		path:'',
		component: HomeComponent,
	},
    {
        path: 'faq',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/faq.md', title: 'FAQ'}
	},
	{
        path: 'terms',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/terms.md', title: 'Términos de uso'}
	},
	{
        path: 'privacy',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/privacy.md', title: 'Políticas de privacidad'}
    },
    {
        path: 'about',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/about.md', title: 'Sobre Nosotros'}
    },
    {
        path: 'help',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/help.md', title: 'Ayuda'}
    },
    {
        path: 'contact',
        component: StaticPagesComponent,
        data: {src: '/assets/markdown/contact.md', title: 'Contacto'}
	},
	{
        path: 'inclussion',
        component: StaticPagesComponent,
        data: {src: 'assets/markdown/inclussion.md', title: '¿Nueva Organización?'}
	},
	/* 
	Perfiles
	*/	
	{
		path:'wiki-organizations',
		component: WikiOrganizationsComponent,
	},
	{
		path:'wiki-organizations/organization',
		component: WikiOrgEmployesProfileComponent,
	},
	{
		path:'wiki-organizations/author',
		component: WikiAuthorProfileComponent,
	},
	{
		path:'wiki-organizations/authors',
		component: WikiAuthorsProfileComponent,
	},
	{
		path:'wiki-organizations/work',
		component: WikiWorkProfileComponent,
	},
	{
		path:'wiki-organizations/venue',
		component: WikiVenueProfileComponent,
	},
	{
		path:'wiki-organizations/topic',
		component: WikiTopicProfileComponent,
	},
	{
		path:'wiki-organizations/topics',
		component: WikiTopicsProfileComponent,
	},
	/* 
	end of Perfiles
	*/
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
	providers: [UserService, CuratorPermissionService, AdminPermissionService]
})
export class OrgRoutingModule
{ }
