import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IHistory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HistoryQueries {
  constructor(private http: HttpClient) {}

  public getHistory(): Observable<IHistory> {
    return this.http.get<IHistory>(`${environment.apiUrl}/history`);
  }
}
