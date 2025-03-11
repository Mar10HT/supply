import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { RequestMutations } from '../../services';

@Component({
  selector: 'app-confirm-component',
  standalone: true,
  imports: [PrimaryButtonComponent, CommonModule, LoadingComponent],
  templateUrl: './confirm-component.component.html',
  styleUrl: './confirm-component.component.scss'
})
export class ConfirmComponentComponent implements OnInit {
  public title = '';
  public loading = false;
  public label = '';

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponentComponent>,
    private requestMutation: RequestMutations,
    @Inject(MAT_DIALOG_DATA) public data: { type: string, id: number }
  ){}

  ngOnInit(): void {

    this.getInfo();
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public onSubmit(): void {
    this.loading = true;
    switch (this.data.type) {
      case 'cancel-request':
        this.cancelRequest();
        break;
      case 'finish-request':
        this.finishRequest();
        break;
      default: this.onCancel();
        break;
    }
  }

  private async cancelRequest(): Promise<void> {
    const mutationResponse = await this.requestMutation.cancelRequest(this.data.id);

    if (mutationResponse) {
      this.onCancel(true);
    }
  }

  private async finishRequest(): Promise<void> {
    const mutationResponse = await this.requestMutation.finishRequest(this.data.id);

    if (mutationResponse) {
      this.onCancel(true);
    }
  }

  private getInfo(): void {
    switch (this.data.type) {
      case 'cancel-request':
        this.title = 'Cancelar solicitud';
        this.label = 'Cancelar';
        break;
      case 'finish-request':
        this.title = 'Finalizar solicitud';
        this.label = 'Finalizar';
        break;
      default:
        this.title = 'Cancelar solicitud';
        this.label = 'Cancelar';
        break;
    }
  }
}

