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
  public invalidFileExtensionFlag: boolean = false;
  public uploadDocumentSizeFlag: boolean = false;
  loggedUserId:any;
  public buttonDisabled: boolean = false;
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
    if (files != null) {
      this.uploadDocumentFlag = false;
    }
  const allowedExtensions = [".pdf", ".docx", ".xlsx", ".jpeg", ".dwg", ".jpg", ".txt", ".csv", ".xls", ".ppt", ".png"];


  for (const item of files) {
    this.invalidFileExtensionFlag = false; 
    const fileExtension = item.name.slice(item.name.lastIndexOf(".")).toLowerCase();
  
    if (allowedExtensions.includes(fileExtension)) {
      item.progress = 0;
      this.files.push(item);
      this.calculateTotalFileSize(this.files);
    } else {
      console.warn(`File type not allowed: ${item.name}`);
      this.invalidFileExtensionFlag = true;
    }
  }
  this.uploadFilesSimulator(0);
    this.uploadFileForm.get('uploadFile')?.setValue(this.files);

  }

  clearFileInput() {
    this.files = [];
  }

  calculateTotalFileSize(files: Array<any>) {
    const fileSizeMB = 200 * 1024 * 1024;
    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize <= fileSizeMB) {
      this.uploadDocumentSizeFlag = false;
    } else {
      this.uploadDocumentSizeFlag = true;
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

  this.uploadDocumentFlag = false;
  this.remarkFlag = false;

  if (this.files.length === 0) {
   
      this.uploadDocumentFlag = true;
  }

  this.remarksData = this.uploadFileForm.get('remarks')?.value;
  if (!this.remarksData || this.remarksData.trim() === '') {
 
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
      this.buttonDisabled = true;
      this.loginService.userUpload(formData).subscribe({
          next: (event: any) => {
              if (event instanceof HttpResponse) {
                this.buttonDisabled = false;
                  this.uploadFileForm.reset();
                  this.clearFileInput();
                  this.successfulSubmitAlert();
                  this.remarkFlag = false;
              }
          },
          error: (err: any) => {
              this.uploadFileForm.reset();
              this.clearFileInput();
              this.unsuccessfulSubmitAlert();
          }
      });
  }
  this.remarkFlag = false;
}

successfulSubmitAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your document was uploaded successfully",
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    window.location.reload();
    this.remarkFlag = false;

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

  }
}
