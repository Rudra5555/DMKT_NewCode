// import {Component, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import {DataTablesModule} from 'angular-datatables';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginComponentService } from 'src/app/services/login-component.service';
import Swal from 'sweetalert2';

declare let $: any;

@Component({
  selector: 'app-user-document-upload',
  templateUrl: './user-document-upload.component.html',
  styleUrls: ['./user-document-upload.component.scss']
})
export class UserDocumentUpload implements OnInit{
  name = 'Angular';
  remarks: string = '';
  public routes = routes;
  files: any[] = [];
  public uploadFileForm!: FormGroup;
  public remarksData :any;
  uploadDocumentFlag: boolean=false;
  public remarkFlag : boolean = false;
  public uploadDocumentSizeFlag: boolean = false;

  loggedUserId:any;

  constructor(
    private formBuilder: FormBuilder, private loginService : LoginComponentService
  ) {

    this.uploadFileForm = this.formBuilder.group({
      remarks: ['', Validators.required]
      });

  }
  ngOnInit(): void {

    this.loggedUserId = localStorage.getItem('loggedInUserId');


    this.uploadFileForm.get('remarks')?.valueChanges.subscribe(value => {
      this.remarksData = value;
      if (!this.remarksData || this.remarksData.trim() === '') {
        this.remarkFlag = true;  // Set flag if empty
      } else {
        this.remarkFlag = false; // Turn off flag if not empty
      }
    });
  }


 

  onFileDropped($event: any) {
   
    
    this.prepareFilesList($event);
    

  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files.target.files);
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      return;
    }
    this.files.splice(index, 1);

    this.calculateTotalFileSize(this.files);
    this.uploadFileForm.get('uploadFile')?.setValue(this.files);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) return;
      const progressInterval = setInterval(() => {
        if (this.files[index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.files[index].progress += 5;
        }
      }, 50);
    }, 50);

  }

  prepareFilesList(files: Array<any>) {
    console.log(files);
    
    if (files != null) {
      this.uploadDocumentFlag = false;
    }
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);

      this.calculateTotalFileSize(this.files);
    }
    this.uploadFilesSimulator(0);
  //  this.uploadFileForm.get('uploadFile')?.setValue(this.files);

  }

  clearFileInput() {

    this.files = [];
  }

  calculateTotalFileSize(files: Array<any>) {
    const fiftyMB = 2 * 1024 * 1024;
    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize <= fiftyMB) {
      this.uploadDocumentFlag = false;
    } else {
      this.uploadDocumentFlag = true;
    }


  }




  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


 
buttonDisable(){
  
}

onSubmit(): void {
  console.log("Logged in user ID", this.loggedUserId);

  this.uploadDocumentFlag = false;
  this.remarkFlag = false;

  if (this.files.length === 0) {
      console.log("No file selected");
      this.uploadDocumentFlag = true;
  }

  this.remarksData = this.uploadFileForm.get('remarks')?.value;
  if (!this.remarksData || this.remarksData.trim() === '') {
      console.log("Remarks are empty");
      this.remarkFlag = true;
  }

  if (this.uploadDocumentFlag || this.remarkFlag) {
      return;
  }

  const formData = new FormData();

  for (const file of this.files) {
      formData.append("fileName", file);
  }

  
  const remarks = this.uploadFileForm.get('remarks')?.value;
  const requesterId = this.loggedUserId;

  formData.append("remarks", remarks);
  formData.append("requesterId", requesterId.toString());

  if (this.uploadFileForm.valid) {
      this.uploadFileForm.markAllAsTouched();

      console.log("Form Data ready for submission:", formData);

      this.loginService.upload(formData).subscribe({
          next: (event: any) => {
              if (event instanceof HttpResponse) {
                  console.log("Upload successful");

                  this.uploadFileForm.reset();
                  this.clearFileInput();
                  this.successfulSubmitAlert();
              }
          },
          error: (err: any) => {
              console.log("Upload failed", err);

              this.uploadFileForm.reset();
              this.clearFileInput();
              this.unsuccessfulSubmitAlert();
          }
      });
  }
}





successfulSubmitAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your document was uploaded successfully",
    showConfirmButton: false,
    timer: 1500
  }).then(() => {

    // window.location.reload();

  });
}

unsuccessfulSubmitAlert() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
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
}
