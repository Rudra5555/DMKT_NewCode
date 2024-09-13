// import {Component, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import {DataTablesModule} from 'angular-datatables';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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



  constructor(
    
    private formBuilder: FormBuilder

  ) {

    this.uploadFileForm = this.formBuilder.group({
      
      remarks: ['', Validators.required]
      });

  }
  ngOnInit(): void {
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



onSubmit() {
  // Reset flags before checks
  this.uploadDocumentFlag = false;
  this.remarkFlag = false;

  // Check if there are no files and set the flag
  if (this.files.length == 0) {
    console.log("File Length is 0");
    this.uploadDocumentFlag = true;
  }

  // Check if remarks are empty or null and set the flag
  this.remarksData = this.uploadFileForm.get('remarks')?.value; // Ensure remarksData is captured here
  if (!this.remarksData || this.remarksData.trim() === '') {
    console.log("remarksData is empty");
    this.remarkFlag = true;
    console.log("remarkFalg = true");
  }else{
    console.log("remarkFalg = false");
  }


  // If any field is invalid, stop the function execution
  if (this.uploadDocumentFlag || this.remarkFlag) {
    return; // Prevent form submission if flags are set
  }

  // Create formData for files
  const formData = new FormData();
  for (const file of this.files) {
    formData.append("file", file);
  }

  // Proceed if the form is valid
  if (this.uploadFileForm.valid) {
    this.uploadFileForm.markAllAsTouched();
    console.log('Remarks:', this.remarksData);
    formData.append("remarks", this.remarksData);

    // Log the formData and submit
    console.log("Form Data ready for submission:", formData);
    // Add your submission logic here (e.g., API call)
  }
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
