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

  this.states = layerGroup([havana]);

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
  }

onMapClick() {
    this.map.on('click', e => alert('You clicked the map at ' + e.latlng));
  }

}
