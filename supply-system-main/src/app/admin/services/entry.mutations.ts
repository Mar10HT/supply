import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { IBatchWithIds, IProductEntryWithIds } from '../components/confirm-input/confirm-input.component';
import { ICreateEntry } from '../containers';

@Injectable({
  providedIn: 'root'
})
export class EntryMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public createEntries(entry: ICreateEntry, products: IProductEntryWithIds[], batches: IBatchWithIds[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-entries`, { entry, products, batches }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Entradas creadas correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error durante la creación', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error.message, 'Error!');
          reject(error);
        }
      );
    });
  }
}
