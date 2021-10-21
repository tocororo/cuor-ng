import { Component, AfterViewInit } from '@angular/core';
import {map, marker, tileLayer, control, latLng, layerGroup} from 'leaflet';

@Component({
  selector: 'orgs-map',
  templateUrl: './orgs-map.component.html',
  styleUrls: ['./orgs-map.component.scss'],
})

export class OrgsMapComponent implements AfterViewInit {

  private map;
  streetMap: any;
  cycleMap: any;

  states: any;

  baseMaps: any;

  overlayMaps: any;

constructor() { }

ngAfterViewInit() {
    this.initMap();
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

  const havana = marker([23.113592, -82.366592]).bindPopup('I am a blue leaf.');
  const santiagoCuba = marker([20.02083, -75.82667]).bindPopup('I am a blue leaf.');
  const santaClara = marker([22.40694, -79.96472]).bindPopup('I am a blue leaf.');
  const lasTunas = marker([20.96167, -76.95111]).bindPopup('I am a blue leaf.');
  const cienfuegos = marker([22.14957, -80.44662]).bindPopup('I am a blue leaf.');
  const holguin = marker([20.88722, -76.26306]).bindPopup('I am a blue leaf.');
  const matanzas = marker([23.04111, -81.5775]).bindPopup('I am a blue leaf.');
  const guantanamo = marker([20.14444, -75.20917]).bindPopup('I am a blue leaf.');
  const pinarRio = marker([22.41667, -83.69667]).bindPopup('I am a blue leaf.');
  const artemisa = marker([22.81667, -82.75944]).bindPopup('I am a blue leaf.');
  const sanctiSpiritu = marker([21.92972, -79.4425]).bindPopup('I am a blue leaf.');
  const camaguey = marker([21.3839, -77.9072 ]).bindPopup('I am a blue leaf.');
  const granma = marker([20.38449, -76.64127]).bindPopup('I am a blue leaf.');

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
    granma
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
      this.map.removeLayer(this.states);
      this.map.addLayer(layerGroup( [havana]));
    }
    if ( zoom <= 6 ) {
      this.map.removeLayer(layerGroup( [havana]));
      this.map.addLayer(this.states);
    }
  });
  }

onMapClick() {
    this.map.on('click', e => alert('You clicked the map at ' + e.latlng));
  }

}
