import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { FileManagementService } from 'src/app/services/file-management.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';
import { routes } from 'src/app/core/helpers/routes/routes';


export interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export const OPTIONS: Option[] = [
  {
    value: 'fruits',
    label: 'Fruits',
    children: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' }
    ]
  },
  {
    value: 'vegetables',
    label: 'Vegetables',
    children: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' }
    ]
  }
];





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
  options: Option[] = OPTIONS;
  selectedValue: string | undefined;
  docList:any;
  subDocList:any;
  subDocumentTypeOption: any;
  docTypeId: any;
  docTypeName: any;
  subDocListSize: any;
docMap = new Map<number, string>();
public newPlant: boolean = false;
 
  

  constructor(
    private uploadService: FileManagementService,
    private formBuilder: FormBuilder,
    private uploadDocument: UploadDocumentComponentService
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

    // this.subDocumentTypeOption = this.uploadFileForm.value;
    // console.log("subtype::::",this.subDocumentTypeOption);
    

    this.uploadFileForm.get('mainHead')?.valueChanges.subscribe(value => {
      const [catName, abbreviation] = value.split('~');
      this.selectedCatName = catName;
      this.selectedCatNameAbbr = abbreviation

      if (catName != 'POWER O&M') {
        this.plantList = [];
        this.departmentList = [];
        this.subAreaList = [];
      }
      this.getMainHeadList(catName, "main-head");

    });

   


    this.uploadFileForm.get('plants')?.valueChanges.subscribe(value => {
      if (value != null) {
        this.getAllPlantList(value, "plants");
        this.plantOption = value;
        console.log(this.plantOption);
         
        if(this.plantOption == "CPP (1740MW)"){
          this.newPlant = true;
        }else{
          this.newPlant = false;
        }
        
      } else {
        console.log("No plant selected or value is null.");

      }
    });


    this.uploadFileForm.get('department')?.valueChanges.subscribe(value => {
      const [deptName, deptAbbr] = value.split('~');

         // Find the corresponding department object from the API response
    const selectedDept = this.departmentList.find(
      (dept: any) => dept.optionVal === value
    );

    if (selectedDept) {
      // Extract the catId for the selected department
      const deptId = selectedDept.catId;
      console.log("ffffffffff",deptId);
      
      // Call the method with the extracted deptId
      this.getDocTypeList(deptId);
    }

      this.getSubAreaList(deptName, "department");
      this.selectedDeptCatName = deptName;
      console.log("qqqqqqqq",this.selectedDeptCatName);
      
      this.selectedDeptCatNameAbbr = deptAbbr;

    });

    this.uploadFileForm.get('subArea')?.valueChanges.subscribe(value => {
      const [subAreaName, subAreaAbbr] = value.split('~');
      this.selectedSubAreaCatName = subAreaName;
      this.selectedSubAreaCatNameAbbr = subAreaAbbr;
    });


    this.getAllMainHeadData();

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
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);

      this.calculateTotalFileSize(this.files);
    }
    this.uploadFilesSimulator(0);
    this.uploadFileForm.get('uploadFile')?.setValue(this.files);

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
      console.log("selectedDeptCatName is null or undefined.");
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

    if (this.uploadFileForm.controls['documentType']) {
      this.documentTypeOption = this.uploadFileForm.value.documentType;
    }
    if (this.uploadFileForm.controls['subDocumentType']) {
      this.subDocumentTypeOption = this.uploadFileForm.value.subDocumentType;
      
    }
    // console.log("subDoct",this.subDocumentTypeOption);
    
    if (this.uploadFileForm.controls['storageLocation']) {
      this.storageLocationOption = this.uploadFileForm.value.storageLocation;
    }

    let isStatutoryDocument = this.uploadFileForm.controls['isStatutoryDocument'].value;
    let isRestrictedDocument = this.uploadFileForm.controls['isRestrictedDocument'].value;
    let ishodRestricted = this.uploadFileForm.controls['isHodDocument'].value;
    isStatutoryDocument = isStatutoryDocument === "" ? false : true;
    isRestrictedDocument = isRestrictedDocument === "" ? false : true;
    ishodRestricted = ishodRestricted === "" ? false : true;

    const formData = new FormData();
    for (const file of this.files) {

      // console.log("this selectedFiles",file);

      formData.append("file", file);
    }
    console.log(this.plantOption);
    console.log(this.selectedDeptCatName);
    console.log(this.selectedDeptCatNameAbbr);
    console.log(this.selectedSubAreaCatName);
    console.log(this.selectedSubAreaCatNameAbbr);
    console.log("subType::",this.subDocumentTypeOption);
 

    if (this.plantOption != null && this.selectedDeptCatName != null && this.selectedDeptCatNameAbbr != null && this.selectedSubAreaCatName != null && this.selectedSubAreaCatNameAbbr != null   &&  this.files.length > 0) {
     
      const modalData = {
     
        
          "department": this.selectedDeptCatName,
          "departAbbr": this.selectedDeptCatNameAbbr,
          "subArea": this.selectedSubAreaCatName,
          "subAreaAbbr": this.selectedSubAreaCatNameAbbr,
          "plants": this.plantOption,
          "mainHead": this.selectedCatName,
          "mainHeadAbbr": this.selectedCatNameAbbr,
          "storageLocation": this.storageLocationOption,
          "documentType": this.docMap.get( this.documentTypeOption),
          "documentSubType": this.subDocumentTypeOption,
          "isStatutory": isStatutoryDocument,
          "hodRestricted": isRestrictedDocument,
          "isRestrictedDocument": ishodRestricted


          
            // "department": "OPERATION",
            // "departAbbr": "EMD",
            // "subArea": "BOILER",
            // "subAreaAbbr": "TRB",
            // "plants": "CPP-2 (540MW)",
            // "mainHead": "POWER O&M",
            // "mainHeadAbbr": "O&M",
            // "storageLocation": "Soft Copy",
            // "documentType": "Bills",
            // "documentSubType": "Layout",
            // "isStatutory": false,
            // "hodRestricted": true,
            // "isRestrictedDocument": true
        
      
      };
      console.log("payloaddddd:: ",modalData);
      formData.append("requestbody", JSON.stringify(modalData));
     

      this.uploadService.upload(formData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {

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
            this.successfulSubmitAlert();
          }
        },
        error: (err: any) => {
          this.unsuccessfulSubmitAlert();
        }
      });
      return;
    }if(this.plantOption == null && this.selectedDeptCatName == null && this.selectedSubAreaCatName == null && this.documentTypeOption != '' )
       {
       
      const modalData = {
        "mainHead": this.selectedCatName,
        "mainHeadAbbr": this.selectedCatNameAbbr,
        "plants": null,
        "department": null,
        "departAbbr": null,
        "subArea": null,
        "subAreaAbbr": null,
        "documentType": this.docMap.get( this.documentTypeOption),
        "documentSubType": this.subDocumentTypeOption,
        "storageLocation": this.storageLocationOption,
        "isStatutory": isStatutoryDocument,
        "isRestrictedDocument": isRestrictedDocument,
        "hodRestricted": ishodRestricted

      };
      console.log("hhhhhhhmmmmoodjdjshjsg1",modalData);
      

      formData.append("requestbody", JSON.stringify(modalData));
   
      this.uploadService.upload(formData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
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
            this.successfulSubmitAlert();
          }
        },
        error: (err: any) => {
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
          this.unsuccessfulSubmitAlert();
        }
      });
