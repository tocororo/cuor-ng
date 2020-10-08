
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Organization, SearchResponse } from '@toco/tools/entities';
import { SearchService } from '@toco/tools/backend';

const orgExample: any = 
{
	'id': '876acbf2-5a67-4b5c-92ca-040761d54595',
	'identifiers': [
		{ idtype: 'reup', value: 'reup.1760' }
	],
	'name': 'EMPRESA LABORATORIO FARMACEUTICO ORIENTE',
	'status': 'active',
	'acronyms': [],
	'established': 1977,
	'labels': [
		{ iso639: 'es', label: 'EMPRESA LABORATORIO FARMACEUTICO ORIENTE' }
	],
	'relationships': [
		{ identifiers: [{ idtype: 'reup', value: 'reup.1760' }], label: 'Grupo de las Industrias Biotecnológica y Farmacéutica', type: 'parent' },
		{ identifiers: [{ idtype: 'reup', value: 'reup.1760' }], label: 'GRUPO DE LAS INDUSTRIAS BIOTECNOLOGICA Y FARMACEUTICA', type: 'parent' }
	],
	'addresses': [
		{
			city: 'Santiago de Cuba',
			country: 'Cuba',
			country_code: 'CU',
			primary: 'True',
			state: 'Santiago de Cuba',
			state_code: 'CU-13'
		}
	]
};


// {
// 	'id': '5554eb55-0f6f-4510-9bdb-10fdb332775e',
// 	'identifiers': [
// 		{ idtype: 'orgaid', value: 'orgaid.131' }
// 	],
// 	'name': 'Ministerio de la Agricultura',
// 	'acronyms': ['MINAG'],
// 	'labels': [
// 		{ label: 'Ministerio de la Agricultura', iso639: 'es' }
// 	],
// 	'relationships': [
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'MINISTERIO DE LA AGRICULTURA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE TALLERES AGROPECUARIOS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA EQUIPOS AVICOLAS 'CELSO STAKEMAN'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ASEGURAMIENTO Y SERVICIOS INTEGRALES A LA GANADERIA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PRODUCTORA DE PIENSOS OCCIDENTE', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO, BENEFICIO Y TORCIDO DE TABACO CAMAGUEY', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO, BENEFICIO Y TORCIDO DE TABACO CIENFUEGOS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE TABACO TORCIDO 'EL LAGUITO'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE TABACO TORCIDO 'JOSE MARTI' (H. UPMANN)", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE TABACO TORCIDO 'FRANCISCO PEREZ GERMAN' (PARTAGAS)", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE TABACO TORCIDO 'MIGUEL FERNANDEZ ROIG' (LA CORONA)", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE TABACO TORCIDO VILLA CLARA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE CIGARROS 'RAMIRO LAVANDERO' (VEGUEROS 4-A)", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA DE CIGARROS 'JUAN D' MATA REYES'(VEGUEROS 4- B)", type: 'child'},
// 	 	{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA FLORENCIA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO, BENEFICIO Y TORCIDO DE TABACO LAS TUNAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO, BENEFICIO Y TORCIDO DE TABACO HOLGUIN', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO, BENEFICIO Y TORCIDO DE TABACO GRANMA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ASEGURAMIENTO Y SERVICIOS DE MAYABEQUE', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL DE GRANOS NICETO PEREZ', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ASEGURAMIENTO Y SERVICIOS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA CIRCULADORA DE MATERIAS PRIMAS Y PREMEZCLAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PRODUCTORA DE PIENSOS CENTRO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA HABANA LIBRE', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROFORESTAL RAMON PONCIANO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE SUMINISTROS AGROPECUARIOS ARTEMISA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA AUGUSTO CESAR SANDINO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO Y BENEFICIO DE TABACO HERMANOS SAIZ', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA AGROINDUSTRIAL 'ENRIQUE TRONCOSO'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA HABANA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE ACOPIO Y BENEFICIO DE TABACO LAZARO PENA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA CITRICOS CEIBA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA ALQUIZAR', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA ARTEMISA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA BATABANO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA GUIRA DE MELENA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA MELENA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA 19 DE ABRIL', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA AGROINDUSTRIAL 'VICTORIA DE GIRON'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA DE FIBRAS NATURALES', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA AGROPECUARIA 'VLADIMIR I.LENIN'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA MAXIMO GOMEZ BAEZ', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA RESECADORA DE TABACO RUBIO 'LA SALUD'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA VALLE DEL YABU', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA SANTO DOMINGO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA CITRICOS ARIMAO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA HORQUITA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA BANAO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL DE GRANOS VALLE DE CAONAO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA Y CITRICOLA SOLA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA CAMAGUEY', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL CEBALLOS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA LA CUBA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA INTEGRAL AGROPECUARIA CIEGO DE AVILA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA AGROPECUARIA 'ARNALDO RAMIREZ'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA LAS TUNAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA HORTICOLA 'WILFREDO PENA CABRERA'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROFORESTAL PALMA SORIANO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROFORESTAL SAN LUIS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL AMERICA LIBRE', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA AGROINDUSTRIAL COMANDANTE 'JESUS MONTANE OROPESA'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA BAHIA HONDA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA GENETICA CAMILO CIENFUEGOS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA SAN CRISTOBAL', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA BACURANAO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA GENETICA 'LOS NARANJOS'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'EL CANGRE'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA GENETICA DEL ESTE', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA VALLE DEL PERU', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA NAZARENO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA INTEGRAL AGROPECUARIA MATANZAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA GENETICA MATANZAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA CORRALILLO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'LA VITRINA'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'MACUN'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL DE GRANOS AGUADA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA EL TABLON', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'LA SIERRITA'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA MANAGUACO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA SANCTI SPIRITUS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA VENEGAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA RECTANGULO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA ESMERALDA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA FLORIDA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA JIMAGUAYU', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA SIBANICU', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PECUARIA TRIANGULO III', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA NAJASA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA VERTIENTES', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA RUTA INVASORA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'CALIXTO GARCIA'-NORTE", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROINDUSTRIAL DE GRANOS GIBARA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA BAYAMO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA AGROPECUARIA ROBERTO ESTEVEZ RUZ', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA '14 DE JUNIO'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA INTEGRAL AGROPECUARIA SANTIAGO DE CUBA', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: "EMPRESA PECUARIA 'IVAN RODRIGUEZ'", type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PORCINA PINAR DEL RIO', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PORCINA MATANZAS', type: 'child' },
// 		{ identifiers: [{ idtype: 'orgaid', value: 'orgaid.131' }], label: 'EMPRESA PORCINA VILLA CLARA', type: 'child' }
// 	],
// 	'addresses': []
// };


