import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { FileManagementService } from 'src/app/services/file-management.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { routes } from 'src/app/core/helpers/routes/routes';
@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.scss']
})
export class UploadDocComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  public routes = routes;
  public message: any;
  public selectedFiles: any[] = [];
  public plantList: any[] = [];
  public fileNames: string[] = [];
  public uploadFileForm!: FormGroup;
  public mainHeadList: any[] = [];
  public selectedCatName: any;
  public plantOption: any;
  public encryptedData = 'CGR6dHOVNQIoiS/R9neDEWC8u5q27C55YLil1Uam6ORcV3tmvw0zEbowgbd56Z/tZ01M7rw2+arhdcp1zg1ZO/ZwtSLB2gDx0JQP5Iueqfw='; // Get this from Java encryption output

  public selectedDeptCatName: any;
  public selectedSubAreaCatName: any;
  public documentTypeOption: any;
  public storageLocationOption: any;
  public departmentList: any[] = [];
  public subAreaList: any[] = [];
  public subAreaFlag: boolean = false;
  public documentTypeFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  public storageLocationFlag: boolean = false
  public mainHeadFlag: boolean = false;
  public plantFlag: boolean = false;
  public departmentFlag: boolean = false;
  public submitted: boolean = false;
  public uploadDocumentSizeFlag: boolean = false;
  public disableSubmitBtn: boolean = true;
  selectedCatNameAbbr: any;
  selectedDeptCatNameAbbr: any;
  selectedSubAreaCatNameAbbr: any;
  selectedValue: string | undefined;
  docList:any;
  subDocList:any;
  subDocumentTypeOption: any;
  docTypeId: any;
  docTypeName: any;
  subDocListSize: any;
  public buttonDisabled: boolean = false;
docMap = new Map<number, string>();
public newPlant: boolean = false;
public invalidFileExtensionFlag: boolean = false;
firstValidationAttempt: boolean = true; // Track if it's the first validation attempt
  

 
  constructor(
    private uploadService: FileManagementService,
    private formBuilder: FormBuilder,
    private uploadDocument: UploadDocumentComponentService,
    private cdr: ChangeDetectorRef
  ) {

    this.uploadFileForm = this.formBuilder.group({
      uploadFile: ["", [Validators.required]],
      mainHead: ['', Validators.required],
      plants: ["", [Validators.required]],
      department: ["", [Validators.required]],
      subArea: ["", [Validators.required]],
      documentType: ["", [Validators.required]],
      subDocumentType: ["", [Validators.required]],
      storageLocation: ["", [Validators.required]],
      isStatutoryDocument: ["", [Validators.required]],
      isRestrictedDocument: ["", [Validators.required]],
      isHodDocument: ["", [Validators.required]],
    });
  }

