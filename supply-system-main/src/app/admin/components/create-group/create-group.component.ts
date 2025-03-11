import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PrimaryButtonComponent } from 'src/app/shared';
import { IGroup } from '../../interfaces';
import { GroupMutations } from '../../services';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule, MatInputModule,
    MatFormFieldModule, CommonModule
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  public groupName = '';
  public description = '';
  public error = false;
  public empty = false;

  constructor(
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private groupMutation: GroupMutations,
    @Inject(MAT_DIALOG_DATA) public data: IGroup[]
  ) {}

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async onSubmit(): Promise<void> {
    this.validateForm();

    if (this.error || this.empty) {
      return;
    }

    const formattedName = this.formatName(this.groupName);
    const data = {
      id: 0,
      name: formattedName,
      description: this.description
    };

    const mutationResponse = await this.groupMutation.createGroup(data);

    if (mutationResponse) {
      this.onCancel(true);
    }
  }

  private validateForm(): void {
    this.empty = this.groupName === '' || this.description === '';
    this.error = this.data.some(group => group.name === this.formatName(this.groupName));
  }

  private formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
