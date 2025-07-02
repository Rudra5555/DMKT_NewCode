import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,Input, SimpleChanges, AfterViewInit  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { el } from '@fullcalendar/core/internal-common';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management-modal',
  templateUrl: './user-management-modal.component.html',
  styleUrls: ['./user-management-modal.component.scss']
})
export class UserManagementModalComponent implements OnInit, AfterViewInit {
  @Input() client: any;
  
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  @ViewChild('librarianFileDropRef', { static: false }) librarianFileDropRef!: ElementRef; 

  @ViewChild('editAdminFileDrop', { static: false }) editAdminFileDrop!: ElementRef;
   @ViewChild('editLibrarianFileDrop', { static: false }) editLibrarianFileDrop!: ElementRef;

  public addUserForm!: FormGroup ;
  public editUserForm!: FormGroup ;
  public dropdownList:any;
  public selectedItems :any;
  public uploadDocumentSizeFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  public departmentList: any[] = [];
  files: any[] = [];
  public mainHeadList: any[] = [];
  base64Image: string | null = null;
  public dropdownSettings !:IDropdownSettings;
  msg: any;
  plantOption: any;
  newPlant: boolean = false;
  selectedDeptCatName: any;
  clientsData:any;
  private readonly accessRoles: string[] = ['Admin', 'User', 'SuperUser', 'HOD', 'Librarian'];
  private fromRadioChange = false;
  roles: string[] = [];
  isHodChecked: boolean = false;
  plantList: any;
  // plantList: any[] = []; // Example: [{ plantName: 'Plant A' }]


  isHODFlag: boolean = false;
   submitted: boolean = false;

    @ViewChild('addClientAdminModal') addClientAdminModal!: ElementRef;
    @ViewChild('addClientLibrarianModal') addClientLibrarianModal!: ElementRef;
    @ViewChild('editClientAdminModal') editClientAdminModal!: ElementRef;
    @ViewChild('editClientLibrarianModal') editClientLibrarianModal!: ElementRef;
  selectedDeptCatNameAbbr: any;
  selectedSubAreaCatName: any;
  selectedSubAreaCatNameAbbr: any;
  selectedCatName: any;
  selectedCatNameAbbr: any;
  otherMainHeadFlag: boolean = false;


  constructor( private formBuilder: FormBuilder, private loginService: LoginComponentService,private uploadDocument: UploadDocumentComponentService) { }



  
//   ngOnInit(): void {

    
  
// this.getAllMainHeadData();

//   this.addUserForm = this.formBuilder.group({
//     userName: ["", [ Validators.required]],
//     userPhone: ["", []],
//     userEmail: ["", [ Validators.required]],
//     department: ["", [ Validators.required]],
//     mainRole: ["", []],
//     mainHead: ["", [Validators.required]],
//     plant: ["", [ Validators.required]],
//     Admin: [false],
//     User: [false],
//     SuperUser: [false],
//     HOD: [false],
//     Librarian: [false],
//     isActive: [false],
//   });

  
  

//   this.editUserForm = this.formBuilder.group({
//     userName: ["", []],
//     userPhone: ["", []],
//     userEmail: ["", []],
//     department: ["", []],
//     plant: ["", []],
//     mainRole: ["", []],
//     Admin: [false],
//     User: [false],
//     SuperUser: [false],
//     HOD: [false],
//     Librarian: [false],
//     isActive: [false],
//   });

//    this.addUserForm.get('mainHead')?.valueChanges.subscribe(value => {
//     const [catName, abbreviation] = value.split('~');
//     this.selectedCatName = catName;
//     this.selectedCatNameAbbr = abbreviation;

//     console.log("Selected main head:", this.selectedCatName, "Abbreviation:", this.selectedCatNameAbbr);

//     // 🔁 Reset all dependent form controls and variables
//     // this.addUserForm.get('plants')?.reset();
//     // this.addUserForm.get('department')?.reset();
//     // this.addUserForm.get('subArea')?.reset();
//     // this.addUserForm.get('subDocumentType')?.reset();

//     this.plantOption = '';
//     this.selectedDeptCatName = '';
//     this.selectedDeptCatNameAbbr = '';
//     this.selectedSubAreaCatName = '';
//     this.selectedSubAreaCatNameAbbr = '';

//     this.plantList = [];
//     this.departmentList = [];
//     // this.subAreaList = [];
//     // this.subDocListSize = 0;
//     this.newPlant = false;

//     // 🔄 Fetch updated plant list based on new main head
//     this.getMainHeadList(catName, "main-head");
//   });


//   this.addUserForm.get('plant')?.valueChanges.subscribe(value => {
//     if (value != null) {
//       this.getAllPlantList(value, "plants");
//       this.plantOption = value;
//       if(this.plantOption == "CPP (1740MW)"){
//         this.newPlant = true;
//       }else{
//         this.newPlant = false;
//       }
//     } else {
//     }
//   });
//   this.addUserForm.get('department')?.valueChanges.subscribe(value => {
//     const [deptName, deptAbbr] = value.split('~');
//     this.selectedDeptCatName = deptName;
//     
//   });






//     // ✅ Handle mainRole radio selection
//     this.editUserForm.get('mainRole')?.valueChanges.subscribe((selectedRole: string) => {
//       this.accessRoles.forEach(role => {
//         const control = this.editUserForm.get(role);
//         if (!control) return;

//         if (role === selectedRole) {
//           control.enable({ emitEvent: false });           // Ensure enabled before setValue
//           control.setValue(true, { emitEvent: false });   // Check it
//           control.disable({ emitEvent: false });          // Freeze it
//         } else {
//           control.enable({ emitEvent: false });           // Unfreeze other roles
//           control.setValue(false, { emitEvent: false });  // Uncheck them
//         }
//       });
//     });

//     // ✅ Allow manual accessRole selection (except for mainRole)
//     this.accessRoles.forEach(role => {
//       const control = this.editUserForm.get(role);
//       if (!control) return;

//       control.valueChanges.subscribe((isChecked: boolean) => {
//         const currentMainRole = this.editUserForm.get('mainRole')?.value;
//         if (role === currentMainRole) return; // Ignore changes to frozen checkbox
//         if (isChecked) {
//           console.log(`${role} Access granted manually`);
//         }
//       });
//     });


  
//   }


