import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY_REQUEST } from 'src/app/core/helpers';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { ICoordinate, MapsService } from 'src/app/core/services';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { NameHelper, vehicleInfoHelper } from '../../helpers';
import { UpdateRequestComponent } from '../../components';
import { IRequest } from '../../interfaces';
import { RequestQueries } from '../../services';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, MatFormFieldModule,
    FormsModule, ReactiveFormsModule, CommonModule,
    MatInputModule, PrimaryButtonComponent
  ],
  providers: [vehicleInfoHelper, NameHelper],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss'
})
export class RequestComponent implements OnInit {
  public request: IRequest = EMPTY_REQUEST;
  public loading = true;
  public map!: google.maps.Map;
  public initialMarker!: google.maps.marker.AdvancedMarkerElement;
  public finalMarker!: google.maps.marker.AdvancedMarkerElement;
  public directionRenderer!: google.maps.DirectionsRenderer;
  public requestForm!: FormGroup;
  public requestId = 0;
  @ViewChild('map', { static: true }) public mapRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapsService,
    private formBuilder: FormBuilder,
    private requestQuery: RequestQueries,
    private vehicleInfoHelper: vehicleInfoHelper,
    private nameHelper: NameHelper,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.params.id;
    this.requestForm = this.formBuilder.group({
      city: [''],
      type: [''],
      employee: [''],
      passengers: [''],
      motive: [''],
      destination: [''],
      date: [''],
      departureTime: [''],
      returnTime: [''],
      status: [''],
      vehicle: [''],
      memo: [''],
      driver: ['']
    });

    this.getRequest();
  }

  public openUpdateRequestModal(): void {
    this.dialog.open(UpdateRequestComponent, {
      panelClass: 'dialog-style',
      data: this.request
    }).afterClosed().subscribe((result) => {
      this.loading = true;
      result ? this.getRequest() : this.loading = false;
    });
  }

  public goToLink(){
    window.open(this.request.Documento_URL, "_blank");
  }

  private getRequest(): void {
    this.requestQuery.getRequest(this.requestId).subscribe(({ data }) => {
      this.request = data;
      const cityCoords = JSON.parse(this.request.Ciudad.Coordenadas);
      this.initializeMap(cityCoords);
      this.fillForm();
      this.loading = false;
    });
  }

  private initializeMap(cityCoords: ICoordinate): void {
    this.map = this.mapService.generateDefaultMap(this.mapRef);
    this.initialMarker = this.mapService.addMarker(this.map);
    this.finalMarker = this.mapService.addMarker(this.map, cityCoords);

    const status = this.request.Estado_Solicitud.Estado;
    const coords = (this.initialMarker.position as ICoordinate);
    this.directionRenderer = this.mapService.renderRoute(coords, cityCoords, this.map, status);
  }

  private fillForm(): void {
    const passengerFullNames = this.request.Nombres_Pasajeros?.split(',') || [];
    const passengerShortNames = passengerFullNames.map((name) => this.nameHelper.getShortName(name));
    this.requestForm.patchValue({
      vehicle: this.request.Vehiculo ? this.vehicleInfoHelper.getModel(this.request.Vehiculo) : 'No Asignado',
      driver: this.request.Conductor?.Nombre || 'No Asignado',
      city: this.request.Ciudad.Nombre,
      type: this.request.Tipo_Solicitud.Tipo_Solicitud,
      employee: this.nameHelper.getShortName(this.request.Nombre_Empleado),
      passengers: passengerShortNames,
      motive: this.request.Motivo,
      destination: this.request.Destino,
      memo: this.request.Numero_Memorando,
      date: moment.utc(this.request.Fecha).format('DD/MM/YYYY'),
      departureTime: moment.utc(this.request.Hora_Salida).format('HH:mm A'),
      returnTime: moment.utc(this.request.Hora_Regreso).format('HH:mm A'),
      status: this.request.Estado_Solicitud.Estado
    });
  }
}
