import {Component, AfterViewInit, Input} from '@angular/core';
import {map, marker, tileLayer, control, latLng, layerGroup, Layer} from 'leaflet';
import {ActivatedRoute} from '@angular/router';
import {Organization} from 'toco-lib';

@Component({
  selector: 'orgs-map',
  templateUrl: './orgs-map.component.html',
  styleUrls: ['./orgs-map.component.scss'],
})

export class OrgsMapComponent implements AfterViewInit {
@Input() cubanOrganizations: Organization[] = [];
  private map;
  public streetMap: any;
  public cycleMap: any;
  public states: any;
  public baseMaps: any;
  public overlayMaps: any;
  public loading = true;
  public data: any = '';
  public organizationsMarkers: Layer[] = [];

  constructor( private _activatedRoute: ActivatedRoute) { }

  ngAfterViewInit() {
    this.initMap();
    console.log('this.cubanOrganizations===', this.cubanOrganizations)

  }

  private initMap(): void {
  this.streetMap = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {id: 'mapbox/streets-v11',
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

  this.cycleMap = tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      {
        id: 'mapbox/streets-v11',
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      });

      const pinarRio = marker([22.41667, -83.69667]).bindPopup('Pinar del Río');
      const artemisa = marker([22.81667, -82.75944]).bindPopup('Artemisa');
      const havana = marker([23.113592, -82.366592]).bindPopup('La Habana');
      const mayabeque = marker([22.966666666667, -82.15]).bindPopup('Mayabeque');
      const matanzas = marker([23.0511, -81.5753]).bindPopup('Matanzas');
      const cienfuegos = marker([22.14957, -80.44662]).bindPopup('Cienfuegos');
      const santaClara = marker([22.40694, -79.96472]).bindPopup('Villa Clara');
      const sanctiSpiritu = marker([21.92972, -79.4425]).bindPopup('Sancti Spiritus');
      const ciegoDeAvila = marker([21.8481, -78.7631]).bindPopup('Ciego de Ávila');
      const camaguey = marker([21.3839, -77.9072 ]).bindPopup('Camagüey');
      const lasTunas = marker([20.96167, -76.95111]).bindPopup('Las Tunas');
      const holguin = marker([20.88722, -76.26306]).bindPopup('Holguín');
      const granma = marker([20.38449, -76.64127]).bindPopup('Granma');
      const santiagoCuba = marker([20.02083, -75.82667]).bindPopup('Santiago de Cuba');
      const guantanamo = marker([20.14444, -75.20917]).bindPopup('Guantánamo');
      const islaDeLaJuventud = marker([21.75, -82.85]).bindPopup('Municipio Especial Isla de la Juventud');

  this.states = layerGroup([
    havana,
    santiagoCuba,
    santaClara,
    lasTunas, cienfuegos,
    holguin,
    matanzas,
    guantanamo,
    pinarRio,
    artemisa,
    sanctiSpiritu,
    camaguey,
    granma,
    ciegoDeAvila,
    mayabeque,
    islaDeLaJuventud
  ]);

  this.baseMaps = {
    'Cycles Map': this.cycleMap,
    'Streets Map': this.streetMap
  };

  this.overlayMaps = {
      cities: this.states
    };

  this.map = map('map', {
      center: [21.59582, -79.430166],
      zoom: 6,
      layers: [this.cycleMap, this.streetMap, this.states]
    });

  control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);

  this.map.on('zoomend', () => {
    const zoom = this.map.getZoom();
    if ( zoom > 6 ) {
      this.cubanOrganizations.forEach( org => {
        org.addresses.forEach( address => {
          this.organizationsMarkers.push(marker([address.lat, address.lng]).bindPopup('I am a blue leaf.'));
        });
      });
      console.log('this.organizationsMarkers===', this.organizationsMarkers)
      this.map.removeLayer(this.states);
      this.map.addLayer(layerGroup( this.organizationsMarkers));
    }
    if ( zoom <= 6 ) {
      this.map.removeLayer(layerGroup( this.organizationsMarkers));
      this.map.addLayer(this.states);
    }
  });
  }

onMapClick() {
    // this.map.on('click', e => alert('You clicked the map at ' + e.latlng));
  }

}