// {
// 	'id': 'eb237d50-b64e-11ea-b3de-0242ac130004',  // Generado por Backend. Sólo se muestra.
// 	'identifiers': [
// 		{
// 			'idtype': 'isni',
// 			'value': 'An id isni'
// 		},
// 		{
// 			'idtype': 'grid',
// 			'value': 'An id grid'
// 		},
// 		{
// 			'idtype': 'wkdata',
// 			'value': 'An id wkdata'
// 		}
// 	],
// 	'name': 'Library in University',
// 	'status': 'active',
// 	'aliases': ['alias1', 'alias2', 'alias3', 'alias4', 'alias5'],
// 	'acronyms': ['acronyms 1', 'acronyms 2', 'acronyms 3'],
// 	'types': ['Government', 'Nonprofit', 'Facility', 'Healthcare'],       // Un 'Select' multiple
// 	'wikipedia_url': 'www.wiki.elitaute.com',
// 	'email_address': 'first@gmail.com',
// 	'ip_addresses': ['192.168.111.1', '192.168.26.4', '192.168.222.16'],
// 	'established': -1,
// 	'links': ['www.uclv.cu', 'www.ulh.cu', 'www.ucm.cu'],
// 	'labels': [
// 		{
// 			'label': 'Excepteur 1',
// 			'iso639': 'ipsum irure 1'
// 		},
// 		{
// 			'label': 'Excepteur 2',
// 			'iso639': 'ipsum irure 2'
// 		},
// 		// {
// 		// 	'label': 'Excepteur 3',
// 		// 	'iso639': 'ipsum irure 3'
// 		// }
// 	],
// 	'relationships': [
// 		{
// 			'identifiers': [
// 				{
// 					'idtype': 'isni',
// 					'value': 'An id isni'
// 				}
// 			],
// 			'type': 'parent',
// 			'label': 'Universidad de la Habana'
// 		},
// 		{
// 			'identifiers': [
// 				{
// 					'idtype': 'grid',
// 					'value': 'An id grid'
// 				},
// 				{
// 					'idtype': 'wkdata',
// 					'value': 'An id wkdata'
// 				}
// 			],
// 			'type': 'child',
// 			'label': 'Universidad de las Villas'
// 		}
// 	],
// 	'addresses': [
// 		{
// 			'city': 'La Habana',
// 			'country': 'Cuban',
// 			'country_code': 'ISO 3166-1 alpha-2 code',
// 			'lat': -22.79,
// 			'lng': -20.64,
// 			'line_1': 'ullamco, ippoi',
// 			'line_2': 'in aute eiusmod nulla',
// 			'line_3': 'in eiusmod',
// 			'postcode': '25000',
// 			'primary': true,
// 			'state': 'Vedado',
// 			'state_code': 'ISO 3166-2 RC-25',
// 			'geonames_city': {
// 				'id': 123,
// 				'city': 'La Habana City',
// 				'geonames_admin1': {
// 					'id': '11111',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'QQQQQ'
// 				},
// 				'geonames_admin2': {
// 					'id': '22222',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'WWWWW'
// 				},
// 				'nuts_level1': {
// 					'id': '33333',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'EEEEE'
// 				},
// 				'nuts_level2': {
// 					'id': '44444',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'RRRRR'
// 				},
// 				'nuts_level3': {
// 					'id': '55555',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'TTTTT'
// 				}
// 			}
// 		},
// 		{
// 			'city': 'Villa Clara',
// 			'country': 'Cuban',
// 			'country_code': 'ISO 3166-1 alpha-2 code',
// 			'lat': -53.87,
// 			'lng': -63.96,
// 			'line_1': 'mollit dolore, proident reprehenderit ad',
// 			'postcode': '73000',
// 			'primary': false,
// 			'state': 'Vedado',
// 			'state_code': 'ISO 3166-2 RC-73',
// 			'geonames_city': {
// 				'id': 123,
// 				'city': 'La Habana City',
// 				'geonames_admin1': {
// 					'id': '11111',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'QQQQQ'
// 				},
// 				'nuts_level1': {
// 					'id': '33333',
// 					'name': 'Región La Habana',
// 					'ascii_name': 'EEEEE'
// 				}
// 			}
// 		}
// 	]
// };

@Injectable({
	providedIn: 'root',
})
export class OrganizationDetailResolverService implements Resolve<SearchResponse<Organization>>
{
	public constructor(private router: Router, private service: SearchService)
	{ }

	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SearchResponse<Organization>>
	{
		let uuid = route.paramMap.get('uuid');
		return this.service.getOrganizationById(uuid).pipe(
            take(1),
            map(node => {
                if (node) {
                    return node;
				}
				else {
                    this.router.navigate(['/']);
                }
            })
        );
		// return of(orgExample);
	}
}