  async ngOnInit(): Promise<void> {
  this.getAllMainHeadData();


  // Initialize forms
  this.addUserForm = this.formBuilder.group({
    userName: ["", [Validators.required]],
    userPhone: [""],
    userEmail: ["", [Validators.required]],
    department: ["", [Validators.required]],
    mainRole: [""],
    mainHead: ["", [Validators.required]],
    plant: ["", [Validators.required]],
    Admin: [false],
    User: [false],
    SuperUser: [false],
    HOD: [false],
    Librarian: [false],
    isActive: [false],
  });

  this.editUserForm = this.formBuilder.group({
    userName: [""],
    userPhone: [""],
    userEmail: [""],
    department: ["", []],
    mainHead: ["", [Validators.required]],
    plant: ["", []],
    mainRole: [""],
    Admin: [false],
    User: [false],
    SuperUser: [false],
    HOD: [false],
    Librarian: [false],
    isActive: [false],
    extraDeptPlant: this.formBuilder.array([]) // ✅ dynamic section
  });

  // Main Head → Plant cascading
  this.editUserForm.get('mainHead')?.valueChanges.subscribe(value => {
    const [catName, abbreviation] = value.split('~');
    this.selectedCatName = catName;
    if(this.selectedCatName !== "POWER O&M"){
      this.otherMainHeadFlag = true;
      console.log("Other main head selected Flag:", this.otherMainHeadFlag);
          }else{
      this.otherMainHeadFlag = false;
       console.log("Other main head selected Flag:", this.otherMainHeadFlag);
          }
    console.log("Selected main head:", this.selectedCatName, "Abbreviation:", abbreviation);
    
    this.selectedCatNameAbbr = abbreviation;

    this.plantOption = '';
    this.selectedDeptCatName = '';
    this.selectedDeptCatNameAbbr = '';
    this.selectedSubAreaCatName = '';
    this.selectedSubAreaCatNameAbbr = '';

    this.plantList = [];
    this.departmentList = [];
    this.newPlant = false;

    this.getMainHeadList(catName, "main-head");
  });

  // Plant logic
  this.editUserForm.get('plant')?.valueChanges.subscribe(value => {
    if (value) {
      this.getAllPlantList(value, "plants");
      this.plantOption = value;
      this.newPlant = value === "CPP (1740MW)";
    }
  });

  this.editUserForm.get('plant')?.valueChanges.subscribe(plantValue => {
  if (plantValue) {
    this.uploadDocument.allPlantList(plantValue, 'plants').subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.uploadDocument.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);
          this.departmentList = res?.categoryList || []; // ✅ set for main dropdown
        }
      },
      error: (err: any) => {
        console.error('Failed to load departments for plant:', err);
        this.departmentList = []; // fallback
      }
    });
  } else {
    this.departmentList = [];
  }
});


  // Department abbreviation mapping
  this.editUserForm.get('department')?.valueChanges.subscribe(value => {
    const [deptName, deptAbbr] = value.split('~');
    this.selectedDeptCatName = deptName;
    this.selectedDeptCatNameAbbr = deptAbbr;
  });

  // 🔁 Handle Main Role → Checkbox sync
 this.editUserForm.get('mainRole')?.valueChanges.subscribe((selectedRole: string) => {
  this.isHODFlag = selectedRole === 'HOD';
  console.log(`HOD flag is set to: ${this.isHODFlag}`);
  this.syncMainRoleWithCheckbox(selectedRole);


  if (!this.isHODFlag) {
    this.resetExtraDeptPlant(); // ✅ Always reset if role is not HOD
  }
});

  // 🔁 Allow manual selection of checkboxes (except mainRole)
  this.accessRoles.forEach(role => {
    const control = this.editUserForm.get(role);
    if (!control) return;

    control.valueChanges.subscribe((isChecked: boolean) => {
      const currentMainRole = this.editUserForm.get('mainRole')?.value;
      if (role === currentMainRole) return; // skip frozen
      if (isChecked) {
        console.log(`${role} Access granted manually`);
      }
    });
  });

  // ✅ Apply sync on initial load if mainRole is pre-set
  const currentMainRole = this.editUserForm.get('mainRole')?.value;
  if (currentMainRole) {
    this.syncMainRoleWithCheckbox(currentMainRole);
  }





