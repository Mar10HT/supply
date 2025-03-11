import { Component, Inject } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriverMutations } from '../../services';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [PrimaryButtonComponent],
  providers: [DriverMutations],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.scss'
})
export class DeleteDriverComponent {
  constructor(
    private driverMutation: DriverMutations,
    private dialogRef: MatDialogRef<DeleteDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string }
  ){}

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async deleteDriver(): Promise<void> {
    const mutationResponse = await this.driverMutation.deleteDriver(this.data.id);

    if (mutationResponse) {
      this.onCancel();
    }
  }
}
