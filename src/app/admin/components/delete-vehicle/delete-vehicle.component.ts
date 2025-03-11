import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent } from 'src/app/shared';
import { VehicleMutations } from '../../services';

@Component({
  selector: 'app-delete-vehicle',
  standalone: true,
  imports: [PrimaryButtonComponent],
  providers: [VehicleMutations],
  templateUrl: './delete-vehicle.component.html',
  styleUrl: './delete-vehicle.component.scss'
})
export class DeleteVehicleComponent {
  constructor(
    private vehicleMutation: VehicleMutations,
    private dialogRef: MatDialogRef<DeleteVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, plate: string, model: string }
  ){}

  public onCancel(): void {
    this.dialogRef.close(true);
  }

  public async deleteVehicle(): Promise<void> {
    const mutationResponse = await this.vehicleMutation.deleteVehicle(+this.data.id);

    if (mutationResponse) {
      this.onCancel();
    }
  }
}