// Only now add row
this.addExtraDeptPlant();
}
  

// private syncMainRoleWithCheckbox(selectedRole: string): void {
//   this.accessRoles.forEach(role => {
//     const control = this.editUserForm.get(role);
//     if (!control) return;

//     if (role === selectedRole) {
//       control.enable({ emitEvent: false });           // just in case it was disabled
//       control.setValue(true, { emitEvent: false });   // check it
//       control.disable({ emitEvent: false });          // freeze it
//     } else {
//       control.enable({ emitEvent: false });           // allow other roles
//       control.setValue(false, { emitEvent: false });  // uncheck others
//     }
//   });
// }

// private syncMainRoleWithCheckbox(selectedRole: string): void {
//   if (!selectedRole) return;

//   this.accessRoles.forEach(role => {
//     const control = this.editUserForm.get(role);
//     if (!control) return;

//     if (role === selectedRole) {
//       control.enable({ emitEvent: false });           // Just in case it was disabled
//       control.setValue(true, { emitEvent: false });   // Check it
//       control.disable({ emitEvent: false });          // Freeze it again
//     } else {
//       control.enable({ emitEvent: false });           // Enable for optional check
//       control.setValue(false, { emitEvent: false });  // Uncheck
//     }
//   });
// }




private syncMainRoleWithCheckbox(selectedRole: string): void {
  this.accessRoles.forEach(role => {
    const control = this.editUserForm.get(role);
    if (!control) return;

    if (role === selectedRole) {
      control.enable({ emitEvent: false });
      control.setValue(true, { emitEvent: false }); // always true
      control.disable({ emitEvent: false });        // disable only main role
    } else {
      control.enable({ emitEvent: false }); // keep enabled
      // ⚠️ don't reset or uncheck here!
    }
  });
}




get extraDeptPlant(): FormArray {
  return this.editUserForm.get('extraDeptPlant') as FormArray;
}

// addExtraDeptPlant() {
//   const dept = this.editUserForm.get('department')?.value || '';
//   const plant = this.editUserForm.get('plant')?.value || '';

//   const group = this.formBuilder.group({
//     plant: [plant, Validators.required],
//     department: [dept, Validators.required]
//   });

//   this.extraDeptPlant.push(group);

