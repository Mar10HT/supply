import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { cookieHelper } from 'src/app/core/helpers';
import { IAvaliableForRequestResponse, IRequestResponse, IRequestsResponse, IRequestStatusResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RequestQueries {
  public username = this.cookieHelper.getUsername();
  constructor(private http: HttpClient, private cookieHelper: cookieHelper) {}

  public getAllRequests(): Observable<IRequestsResponse> {
    return this.http.get<IRequestsResponse>(`${environment.apiUrl}/requests/${this.username}`);
  }

  public getVehicleRequests(vehicleId: number): Observable<IRequestsResponse> {
    return this.http.get<IRequestsResponse>(`${environment.apiUrl}/requests/${vehicleId}/${this.username}`);
  }

  public getRequest(id: number): Observable<IRequestResponse> {
    return this.http.get<IRequestResponse>(`${environment.apiUrl}/request/${id}`);
  }

  public availableForRequest(id: number): Observable<IAvaliableForRequestResponse> {
    return this.http.get<IAvaliableForRequestResponse>(`${environment.apiUrl}/available-request/${id}`);
  }

  public getRequestStatuses(): Observable<IRequestStatusResponse> {
    return this.http.get<IRequestStatusResponse>(`${environment.apiUrl}/request-status`);
  }
}