return;
    }else 
    {
      console.log("End of if and else");
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
        this.unsuccessfulSubmitAlert();
      
    }




  }







  getAllMainHeadData() {
    this.uploadDocument.allMainHeadList().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.mainHeadList = event.body?.categoryList || [];
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }


  getMainHeadList(selectedValue: string, mainHead: string) {

    if (selectedValue != '' && mainHead != null) {

      this.uploadDocument.allDataList(selectedValue, mainHead).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.plantList = event.body?.categoryList || [];
            console.log(this.plantList);
            
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  getAllPlantList(selectedValue: string, plantHeader: string) {

    if (selectedValue != '' && plantHeader != null) {
      this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.departmentList = event.body?.categoryList || [];
            console.log("yyyyyyyyyyy",this.departmentList);
            
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  getSubAreaList(selectedValue: string, departmentHeader: string) {
    if (selectedValue != '' && departmentHeader != null) {
      this.uploadDocument.allSubAreaList(selectedValue, departmentHeader).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.subAreaList = event.body?.categoryList || [];
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  getDocTypeList(deptId: any) {
    if (deptId != '') {
      this.uploadDocument.docTypeList(deptId).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
             this.docList = event.body;
            console.log("resulttttttttt",this.docList);
            this.docList.forEach((item: any) => {
              console.log("doc type Map", item.id, item.documentName);
              this.docMap.set(item.id, item.documentName);
           
            });
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  onDocumentTypeChange(docId: any) {
 
    if (docId) {
      this.getSubDocTypeList(docId);
    }
  }

  getSubDocTypeList(docId: any) {
    if (docId != '') {
      this.uploadDocument.subDocTypeList(docId).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
             this.subDocList = event.body;
             this.subDocListSize = this.subDocList.length
            console.log("subDocccccccc",this.subDocList);
           
            // let subType = this.subDocList.id
            // console.log(subType);
            
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

    });
  }

  unsuccessfulSubmitAlert() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  }
}