//   // Push empty department list for this row
//   this.extraDeptDropdownData.push({
//     plantList: this.plantList,
//     departmentList: []
//   });

//   // Subscribe to changes in plant dropdown of this row
//   group.get('plant')?.valueChanges.subscribe((plantValue: string) => {
//     this.getDepartmentsForPlant(plantValue, this.extraDeptDropdownData.length - 1);
//   });
// }


addExtraDeptPlant() {
  const group = this.formBuilder.group({
    plant: ['', Validators.required],
    department: ['', Validators.required],
    patched: [false]
  });

  this.extraDeptPlant.push(group);

  this.extraDeptDropdownData.push({
    plantList: this.plantList,
    departmentList: []
  });

  const rowIndex = this.extraDeptDropdownData.length - 1;

  group.get('plant')?.valueChanges.subscribe((plantValue: string | null) => {
    if (plantValue) {
      this.getDepartmentsForPlant(plantValue, rowIndex);
    }
  });
}



getMainPlantAndDept(): { plant: string; department: string } {
  const plant = this.editUserForm.get('plant')?.value || '';
  const deptRaw = this.editUserForm.get('department')?.value || '';
  const department = deptRaw.split('~')[0] || '';
  return { plant, department };
}




removeExtraDeptPlant(index: number) {
  this.extraDeptPlant.removeAt(index);
  this.extraDeptDropdownData.splice(index, 1);
}
// resetExtraDeptPlant(): void {
//   while (this.extraDeptPlant.length !== 0) {
//     this.extraDeptPlant.removeAt(0);
//   }
//   this.extraDeptDropdownData = [];
// }
resetExtraDeptPlant(): void {
  this.extraDeptDropdownData = [];
  while (this.extraDeptPlant.length) {
    this.extraDeptPlant.removeAt(0);
  }
}


extraDeptDropdownData: {
  plantList: any[];
  departmentList: any[];
}[] = [];

getDepartmentsForPlant(plantName: string, index: number): void {
  this.uploadDocument.allPlantList(plantName, 'plants').subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        const decryptedData = this.uploadDocument.convertEncToDec(event.body);
        const res = JSON.parse(decryptedData);
        this.extraDeptDropdownData[index].departmentList = res?.categoryList || [];
      }
    },
    error: (err: any) => {
      console.error(`Error fetching departments for row ${index}:`, err);
    }
  });
}




