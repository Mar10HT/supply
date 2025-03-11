import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface IReport {
  data: {
    info: any[];
    total: number;
  }
}
@Injectable({
  providedIn: 'root'
})
export class ReportQueries {
  constructor(private http: HttpClient) {}

  public getReport(type: string, start: string, end: string): Observable<IReport> {
    return this.http.get<IReport>(`${environment.apiUrl}/report/${type}/${start}/${end}`);
  }
}
