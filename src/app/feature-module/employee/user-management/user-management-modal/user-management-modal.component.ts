import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,Input, SimpleChanges  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';

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
  isHodChecked: boolean = false;
  plantList: any;
  constructor( private formBuilder: FormBuilder, private loginService: LoginComponentService,private uploadDocument: UploadDocumentComponentService) { }

  
  ngOnInit(): void {

    this.getMainHeadList();


  this.addUserForm = this.formBuilder.group({
    userName: ["", []],
    userPhone: ["", []],
    userEmail: ["", []],
    department: ["", []],
    mainRole: ["", []],
    plant: ["", []],
    Admin: [false],
    User: [false],
    SuperUser: [false],
    HOD: [false],
    Librarian: [false],
    isActive: [false],
  });

  this.editUserForm = this.formBuilder.group({
    userName: ["", []],
    userPhone: ["", []],
    userEmail: ["", []],
    department: ["", []],
    plant: ["", []],
    mainRole: ["", []],
    Admin: [false],
    User: [false],
    SuperUser: [false],
    HOD: [false],
    Librarian: [false],
    isActive: [false],
  });

  this.addUserForm.get('plant')?.valueChanges.subscribe(value => {
    if (value != null) {
      this.getAllPlantList(value, "plants");
      this.plantOption = value;
      if(this.plantOption == "CPP (1740MW)"){
        this.newPlant = true;
      }else{
        this.newPlant = false;
      }
    } else {
    }
  });
  this.addUserForm.get('department')?.valueChanges.subscribe(value => {
    const [deptName, deptAbbr] = value.split('~');
    this.selectedDeptCatName = deptName;
    
  });
  
  }
  getMainHeadList() {
    this.uploadDocument.allDataList("POWER O&M", "main-head").subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.uploadDocument.convertEncToDec(event.body);
          if (decryptedData) {
            const res = JSON.parse(decryptedData);
            this.plantList = (res?.categoryList || []).filter((item: { catId: number }) => item.catId !== 9);
          }
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  

  toggleButton() {
    this.isHodChecked = this.addUserForm.get('HOD')?.value; 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['client'] && this.client && this.editUserForm) {

      this.roles = this.client.accessRoles ? this.client.accessRoles.split(',') : [];

    const departmentNames = this.client.departmentNameList && Array.isArray(this.client.departmentNameList)
    ? this.client.departmentNameList.map((dept: { departmentName: any; }) => dept.departmentName || 'N/A').join(', ')
    : 'N/A';

  const plantNames = this.client.departmentNameList && Array.isArray(this.client.departmentNameList)
    ? this.client.departmentNameList.map((plant: { plantName: any; }) => plant.plantName || 'N/A').join(', ')
    : 'N/A';

      this.editUserForm.patchValue({
        userName: this.client.userName || '',
        userPhone: this.client.phoneNumber || '',
        userEmail: this.client.emailId || '',
        department: departmentNames ,
        plant: plantNames ,  
        mainRole: this.client.role || '',
         Admin: this.roles.includes('Admin'),
        User: this.roles.includes('User'),
        SuperUser: this.roles.includes('SuperUser'),
        HOD: this.roles.includes('HOD'),
        Librarian: this.roles.includes('Librarian'),
        isActive: this.client.isActive || false,
      });
    }
  }

  

  getAllPlantList(selectedValue: string, plantHeader: string) {
    if (selectedValue !== '' && plantHeader !== null) {
      this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const decryptedData = this.uploadDocument.convertEncToDec(event.body);
            if (decryptedData) {
              const res = JSON.parse(decryptedData);
              this.departmentList = res?.categoryList || [];
            }
          }
        },
        error: (err: any) => {
          console.error("Error fetching plant list:", err);
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
        role:  this.addUserForm.value.mainRole,
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
   
      
          this.loginService.addUser(payload).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const resp = event.body
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

  submitAddUserFormLibrarian() {
  
    if (this.addUserForm.valid) {
      
      
      const payload = {
        userName: this.addUserForm.value.userName,
        phoneNumber: this.addUserForm.value.userPhone,
        emailId: this.addUserForm.value.userEmail,
        role:  "User",
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
   
      
          this.loginService.addUser(payload).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const decryptedData = this.loginService.convertEncToDec(event.body);
                  const res = JSON.parse(decryptedData);

                  const resp = res

                  // console.log("response after submit",resp);
                  if(resp.status==200){
                    this.successfulSubmitAlert();
                  }
                 else{
                  
                 }
                 
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

  editAddUserForm() {
  
    if (this.editUserForm.valid) {
      const payload = {
        userName: this.editUserForm.value.userName,
        phoneNumber: this.editUserForm.value.userPhone,
        emailId: this.editUserForm.value.userEmail,
        role: "User",
        password: "",
        departmentNameList: [
         
        ],
        isActive: this.editUserForm.value.isActive,
        accessRoles: this.getSelectedRolesEdit(),
        userPicture: this.files?.length ? this.files[0].base64 : null, 
      };
      
          this.loginService.addUser(payload).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const resp = event.body
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

  editAddUserFormAdmin() {
  
    if (this.editUserForm.valid) {
      const payload = {
        userName: this.editUserForm.value.userName,
        phoneNumber: this.editUserForm.value.userPhone,
        emailId: this.editUserForm.value.userEmail,
        role:  this.editUserForm.value.mainRole,
        password: "",
        departmentNameList: [
          
        ],
        isActive: this.editUserForm.value.isActive,
        accessRoles: this.getSelectedRolesEdit(),
        userPicture: this.files?.length ? this.files[0].base64 : null, 
      };
      
          this.loginService.addUser(payload).subscribe({
              next: (event: any) => {
                if (event instanceof HttpResponse) {
                  const resp = event.body
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
      title: "*Employee details uploaded successfully.*",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
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

  getSelectedRolesEdit(): string {
    const selectedRoles = [];
    if (this.editUserForm.value.Admin) selectedRoles.push("Admin");
    if (this.editUserForm.value.User) selectedRoles.push("User");
    if (this.editUserForm.value.SuperUser) selectedRoles.push("SuperUser");
    if (this.editUserForm.value.HOD) selectedRoles.push("HOD");
    if (this.editUserForm.value.Librarian) selectedRoles.push("Librarian");
  
    return selectedRoles.join(",");
  }
  
  
  


  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
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
  }

  convertToBase64(file: any): void {
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64String = reader.result as string;
      file.base64 = base64String;
    };
  
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  
    reader.readAsDataURL(file);
  }

  calculateTotalFileSize(files: Array<any>) {
    const fiveKB = 5 * 1024;
    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize <= fiveKB) {
      this.uploadDocumentSizeFlag = false;
    } else {
      this.uploadDocumentSizeFlag = true;
    }


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
}
}