ngAfterViewInit(): void {
  const adminModalElement = this.addClientAdminModal?.nativeElement;
  const librarianModalElement = this.addClientLibrarianModal?.nativeElement;

const editAdminModalElement = this.editClientAdminModal?.nativeElement;
const editLibrarianModalElement = this.editClientLibrarianModal?.nativeElement;

  if (adminModalElement) {
    adminModalElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  if (librarianModalElement) {
    librarianModalElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  if (editAdminModalElement) {
  editAdminModalElement.addEventListener('hidden.bs.modal', () => {
    this.resetAdminEditFileInput();
  });
}

if (editLibrarianModalElement) {
  editLibrarianModalElement.addEventListener('hidden.bs.modal', () => {
    this.resetLibrarianEditFileInput();
  });
}
}

resetForm(): void {
  this.addUserForm.reset({
    userName: '',
    userEmail: '',
    userPhone: '',
    plant: '',
    department: '',
    mainRole: '',
    Admin: false,
    User: false,
    SuperUser: false,
    HOD: false,
    Librarian: false,
    isActive: false
  });

  // Mark all controls as pristine and untouched
  Object.keys(this.addUserForm.controls).forEach(key => {
    this.addUserForm.get(key)?.markAsPristine();
    this.addUserForm.get(key)?.markAsUntouched();
  });

  // Clear files and related flags
  this.files = [];
  this.uploadDocumentFlag = false;
  this.uploadDocumentSizeFlag = false;
  this.submitted = false;

   const fileInput = document.getElementById('fileDropRef') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }

    this.librarianFileDropRef.nativeElement.value = '';
}

resetAdminEditFileInput(): void {
    Object.keys(this.editUserForm.controls).forEach(key => {
    this.editUserForm.get(key)?.markAsPristine();
    this.editUserForm.get(key)?.markAsUntouched();
  })
    this.files = [];
  this.uploadDocumentFlag = false;
  this.uploadDocumentSizeFlag = false;
  this.submitted = false; // reset shared file array
  if (this.editAdminFileDrop?.nativeElement) {
    this.editAdminFileDrop.nativeElement.value = '';
  }
}

resetLibrarianEditFileInput(): void {
     Object.keys(this.editUserForm.controls).forEach(key => {
    this.editUserForm.get(key)?.markAsPristine();
    this.editUserForm.get(key)?.markAsUntouched();
  })
    this.files = [];
  this.uploadDocumentFlag = false;
  this.uploadDocumentSizeFlag = false;
  this.submitted = false; // reset shared file array
  if (this.editLibrarianFileDrop?.nativeElement) {
    this.editLibrarianFileDrop.nativeElement.value = '';
  }
}

 getAllMainHeadData() {
    
    this.uploadDocument.allMainHeadList().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          try {
            const decryptedData = this.uploadDocument.convertEncToDec(event.body);
          
  
            const jsonObj = JSON.parse(decryptedData);
            if (jsonObj.status === 200 && jsonObj.categoryList) {
              this.mainHeadList = jsonObj.categoryList;
              this.plantList = [];
              console.log("Main head list:", this.mainHeadList);
              
            } else {
              console.warn("No valid category list found in response.");
              this.mainHeadList = [];
            }
          } catch (error) {
            console.error("Error processing main head data:", error);
            this.mainHeadList = [];
          }
        }
      },
      error: (err: any) => {
        console.error("Error fetching main head data:", err);
      }
    });
  }


  getMainHeadList(catName: string, mainHead: string) {
    this.uploadDocument.allDataList(catName, mainHead).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.uploadDocument.convertEncToDec(event.body);
          if (decryptedData) {
            const res = JSON.parse(decryptedData);
            console.log("Plant List List Response:", res);
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




ngOnChanges(changes: SimpleChanges): void {
  if (changes['client'] && this.client && this.editUserForm) {
    if (!this.mainHeadList.length) {
      const retry = setInterval(() => {
        if (this.mainHeadList.length) {
          clearInterval(retry);
          this.ngOnChanges(changes); // Retry after mainHeadList loads
        }
      }, 100);
      return;
    }

    const mainHead = this.client.mainHead || '';
    const departmentList = this.client.departmentNameList || [];
    const firstDept = departmentList[0] || {};
    const plantName = firstDept.plantName || '';
    const departmentName = firstDept.departmentName || '';
    const accessRoles: string[] = this.client.accessRoles?.split(',') || [];
    const mainRole = this.client.role || '';

    const mhObj = this.mainHeadList.find(m => m.catName === mainHead);
    const mainHeadFormatted = mhObj ? `${mhObj.catName}~${mhObj.abbreviation}` : '';

    // ✅ Patch base form fields (excluding department for now)
    this.editUserForm.patchValue({
      userName: this.client.userName || '',
      userPhone: this.client.phoneNumber || '',
      userEmail: this.client.emailId || '',
      mainHead: mainHeadFormatted,
      plant: plantName,
      mainRole: mainRole,
      isActive: this.client.isActive || false,
      Admin: accessRoles.includes('Admin'),
      User: accessRoles.includes('User'),
      SuperUser: accessRoles.includes('SuperUser'),
      HOD: mainRole === 'HOD' || accessRoles.includes('HOD'),
      Librarian: accessRoles.includes('Librarian'),
      department: ''
    });

    // ✅ Patch additional access roles (excluding mainRole)
    accessRoles.forEach((role: string) => {
      if (role !== mainRole) {
        const control = this.editUserForm.get(role);
        if (control) {
          control.setValue(true, { emitEvent: false });
          control.enable({ emitEvent: false });
        }
      }
    });

    // ✅ Sync main role checkbox (disables the corresponding one)
    this.syncMainRoleWithCheckbox(mainRole);

    // ✅ Load department list for selected plant
    this.getAllPlantList(plantName, 'plants');

    // Patch department after department list is ready
    const patchDepartment = () => {
      const matchedDept = this.departmentList.find((d: any) => d.catName === departmentName);
      const deptFormatted = matchedDept ? `${matchedDept.catName}~${matchedDept.abbreviation}` : '';
      this.editUserForm.patchValue({ department: deptFormatted });
    };

    const deptRetry = setInterval(() => {
      if (this.departmentList.length) {
        clearInterval(deptRetry);
        patchDepartment();
      }
    }, 100);
    setTimeout(() => clearInterval(deptRetry), 2000); // safety timeout

    // ✅ Patch extra departments
    const extraDepts = departmentList.slice(1);
    this.resetExtraDeptPlant();

    extraDepts.forEach((entry: any, index: number) => {
      const group = this.formBuilder.group({
        plant: [entry.plantName, Validators.required],
        department: ['', Validators.required]
      });

      this.extraDeptPlant.push(group);
      this.extraDeptDropdownData.push({ plantList: this.plantList, departmentList: [] });

      this.uploadDocument.allPlantList(entry.plantName, 'plants').subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const decrypted = this.uploadDocument.convertEncToDec(event.body);
            const res = JSON.parse(decrypted);
            const deptList = res?.categoryList || [];

            this.extraDeptDropdownData[index].departmentList = deptList;

            const deptMatch = deptList.find((d: any) => d.catName === entry.departmentName);
            const deptFormatted = deptMatch ? `${deptMatch.catName}~${deptMatch.abbreviation}` : '';
            group.patchValue({ department: deptFormatted });
          }
        },
        error: (err: any) => console.error(`Error loading departments for extra row ${index}`, err)
      });

      group.get('plant')?.valueChanges.subscribe((plantValue: string) => {
        this.getDepartmentsForPlant(plantValue, index);
      });
    });
  }
}










