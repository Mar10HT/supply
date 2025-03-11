import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileDropComponent, LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { environment } from 'src/environments/environments';
import { Upload } from 'src/app/core/enums';
import { RequisitionMutations, UploaderService } from '../../services';
import { FileNameHelper } from '../../helpers';

@Component({
  selector: 'app-upload-requisition',
  standalone: true,
  imports: [
    LoadingComponent, PrimaryButtonComponent, CommonModule,
    FileDropComponent
  ],
  providers: [UploaderService, FileNameHelper],
  templateUrl: './upload-requisition.component.html',
  styleUrl: './upload-requisition.component.scss'
})
export class UploadRequisitionComponent {
  public loading = false;
  public selectedFile!: File;
  public error = false;
  public fileUrl = environment.filesUrl;

  constructor(
    private dialogRef: MatDialogRef<UploadRequisitionComponent>,
    private uploaderService: UploaderService,
    private fileNameHelper: FileNameHelper,
    private requisitionMutation: RequisitionMutations,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) {}

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async onSubmit(): Promise<void> {
    this.loading = true;
    const fileName = this.fileNameHelper.getFileName(Upload.requisition, this.selectedFile);
    const realName = this.fileNameHelper.getRealFileName(fileName);
    const invoiceUrl = this.fileUrl + 'requisitions/' + realName;
    const fileUploaded = await this.uploaderService.uploadFile(this.selectedFile, fileName);

    if (fileUploaded) {
      const mutationResponse = await this.requisitionMutation.updateDocument(this.id, invoiceUrl);
      mutationResponse ? this.dialogRef.close(mutationResponse) : this.loading = false;
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  public getFiles(files: File[]): void {
    this.selectedFile = files[0];
  }
}
