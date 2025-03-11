import { ElementRef, Injectable } from '@angular/core';
import { MarkerUrl, RequestStatus } from '../enums';

const DEFAULT_COORDS = { lat: 14.089656466933825, lng: -87.1869442583274 };
export interface ICoordinate {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  public defaultCoords: ICoordinate = DEFAULT_COORDS;
  public directionsService: google.maps.DirectionsService;
  public directionsRenderer!: google.maps.DirectionsRenderer;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
  }

  public addMarker(map: google.maps.Map, position = DEFAULT_COORDS, markerUrl = MarkerUrl.marker): google.maps.marker.AdvancedMarkerElement {
    const content = document.createElement('img');
    content.src = markerUrl;
    content.className = 'marker';
    const marker = new google.maps.marker.AdvancedMarkerElement({ position, content, map });
    return marker;
  }

  public generateDefaultMap(mapRef: ElementRef) {
    const mapOptions: google.maps.MapOptions = {
      mapId: 'f8e6a2472dfc90b0',
      center: this.defaultCoords,
      disableDefaultUI: true,
      zoom: 17
    };
    return new google.maps.Map(mapRef.nativeElement, mapOptions);
  }

  public renderRoute(start: ICoordinate, end: ICoordinate, map: google.maps.Map, status: string = RequestStatus.active ): google.maps.DirectionsRenderer {
    const strokeColor = this.determineColor(status);
    const directionOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: { strokeColor },
      suppressMarkers: true
    };
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode['DRIVING']
    };
    this.directionsRenderer = new google.maps.DirectionsRenderer(directionOptions);
    this.directionsRenderer.setMap(map);
    this.directionsService.route(request, (result, st) => {
      if (st == 'OK') {
        result && status === RequestStatus.active ? this.addCarMarker(result.routes[0], map) : '';

        return this.directionsRenderer.setDirections(result);
      }
    });

    return this.directionsRenderer;
  }

  public addCarMarker(route: google.maps.DirectionsRoute, map: google.maps.Map): void {
    const path = route.overview_path;
    const distance = google.maps.geometry.spherical.computeLength(path);
    let midpointDistance = distance / 2;
    let startPoint, endPoint;

    for (let i = 0; i < path.length - 1; i++) {
      const legDistance = google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
      if (midpointDistance < legDistance) {
        startPoint = path[i];
        endPoint = path[i + 1];
        break;
      }
      midpointDistance -= legDistance;
    }

    if(!startPoint || !endPoint) {
      return;
    }

    const heading = google.maps.geometry.spherical.computeHeading(startPoint, endPoint);
    const midpoint = google.maps.geometry.spherical.computeOffset(startPoint, midpointDistance, heading);
    const coords = { lat: midpoint.lat(), lng: midpoint.lng() };

    this.addMarker(map, coords, MarkerUrl.car);
  }

  private determineColor(status: string): string {
    let strokeColor;

    switch (status) {
      case RequestStatus.active:
      case RequestStatus.finalized:
        strokeColor = '#1B2A41';
        break;
      case RequestStatus.canceled:
        strokeColor = '#db473c';
        break;
      case RequestStatus.pendingByAdmin:
      case RequestStatus.pendingByManager:
        strokeColor = '#E7B549';
        break;
      default:
        strokeColor = '#1B2A41';
        break;
    }

    return strokeColor;
  }
}