patchUserData(mainHead: string, mainRole: string, deptList: any[]) {
  const mainHeadObj = this.mainHeadList.find((m: any) => m.catName === mainHead);
  const mainHeadFormatted = mainHeadObj ? `${mainHeadObj.catName}~${mainHeadObj.abbr}` : '';

  this.editUserForm.patchValue({
    userName: this.client.userName || '',
    userPhone: this.client.phoneNumber || '',
    userEmail: this.client.emailId || '',
    mainHead: mainHeadFormatted,
    mainRole: mainRole,
    Admin: this.roles.includes('Admin'),
    User: this.roles.includes('User'),
    SuperUser: this.roles.includes('SuperUser'),
    HOD: this.roles.includes('HOD'),
    Librarian: this.roles.includes('Librarian'),
    isActive: this.client.isActive || false,
  });

  const first = deptList[0];
  const rest = deptList.slice(1);

  const mainHeadCatName = mainHeadFormatted.split('~')[0];
  this.getMainHeadList(mainHeadCatName, 'main-head');

  // Step 1: patch plant
  setTimeout(() => {
    this.editUserForm.patchValue({ plant: first.plantName });
    this.getAllPlantList(first.plantName, 'plants');

    // Step 2: patch department once dept list is ready
    setTimeout(() => {
      const deptObj = this.departmentList.find((d: any) => d.catName === first.departmentName);
      const deptFormatted = deptObj ? `${deptObj.catName}~${deptObj.abbr}` : '';
      this.editUserForm.patchValue({ department: deptFormatted });

      // Step 3: Sync role checkboxes
      this.syncMainRoleWithCheckbox(mainRole);

      // Step 4: Patch extraDeptPlant[]
      this.patchExtraDeptPlant(rest);
    }, 400);
  }, 400);
}

