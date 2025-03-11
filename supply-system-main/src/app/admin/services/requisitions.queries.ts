import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IRequisitionResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RequisitionQueries {
  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<IRequisitionResponse> {
    return this.http.get<IRequisitionResponse>(`${environment.apiUrl}/requisitions`);
  }
}
