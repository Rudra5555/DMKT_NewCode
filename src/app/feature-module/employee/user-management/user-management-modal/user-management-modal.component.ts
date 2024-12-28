import { Component, ElementRef, OnInit, ViewChild,Input  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import {  IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-user-management-modal',
  templateUrl: './user-management-modal.component.html',
  styleUrls: ['./user-management-modal.component.scss']
})
export class UserManagementModalComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  public addUserForm!: FormGroup ;
  public editUserForm!: FormGroup ;
  public dropdownList:any;
  public selectedItems :any;
  public uploadDocumentSizeFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  // public  dropdownSettings :any;
  files: any[] = [];
  base64Image: string | null = null;
  public dropdownSettings !:IDropdownSettings;
  constructor( private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings  = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  


    
    //Add clients form
    this.addUserForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      userPhone: ["", [Validators.required]],
      userEmail: ["", [Validators.required]],
      password: ["barrycuda", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["barrycuda", [Validators.required]],
      department:["", [Validators.required]],
    },
    
  );

    //Edit UserManagement Form
    this.editUserForm = this.formBuilder.group({
      editClientName: ["", [Validators.required]],
      editClientPhone: ["", [Validators.required]],
      editClientEmail: ["", [Validators.required]],
      editClientCompany: ["", [Validators.required]],
      editClientRole: ["", [Validators.required]],
      editClientId: ["", [Validators.required]],
      editId: ["", [Validators.required]],
    });
  }

  submitAddUserForm() {
    if (this.addUserForm.valid) {
      const payload = {
        userName: this.addUserForm.value.userName,
        phoneNumber: this.addUserForm.value.userPhone,
        emailId: this.addUserForm.value.userEmail,
        password: this.addUserForm.value.password,
        department: this.addUserForm.value.department,
        isActive: true,
        files: this.files.map(file => file.base64),
      };
  
      console.log('Payload:::::::', payload);
     
    } else {
      console.error('Form is invalid');
    }
  }


  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
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
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


  prepareFilesList(files: Array<any>) {
    if (files != null) {
      this.uploadDocumentFlag = false;
    }
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.convertToBase64(item);
      this.calculateTotalFileSize(this.files);
    }
    this.uploadFilesSimulator(0);
   // this.uploadFileForm.get('uploadFile')?.setValue(this.files);

  }

  convertToBase64(file: any): void {
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64String = reader.result as string;
  
      // Print the Base64 string to the console
      console.log('Base64 String:', base64String);
  
      // You can store the base64String in the file object or use it as needed
      file.base64 = base64String;  // Storing base64 in the file object (optional)
  
      // Optionally, handle the Base64 string further here (e.g., send it to an API)
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  
    reader.readAsDataURL(file);  // Convert the file to Base64 string
  }

  calculateTotalFileSize(files: Array<any>) {
    const fiftyMB = 2 * 1024 * 1024;
    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize <= fiftyMB) {
      this.uploadDocumentSizeFlag = false;
    } else {
      this.uploadDocumentSizeFlag = true;
    }


  }
  onFileDropped($event: any) {
    this.prepareFilesList($event);

}
fileBrowseHandler(files: any) {
  // console.log("upload agaiannn");
  this.prepareFilesList(files.target.files);
}



deleteFile(index: number) {
  if (this.files[index].progress < 100) {
    return;
  }
  this.files.splice(index, 1);

  this.calculateTotalFileSize(this.files);
  //this.uploadFileForm.get('uploadFile')?.setValue(this.files);
}

}