patchExtraDeptPlant(extraList: any[]) {
  this.resetExtraDeptPlant();

  extraList.forEach((entry, index) => {
    const group = this.formBuilder.group({
      plant: [entry.plantName, Validators.required],
      department: ['', Validators.required],
    });

    this.extraDeptPlant.push(group);
    this.extraDeptDropdownData.push({ plantList: this.plantList, departmentList: [] });

    // fetch department list for that plant
    this.uploadDocument.allPlantList(entry.plantName, 'plants').subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decrypted = this.uploadDocument.convertEncToDec(event.body);
          const res = JSON.parse(decrypted);
          const deptList = res?.categoryList || [];
          this.extraDeptDropdownData[index].departmentList = deptList;

          const dept = deptList.find((d: any) => d.catName === entry.departmentName);
          const deptFormatted = dept ? `${dept.catName}~${dept.abbr}` : '';
          group.patchValue({ department: deptFormatted });
        }
      },
      error: (err: any) => console.error('Error loading extra dept list', err),
    });
  });
}




  

  getAllPlantList(selectedValue: string, plantHeader: string) {
    if (selectedValue !== '' && plantHeader !== null) {
      this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const decryptedData = this.uploadDocument.convertEncToDec(event.body);
            if (decryptedData) {
              const res = JSON.parse(decryptedData);
              console.log("Plant List Response:", res);
              
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
  
  this.submitted = true;

  // Mark all fields as touched so validation messages show
  this.addUserForm.markAllAsTouched();

  // Manually validate mainRole
  const mainRoleValue = this.addUserForm.get('mainRole')?.value;

  if (!mainRoleValue) {
    // Stop submission if mainRole is not selected
    return;
  }

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
   console.log("User modal payload",payload);
   
      
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
        mainHead: this.selectedCatName,
        departmentNameList: [
         {
            departmentName: this.selectedDeptCatName,
            plantName: this.editUserForm.value.plant
         }
        ],
        isActive: this.editUserForm.value.isActive,
        accessRoles: this.getSelectedRolesEdit(),
        userPicture: this.files?.length ? this.files[0].base64 : null, 
      };
      console.log("Librarian User modal payload", payload);
      
      
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
  
    // if (this.editUserForm.valid) {
    //   const payload = {
    //     userName: this.editUserForm.value.userName,
    //     phoneNumber: this.editUserForm.value.userPhone,
    //     emailId: this.editUserForm.value.userEmail,
    //     role:  this.editUserForm.value.mainRole,
    //     password: "",
    //     departmentNameList: [
    //       {
    //         departmentName: this.selectedDeptCatName,
    //         plantName: this.editUserForm.value.plant
    //       }
          
    //     ],
    //     isActive: this.editUserForm.value.isActive,
    //     // accessRoles: this.getSelectedRolesEdit(),
    //     accessRoles: this.getSelectedRolesEdit(),
    //     userPicture: this.files?.length ? this.files[0].base64 : null, 
    //   };

    //   console.log("User modal payload",payload);

      if (this.editUserForm.valid) {
    // Build the department list from main + extra
    const departmentNameList: any[] = [];

    // 🔹 1. Add main department
    departmentNameList.push({
      departmentName: this.selectedDeptCatName, // ensure this is the actual name (not "catName~abbr")
      plantName: this.editUserForm.value.plant
    });

    // 🔹 2. Add extra departments (if any)
    this.extraDeptPlant.controls.forEach((group: AbstractControl) => {
      const deptRaw = group.get('department')?.value;
      const deptParts = deptRaw?.split('~') || [];
      const deptName = deptParts[0] || '';

      departmentNameList.push({
        departmentName: deptName,
        plantName: group.get('plant')?.value
      });
    });

    // 🔹 3. Build final payload
    const payload = {
      userName: this.editUserForm.value.userName,
      phoneNumber: this.editUserForm.value.userPhone,
      emailId: this.editUserForm.value.userEmail,
      role: this.editUserForm.value.mainRole,
      password: "",
      mainHead: this.selectedCatName,
      departmentNameList: departmentNameList,
      isActive: this.editUserForm.value.isActive,
      accessRoles: this.getSelectedRolesEdit(),
      userPicture: this.files?.length ? this.files[0].base64 : null
    };

    console.log("ADMIN User modal payload", payload);
      
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

  // getSelectedRolesEdit(): string {
  //   const selectedRoles = [];
  //   if (this.editUserForm.value.Admin) selectedRoles.push("Admin");
  //   if (this.editUserForm.value.User) selectedRoles.push("User");
  //   if (this.editUserForm.value.SuperUser) selectedRoles.push("SuperUser");
  //   if (this.editUserForm.value.HOD) selectedRoles.push("HOD");
  //   if (this.editUserForm.value.Librarian) selectedRoles.push("Librarian");
  
  //   return selectedRoles.join(",");
  // }
  
  getSelectedRolesEdit(): string {
  const selectedRoles: string[] = [];
  const rawValues = this.editUserForm.getRawValue(); // ✅ includes disabled checkboxes

  if (rawValues.Admin) selectedRoles.push("Admin");
  if (rawValues.User) selectedRoles.push("User");
  if (rawValues.SuperUser) selectedRoles.push("SuperUser");
  if (rawValues.HOD) selectedRoles.push("HOD");
  if (rawValues.Librarian) selectedRoles.push("Librarian");

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
