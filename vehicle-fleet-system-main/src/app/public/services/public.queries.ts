import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { ICitiesResponse, IRequestTypeResponse, IUsersResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PublicQueries {
  constructor(private http: HttpClient) {}

  public getAllUsers(): Observable<IUsersResponse> {
    return this.http.get<IUsersResponse>(`${environment.apiUrl}/users`);
  }

  public getCities(): Observable<ICitiesResponse> {
    return this.http.get<ICitiesResponse>(`${environment.apiUrl}/cities`);
  }

  public getRequestTypes(): Observable<IRequestTypeResponse> {
    return this.http.get<IRequestTypeResponse>(`${environment.apiUrl}/request-types`);
  }

  public getUserId(username: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/get-id/${username}`);
  }
}
