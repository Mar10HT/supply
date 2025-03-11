import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductsResponse } from 'src/app/admin/interfaces';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PublicQueries {
  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(`${environment.apiUrl}/products`);
  }
}
