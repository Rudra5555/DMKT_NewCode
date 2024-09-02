import { routes } from 'src/app/core/helpers/routes/routes';
import { Component } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileManagementService } from 'src/app/services/file-management.service';
declare let $: any;

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent {
  [x: string]: any;

  name = 'Angular';

  public routes = routes;
  public uploadFileForm!: FormGroup ;
  public multipleFiles: File[] = [];
  constructor(private uploadService: FileManagementService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    let table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      },
      this:this.uploadFileForm = this.formBuilder.group({
      
        uploadFile: ["", [Validators.required]],
        area: ["", [Validators.required]],
        deptName: ["", [Validators.required]],
        instName: ["", [Validators.required]],
        docType: ["", [Validators.required]],
      }),
    
    });
  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    //console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    //console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    //console.log('next clicked')
  }
  previousButtonClickEvent(): void {
    //do previous particular the records like  0 - 100 rows.
    //we are calling to API
  }
  onMultipleSelect(event: { addedFiles: File[] }) {
    this.multipleFiles.push(...event.addedFiles);
    this['selectedFiles'] = this.multipleFiles;
    //console.log("file capchurd :",this.multipleFiles)
  }
  onRemoveMultiple(event: File) {
    this.multipleFiles.splice(this.multipleFiles.indexOf(event), 1);
  }
  upload(file: File): void {
    //console.log(file);
    if (file) {
      this['uploadService'].upload(file).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const msg = file.name + ": Successful!";
            // this.message.push(msg);
          //  this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          let msg = file.name + ": Failed!";

          if (err.error && err.error.message) {
            msg += " " + err.error.message;
          }

          // this.message.push(msg);
         // this.fileInfos = this.uploadService.getFiles();
        }
      });
    }
  }
  

  uploadFiles(): void {
    this['message'] = [];

    if (this['selectedFiles']) {
      for (let i = 0; i < this['selectedFiles'].length; i++) {
        this.upload(this['selectedFiles'][i]);
      }
      this['selectedFiles'] = undefined;
    }
  }

  onSubmit(){
    console.warn('Your data has been submitted', this.uploadFileForm.value);



    let modalData = {
      'uploadFile': this['uploadFileForm'].controls['uploadFile'].value,
      'departmentName' : this['uploadFileForm'].controls['departmentName'].value,
      'isStatutoryDocument' : this['uploadFileForm'].controls['isStatutoryDocument'].value
    }

    console.warn('Your data has been submitted', modalData);

    if (modalData) {
      this['uploadService'].upload(modalData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const msg = modalData + ": Successful!";
            // this.message.push(msg);
          //  this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          let msg = modalData + ": Failed!";

          if (err.error && err.error.message) {
            msg += " " + err.error.message;
          }

          // this.message.push(msg);
         // this.fileInfos = this.uploadService.getFiles();
        }
      });
    }



    this['uploadFileForm'].reset();
}
}