ngOnInit(): void {
  this.getDocTypeList();
  this.getAllMainHeadData();

  const secretKey = '1234567890123456'; // Must match Java key
  const iv = 'abcdefghijklmnop'; // Must match Java IV

  const decryptedBytes = CryptoJS.AES.decrypt(this.encryptedData, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  // console.log('Decrypted Text:', decryptedText);

  // 🔄 MAIN HEAD change listener
  this.uploadFileForm.get('mainHead')?.valueChanges.subscribe(value => {
    const [catName, abbreviation] = value.split('~');
    this.selectedCatName = catName;
    this.selectedCatNameAbbr = abbreviation;

    // console.log("Selected main head:", this.selectedCatName, "Abbreviation:", this.selectedCatNameAbbr);

    // 🔁 Reset all dependent form controls and variables
    this.uploadFileForm.get('plants')?.reset();
    this.uploadFileForm.get('department')?.reset();
    this.uploadFileForm.get('subArea')?.reset();
    this.uploadFileForm.get('subDocumentType')?.reset();

    this.plantOption = '';
    this.selectedDeptCatName = '';
    this.selectedDeptCatNameAbbr = '';
    this.selectedSubAreaCatName = '';
    this.selectedSubAreaCatNameAbbr = '';

    this.plantList = [];
    this.departmentList = [];
    this.subAreaList = [];
    this.subDocListSize = 0;
    this.newPlant = false;

    // 🔄 Fetch updated plant list based on new main head
    this.getMainHeadList(catName, "main-head");
  });

  // 🔄 PLANTS change listener
  this.uploadFileForm.get('plants')?.valueChanges.subscribe(value => {
    if (value != null) {
      this.getAllPlantList(value, "plants");
      this.plantOption = value;

      this.newPlant = this.plantOption === "CPP (1740MW)";
    } else {
      this.plantOption = '';
      this.newPlant = false;
    }
  });

  // 🔄 DEPARTMENT change listener
  this.uploadFileForm.get('department')?.valueChanges.subscribe(value => {
    if (value) {
      const [deptName, deptAbbr] = value.split('~');
      this.getSubAreaList(deptName, "department");
      this.selectedDeptCatName = deptName;
      this.selectedDeptCatNameAbbr = deptAbbr;
    } else {
      this.selectedDeptCatName = '';
      this.selectedDeptCatNameAbbr = '';
    }
  });

  // 🔄 SUB-AREA change listener
  this.uploadFileForm.get('subArea')?.valueChanges.subscribe(value => {
    if (value) {
      const [subAreaName, subAreaAbbr] = value.split('~');
      this.selectedSubAreaCatName = subAreaName;
      this.selectedSubAreaCatNameAbbr = subAreaAbbr;
    } else {
      this.selectedSubAreaCatName = '';
      this.selectedSubAreaCatNameAbbr = '';
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

    // const allowedExtensions = [".pdf", ".docx", ".xlsx", ".jpeg", ".dwg"];
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

  selectedMainHead(event: any) {
    
    const [catName, abbreviation] = event.value.split('~');
    this.selectedCatName = catName;
    this.selectedCatNameAbbr = abbreviation;
    if (this.selectedCatName != null) {
      this.mainHeadFlag = false
    }
    if (this.selectedCatName != 'POWER O&M') {
      this.plantList = [];
      this.departmentList = [];
      this.subAreaList = [];
    }
  }

  selectedPlant(event: any) {
    this.plantOption = event.value;

    if (this.plantOption != null) {
      this.plantFlag = false;
    }
    if (this.selectedCatName != "POWER O&M") {
      this.plantFlag = false;
    }
  }

  selectedDepartment(event: any) {
    const [catName, abbreviation] = event.value.split('~');
    this.selectedDeptCatName = catName;
    this.selectedDeptCatNameAbbr = abbreviation;
    if (this.selectedDeptCatName != null) {
      this.departmentFlag = false;
    }

    if (this.selectedDeptCatName !== null && this.selectedDeptCatName !== undefined) {
      this.getSubAreaList(this.selectedDeptCatName, "department");
      
    } else {
    }
  }

  selectedSubArea(event: any) {
    const [catName, abbreviation] = event.value.split('~');
    this.selectedSubAreaCatName = catName;
    this.selectedSubAreaCatNameAbbr = abbreviation;
    if (this.selectedSubAreaCatName != null) {
      this.subAreaFlag = false;
    }

  }

  selectedDocumentType(event: any) {
    this.documentTypeOption = event.value;
    if (this.documentTypeOption != null) {
      this.documentTypeFlag = false;
    }

  }

  storageLocationType(event: any) {
    this.storageLocationOption = event.value;
    if (this.storageLocationOption != null) {
      this.storageLocationFlag = false;
    }

  }

  isSubmitDisabled(): boolean {
    return !(this.plantOption !== '' && 
             this.selectedDeptCatName !== '' && 
             this.selectedSubAreaCatName !== '' && 
             this.files.length > 0);
  }

onSubmit(): void {
  // ✅ Conditional validations
  if (this.plantList.length > 0) {
    const plantValue = this.uploadFileForm.get('plants')?.value;
    if (!plantValue || plantValue === '--Select--') {
      this.uploadFileForm.get('plants')?.markAsTouched();
      this.uploadFileForm.get('plants')?.markAsDirty();
      this.fieldSubmitAlert("Plants");
      return;
    }
  }

  if (this.departmentList.length > 0 && !this.newPlant && !this.uploadFileForm.get('department')?.value) {
    this.markFieldInvalid('department');
    this.fieldSubmitAlert("Department");
    return;
  }

  if (this.subAreaList.length > 0 && !this.uploadFileForm.get('subArea')?.value) {
    this.markFieldInvalid('subArea');
    this.fieldSubmitAlert("Sub-Area");
    return;
  }

  if (this.subDocListSize > 0 && !this.uploadFileForm.get('subDocumentType')?.value) {
    this.markFieldInvalid('subDocumentType');
    this.fieldSubmitAlert("Sub-Document Type");
    return;
  }

  // ✅ Extract values from form controls
  const documentTypeOption = this.uploadFileForm.get('documentType')?.value || '';
  const subDocumentTypeOption = this.uploadFileForm.get('subDocumentType')?.value || '';
  const storageLocationOption = this.uploadFileForm.get('storageLocation')?.value || '';
  const isStatutoryDocument = !!this.uploadFileForm.get('isStatutoryDocument')?.value;
  const isRestrictedDocument = !!this.uploadFileForm.get('isRestrictedDocument')?.value;
  const ishodRestricted = !!this.uploadFileForm.get('isHodDocument')?.value;

  const departmentSelected = this.departmentList.length > 0 && !this.newPlant ? this.selectedDeptCatName : '';
  const departmentAbbr = this.departmentList.length > 0 && !this.newPlant ? this.selectedDeptCatNameAbbr : '';
  const subAreaSelected = this.subAreaList.length > 0 ? this.selectedSubAreaCatName : '';
  const subAreaAbbr = this.subAreaList.length > 0 ? this.selectedSubAreaCatNameAbbr : '';

  // ✅ Use current form value for plants instead of stale variable
  const plantSelected = this.uploadFileForm.get('plants')?.value || '';

  // ✅ Prepare formData
  const formData = new FormData();
  for (const file of this.files) {
    formData.append("file", file);
  }

  const modalData: any = {
    mainHead: this.selectedCatName,
    mainHeadAbbr: this.selectedCatNameAbbr,
    plants: plantSelected,
    department: departmentSelected,
    departAbbr: departmentAbbr,
    subArea: subAreaSelected,
    subAreaAbbr: subAreaAbbr,
    documentType: this.docMap.get(documentTypeOption),
    documentSubType: subDocumentTypeOption || '',
    storageLocation: storageLocationOption,
    isStatutory: isStatutoryDocument,
    isRestrictedDocument: isRestrictedDocument,
    hodRestricted: ishodRestricted
  };
  // console.log("Modal Data:", modalData);

  // ✅ Allow upload if file is present and required fields are met
  if (this.files.length > 0 && documentTypeOption && storageLocationOption) {
    formData.append("requestbody", JSON.stringify(modalData));
    this.buttonDisabled = true;

    this.uploadService.upload(formData).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.buttonDisabled = false;
          this.resetForm(); // ✅ Reset everything
          this.successfulSubmitAlert();
        }
      },
      error: (err: any) => {
        console.error("Upload failed:", err);
        this.resetForm(); // Still reset on error
        this.unsuccessfulSubmitAlert();
      }
    });

    return;
  }

  // ❌ Fallback validation if required values not met
  this.submitted = true;
  const isValid = this.validateEssentialFields(['mainHead', 'documentType', 'storageLocation', 'uploadFile']);
  if (!isValid) return;

  console.warn("Form is not valid for upload.");
}





  markFieldInvalid(fieldName: string): void {
    const control = this.uploadFileForm.get(fieldName);
    if (control) {
      control.setErrors({ required: true });
      control.markAsTouched();
      control.markAsDirty();
    }
    this.uploadFileForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }



  resetForm() {
    // this.uploadFileForm.reset();
    this.submitted = false;
    this.files = [];
    this.fileDropEl.nativeElement.value = '';
    this.uploadDocumentFlag = false;
    this.uploadDocumentSizeFlag = false;
    this.subDocListSize = 0;
    this.plantList = [];
    this.departmentList = [];
    this.subAreaList = [];
    this.documentTypeFlag = false;
    this.storageLocationFlag = false;
    this.mainHeadFlag = false;
    this.plantFlag = false;
    this.departmentFlag = false;
    this.invalidFileExtensionFlag = false;
            this.uploadFileForm.get('uploadFile')?.reset('');
            this.uploadFileForm.get('mainHead')?.reset('');
            this.uploadFileForm.get('plants')?.reset('');
            this.uploadFileForm.get('department')?.reset('');
            this.uploadFileForm.get('subArea')?.reset('');
            this.uploadFileForm.get('documentType')?.reset('');
            this.uploadFileForm.get('subDocumentType')?.reset('');
            this.uploadFileForm.get('storageLocation')?.reset('');
            this.uploadFileForm.controls['isStatutoryDocument'].reset();
            this.uploadFileForm.controls['isRestrictedDocument'].reset();
            this.uploadFileForm.controls['isHodDocument'].reset();
            this.clearFileInput();
  }

//   validateEssentialFields(fields: string[]): boolean {
//     this.fileDropEl.nativeElement.value = '';
//   let hasErrors = false;
//   fields.forEach(field => {
//     const control = this.uploadFileForm.get(field);
//     if (control?.invalid || control?.value == null || control?.value === '') {
//       this.uploadDocumentFlag = true;
//       control?.markAsTouched();
//       control?.updateValueAndValidity();
//       hasErrors = true;
//     }
//   });
//   return !hasErrors;
// }

// validateEssentialFields(fields: string[]): boolean {
//   this.fileDropEl.nativeElement.value = ''; // Reset file input if needed

//   let hasErrors = false;

//   fields.forEach(field => {
//     // Skip validation for 'uploadFile' if file(s) already uploaded
//     if (field === 'uploadFile' && this.files.length > 0) {
//       this.uploadDocumentFlag = false; // No error for file upload
//       return; // Skip validation
//     }

//     const control = this.uploadFileForm.get(field);
//     if (control?.invalid || control?.value == null || control?.value === '') {
//       this.uploadDocumentFlag = true;
//       control?.markAsTouched();
//       control?.updateValueAndValidity();
//       hasErrors = true;

//       const fieldLabel = this.getFieldLabel(field);
//       this.fieldSubmitAlert(fieldLabel);
//     }
//   });

//   return !hasErrors;
// }

validateEssentialFields(fields: string[]): boolean {
  this.fileDropEl.nativeElement.value = '';
  let hasErrors = false;
  const missingFields: string[] = [];

  fields.forEach(field => {
    // Skip file validation if already uploaded
    if (field === 'uploadFile' && this.files.length > 0) {
      this.uploadDocumentFlag = false; // No error for file upload
      return;
    }

    const control = this.uploadFileForm.get(field);
    if (control?.invalid || control?.value == null || control?.value === '') {
      this.uploadDocumentFlag = true;
      control?.markAsTouched();
      control?.updateValueAndValidity();
      hasErrors = true;

      // Collect field label
      const label = this.getFieldLabel(field);
      missingFields.push(label);
    }
  });

  if (hasErrors) {
    if (this.firstValidationAttempt) {
      // Show all missing fields in a single alert
      const fieldList = missingFields.map(f => `• <b>${f}</b>`).join('<br>');
      this.fieldSubmitAlert(`Please fill out the following required fields:<br><br>${fieldList}`);
      this.firstValidationAttempt = false;
    } else if (missingFields.length > 0) {
      // Show one field at a time on later attempts
      this.fieldSubmitAlert(missingFields[0]);
    }
  }

  return !hasErrors;
}


getFieldLabel(field: string): string {
  const fieldMap: { [key: string]: string } = {
    mainHead: 'Main Head',
    documentType: 'Document Type',
    storageLocation: 'Storage Location',
    uploadFile: 'Upload File'
  };

  return fieldMap[field] || field;
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
              // console.log("Main head list:", this.mainHeadList);
              
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
  

  getMainHeadList(selectedValue: string, mainHead: string) {
    if (selectedValue !== '' && mainHead !== null) {
      this.uploadDocument.allDataList(selectedValue, mainHead).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            try {
              const decryptedData = this.uploadDocument.convertEncToDec(event.body);
              // console.log("Decrypted main head list:", decryptedData);
  
              const jsonObj = JSON.parse(decryptedData);
              if (jsonObj.status === 200 && jsonObj.categoryList) {
                
                this.plantList = jsonObj.categoryList;
                // console.log("Main head plant list:", this.plantList);
              } else {
                console.warn("No valid category list found in response.");
                this.plantList = [];
              }
            } catch (error) {
              console.error("Error processing main head list data:", error);
              this.plantList = [];
            }
          }
        },
        error: (err: any) => {
          console.error("Error fetching main head list data:", err);
        }
      });
    }
  }
  

  getAllPlantList(selectedValue: string, plantHeader: string) {
    if (selectedValue !== '' && plantHeader !== null) {
      this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            try {
              const decryptedData = this.uploadDocument.convertEncToDec(event.body);
              // console.log("Decrypted plant list:", decryptedData);
  
              const jsonObj = JSON.parse(decryptedData);
              if (jsonObj.status === 200 && jsonObj.categoryList) {
                this.departmentList = jsonObj.categoryList;
                // console.log("Plant department list:", this.departmentList);
              } else {
                console.warn("No valid category list found in response.");
                this.departmentList = [];
              }
            } catch (error) {
              console.error("Error processing plant list data:", error);
              this.departmentList = [];
            }
          }
        },
        error: (err: any) => {
          console.error("Error fetching plant list data:", err);
        }
      });
    }
  }
  

  getSubAreaList(selectedValue: string, departmentHeader: string) {
    if (selectedValue != '' && departmentHeader != null) {
      this.uploadDocument.allSubAreaList(selectedValue, departmentHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            let temp=event.body;
          
          const decryptedData = this.uploadDocument.convertEncToDec(temp);
          
          const res = JSON.parse(decryptedData);
            this.subAreaList = res?.categoryList || [];
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  getDocTypeList() {
      this.uploadDocument.docTypeListData().subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            let temp=event.body;
          
          const decryptedData = this.uploadDocument.convertEncToDec(temp);
          
          const res = JSON.parse(decryptedData);
             this.docList = res;
            this.docList.forEach((item: any) => {
              this.docMap.set(item.id, item.documentName);
           
            });
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
      }

  onDocumentTypeChange(docId: any) {
 
    if (docId) {
      this.getSubDocTypeList(docId);
    }
  }

  getSubDocTypeList(docId: any) {
    if (docId !== '') {
      this.uploadDocument.subDocTypeList(docId).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const decryptedData = this.uploadDocument.convertEncToDec(event.body);
            if (decryptedData) {
              this.subDocList = JSON.parse(decryptedData);
              this.subDocListSize = this.subDocList.length;
            }
          }
        },
        error: (err: any) => {
          console.error(err);
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
      window.location.href = window.location.href;
    });
  }

  unsuccessfulSubmitAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    }).then(() => {

      // window.location.reload();
      window.location.href = window.location.href;
    });;
  }


fieldSubmitAlert(fieldName: any) {
  Swal.fire({
    icon: "error",
    html: `Please fill out the <b>${fieldName}</b> field.`
  }).then(() => {
    // Optionally reload or do something else
    // window.location.href = window.location.href;
  });
}





}
