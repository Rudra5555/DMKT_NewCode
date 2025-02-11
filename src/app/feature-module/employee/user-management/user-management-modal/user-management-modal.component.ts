import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,Input, SimpleChanges  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';
// import {  IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-user-management-modal',
  templateUrl: './user-management-modal.component.html',
  styleUrls: ['./user-management-modal.component.scss']
})
export class UserManagementModalComponent implements OnInit {
  @Input() client: any;
  
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  public addUserForm!: FormGroup ;
  public editUserForm!: FormGroup ;
  public dropdownList:any;
  public selectedItems :any;
  public uploadDocumentSizeFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  public departmentList: any[] = [];
  files: any[] = [];
  base64Image: string | null = null;
  public dropdownSettings !:IDropdownSettings;
  msg: any;
  plantOption: any;
  newPlant: boolean = false;
  selectedDeptCatName: any;
  clientsData:any;
  roles: string[] = [];
  constructor( private formBuilder: FormBuilder, private loginService: LoginComponentService,private uploadDocument: UploadDocumentComponentService) { }

  
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
  
  this.addUserForm = this.formBuilder.group({
    userName: ["", [Validators.required]],
    userPhone: ["", [Validators.required]],
    userEmail: ["", [Validators.required, Validators.email]],
    department: ["", []],
    plant: ["", [Validators.required]],
    Admin: [false],
    User: [false],
    SuperUser: [false],
    HOD: [false],
    Librarian: [false],
    isActive: [false],
  });

  this.addUserForm.get('plant')?.valueChanges.subscribe(value => {
    if (value != null) {
      console.log("Plant selected: ", value);
      this.getAllPlantList(value, "plants");
      this.plantOption = value;
      if(this.plantOption == "CPP (1740MW)"){
        this.newPlant = true;
      }else{
        this.newPlant = false;
      }
    } else {
      console.log("No plant selected or value is null.");
    }
  });
  this.addUserForm.get('department')?.valueChanges.subscribe(value => {
    const [deptName, deptAbbr] = value.split('~');
    // this.getSubAreaList(deptName, "department");
    this.selectedDeptCatName = deptName;
    this.selectedDeptCatName = deptAbbr;
    console.log("Selected department: ", deptName);
    
  });
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client && this.addUserForm) {

      this.roles = this.client.accessRoles ? this.client.accessRoles.split(',') : [];
      console.log("Parsed roles:", this.roles);

      this.addUserForm.patchValue({
        userName: this.client.userName || '',
        userPhone: this.client.phoneNumber || '',
        userEmail: this.client.emailId || '',
        department: this.client.department || '',
        plant: this.client.plant || '',  
         Admin: this.roles.includes('Admin'),
        User: this.roles.includes('User'),
        SuperUser: this.roles.includes('SuperUser'),
        HOD: this.roles.includes('HOD'),
        Librarian: this.roles.includes('Librarian'),
        isActive: this.client.isActive || false,
      });
    }
  }

  
  
  // submitAddUserForm() {
  //   if (this.addUserForm.valid) {
  //     const payload = {
  //       userName: this.addUserForm.value.userName,
  //       phoneNumber: this.addUserForm.value.userPhone,
  //       emailId: this.addUserForm.value.userEmail,
  //       role: "User",
  //       password: "",
  //       departmentNameList: [
  //         {
  //           departmentName: this.addUserForm.value.department,
  //           plantName: this.addUserForm.value.plant
  //         }
  //       ],
  //       isActive: this.addUserForm.value.isActive,
  //       accessRoles: this.getSelectedRoles(),
  //       userPicture: this.files?.length ? this.files[0].base64 : null, 
  //     };
  
  //     console.log('Payload:', payload);
      
  //         this.loginService.addUser(payload).subscribe({
  //             next: (event: any) => {
  //               if (event instanceof HttpResponse) {
  //                 const resp = event.body

  //                 console.log("response =>>",resp);
  //                 this.successfulSubmitAlert();
                 
      
  //               }
  //             },
  //             error: (err: any) => {
  //               if (err.error && err.error.message) {
  //                 this.msg += " " + err.error.message;
  //               }
  //             }
  //           });

  //   } else {
  //     console.error('Form is invalid. Please fill all required fields.');
  //     this.addUserForm.markAllAsTouched();
  //   }
  // }
  
  getAllPlantList(selectedValue: string, plantHeader: string) {

    if (selectedValue != '' && plantHeader != null) {
console.log("selectedValue",selectedValue);
console.log("plantHeader",plantHeader);
      this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.departmentList = event.body?.categoryList || [];
            console.log("Updated departmentList: ", this.departmentList);
            
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  submitAddUserForm() {
  
    if (this.addUserForm.valid) {
      const payload = {
        userName: this.addUserForm.value.userName,
        phoneNumber: this.addUserForm.value.userPhone,
        emailId: this.addUserForm.value.userEmail,
        role: "User",
        password: "",
        departmentNameList: [
          {
            departmentName: this.selectedDeptCatName,
            plantName: this.addUserForm.value.plant
          }
        ],
        isActive: this.addUserForm.value.isActive,
        accessRoles: this.getSelectedRoles(),
        userPicture: this.files?.length ? this.files[0].base64 : null, 
      };
  
      console.log('Payload:', payload);
      
          this.loginService.addUser(payload).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const resp = event.body

                  console.log("response =>>",resp);
                  this.successfulSubmitAlert();
                 
      
                }
              },
              error: (err: any) => {
                if (err.error && err.error.message) {
                  this.msg += " " + err.error.message;
                }
              }
            });

    } else {
      console.error('Form is invalid. Please fill all required fields.');
      this.addUserForm.markAllAsTouched();
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
      window.location.href = window.location.href;
    });
  }

  getSelectedRoles(): string {
    const selectedRoles = [];
    if (this.addUserForm.value.Admin) selectedRoles.push("Admin");
    if (this.addUserForm.value.User) selectedRoles.push("User");
    if (this.addUserForm.value.SuperUser) selectedRoles.push("SuperUser");
    if (this.addUserForm.value.HOD) selectedRoles.push("HOD");
    if (this.addUserForm.value.Librarian) selectedRoles.push("Librarian");
  
    return selectedRoles.join(",");
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


addUser(){
  const formValues = this.addUserForm.value;

  // Create the payload
  const payload = {
    userName: formValues.userName,
    userPhone: formValues.userPhone,
    userEmail: formValues.userEmail,
    department: formValues.department,
    plant: formValues.plant,
    roles: Object.keys(formValues)
    .filter(
      (key) =>
        ['Admin', 'User', 'SuperUser', 'HOD', 'Librarian'].includes(key) &&
        formValues[key]
    )
    .join(','),
    isActive: formValues.IsActive, 
  };

  // Print the payload
  console.log('Payload:', payload);
  

}



}
