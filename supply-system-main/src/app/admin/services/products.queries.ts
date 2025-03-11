import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IGroupsResponse, IProductsResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductQueries {
  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(`${environment.apiUrl}/products`);
  }

  public getGroups(): Observable<IGroupsResponse> {
    return this.http.get<IGroupsResponse>(`${environment.apiUrl}/groups`);
  }
}
