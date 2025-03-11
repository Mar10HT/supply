import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { cookieHelper } from 'src/app/core/helpers';
import { IDashboardQuery } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardQueries {
  public username = this.cookieHelper.getUsername();
  constructor(private http: HttpClient, private cookieHelper: cookieHelper) {}

  public dashboardQuery(start: string, end: string): Observable<IDashboardQuery | number> {
    return this.http.get<IDashboardQuery | number>(`${environment.apiUrl}/dashboard/${this.username}/${start}/${end}`);
  }
}
