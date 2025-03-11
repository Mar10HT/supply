import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { IEntryInvoice, IHistory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EntryQueries {
  constructor(private http: HttpClient) {}

  public getInvoices(): Observable<IEntryInvoice[]> {
    return this.http.get<IEntryInvoice[]>(`${environment.apiUrl}/invoice-list`);
  }
}
