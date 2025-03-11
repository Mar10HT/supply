import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ISuppliersResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SuppliersQueries {
  constructor(private http: HttpClient) {}

  public getAllSuppliers(): Observable<ISuppliersResponse> {
    return this.http.get<ISuppliersResponse>(`${environment.apiUrl}/suppliers`);
  }
}
