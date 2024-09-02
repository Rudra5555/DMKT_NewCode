import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { FileManagementService } from 'src/app/services/file-management.service';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';
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
  public disableSubmitBtn: boolean = false;
  selectedCatNameAbbr: any;
  selectedDeptCatNameAbbr: any;
  selectedSubAreaCatNameAbbr: any;

  constructor(
    private uploadService: FileManagementService,
    private formBuilder: FormBuilder,
    private uploadDocument: UploadDocumentComponentService
  ) { }

  ngOnInit(): void {
    this.getAllMainHeadData();

    this.uploadFileForm = this.formBuilder.group({
      uploadFile: ["", [Validators.required]],
      selectedCatName: ["", [Validators.required]],
      plantOption: ["", [Validators.required]],
      selectedDeptCatName: ["", [Validators.required]],
      subArea: ["", [Validators.required]],
      docType: ["", [Validators.required]],
      isStatutoryDocument: ["", [Validators.required]],
      isRestrictedDocument: ["", [Validators.required]],
      isHodDocument: ["", [Validators.required]],
    });
    this.updateSubmitButtonState();
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
   
  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files.target.files);

  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      // //console.log("Upload in progress.");
      return;
    }
    this.files.splice(index, 1);
    this.calculateTotalFileSize(this.files);
    this.updateSubmitButtonState();
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
    // //console.log("deleted file", this.files);
    
  }

  prepareFilesList(files: Array<any>) {
    // //console.log("preparation file list:: ",files);
    if(files != null){
      this.uploadDocumentFlag = false;
    }
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
   // this.selectedFiles.push(item);
      // //console.log("call files.push ", this.selectedFiles);
      // //console.log("each file size ",item.size);
      // //console.log("files push item:",this.files);
      

      this.calculateTotalFileSize(this.files);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
    this.updateSubmitButtonState();
    
  }


  calculateTotalFileSize(files: Array<any>) {
    const fiftyMB = 2 * 1024 * 1024;
    let totalSize = 0;
    
    for (const file of files) {
      totalSize += file.size;
    }
  
    if (totalSize <= fiftyMB) {
      // //console.log("Total file size pass" ,totalSize);
      this.uploadDocumentSizeFlag = false;
    } else {
      // //console.log("Total file size fail");
      this.uploadDocumentSizeFlag = true;
    }
    this.updateSubmitButtonState();
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
    if(this.selectedCatName != null){
      this.mainHeadFlag = false
    }
    if(this.selectedCatName != 'POWER O&M'){
      this.plantList = [];
      this.departmentList = [];
      this.subAreaList =[];
    }
    // this.onMainHeadChange(this.selectedCatName);
    this.onMainHeadChange( this.selectedCatName, this.selectedCatNameAbbr);
    this.updateSubmitButtonState();
  }

  selectedPlant(event: any) {
    this.plantOption = event.value;

    if(this.plantOption != null){
      this.plantFlag = false;
    }
    if(this.selectedCatName != "POWER O&M"){
      this.plantFlag = false;
      // //console.log("false plant flag",this.plantFlag);
      
    }
    this.getAllPlantList(this.plantOption, "plants");
    this.updateSubmitButtonState();
  }

  selectedDepartment(event: any) {
    // this.selectedDeptCatName = event.value;

    const [catName, abbreviation] = event.value.split('~');
    this.selectedDeptCatName = catName;
    this.selectedDeptCatNameAbbr = abbreviation;
    // //console.log(this.selectedDeptCatName, this.selectedDeptCatNameAbbr);

    if(this.selectedDeptCatName != null){
      this.departmentFlag = false;
    }
    
    this.getSubAreaList(this.selectedDeptCatName, "department");
    this.updateSubmitButtonState();
  }

  selectedSubArea(event: any) {
    // this.selectedSubAreaCatName = event.value;

    const [catName, abbreviation] = event.value.split('~');
    this.selectedSubAreaCatName = catName;
    this.selectedSubAreaCatNameAbbr = abbreviation;
    // //console.log(this.selectedSubAreaCatName, this.selectedSubAreaCatNameAbbr);
    // //console.log("subArea data:",this.selectedSubAreaCatName);
    
    if(this.selectedSubAreaCatName != null){
      this.subAreaFlag = false;
    }
    this.updateSubmitButtonState();
  }

  selectedDocumentType(event: any) {
    this.documentTypeOption = event.value;
    if(this.documentTypeOption != null){
      this.documentTypeFlag = false;
    }
    this.updateSubmitButtonState();
  }

  storageLocationType(event: any) {
    this.storageLocationOption = event.value;
    // //console.log(this.storageLocationOption);
    
    if(this.storageLocationOption != null){
      this.storageLocationFlag = false;
    }
    this.updateSubmitButtonState();
  }


 
  updateSubmitButtonState() {
    this.disableSubmitBtn = this.uploadDocumentSizeFlag || this.uploadDocumentFlag || this.mainHeadFlag || this.plantFlag || this.departmentFlag || this.subAreaFlag || this.documentTypeFlag || this.storageLocationFlag;
  }



 

  onSubmit(): void {


    let isStatutoryDocument = this.uploadFileForm.controls['isStatutoryDocument'].value;
    let isRestrictedDocument = this.uploadFileForm.controls['isRestrictedDocument'].value;
    let ishodRestricted = this.uploadFileForm.controls['isHodDocument'].value;

    isStatutoryDocument = isStatutoryDocument === "" ? false : true;
    isRestrictedDocument = isRestrictedDocument === "" ? false : true;
    ishodRestricted = ishodRestricted === "" ? false : true;


  
    const formData = new FormData();
    for (const file of this.files) {
   
      
      // //console.log("this selectedFiles",file);
      
      formData.append("file", file);
    }

    if (!this.selectedCatName) {
      // //console.log("true main head");
      
      this.mainHeadFlag = true;
    } else {
      this.mainHeadFlag = false;
      // //console.log("false main head");
    }

    if (!this.plantOption) {
      this.plantFlag = true;
    } else {
      this.plantFlag = false;
    }

    if (!this.selectedDeptCatName) {
      this.departmentFlag = true;
    } else {
      this.departmentFlag = false;
    }

    if (!this.selectedSubAreaCatName) {
      this.subAreaFlag = true;
    } else {
      this.subAreaFlag = false;
    }

    if (!this.documentTypeOption) {
      this.documentTypeFlag = true;
    } else {
      this.documentTypeFlag = false;
    }

    if(!this.storageLocationOption){
      this.storageLocationFlag = true;
    }else {
      this.storageLocationFlag = false;
    }

   
    if (this.files.length === 0 ) {
      this.uploadDocumentFlag = true;
    } else {
      this.uploadDocumentFlag = false;
      // //console.log("testing -> false");
      
    }

    this.updateSubmitButtonState();

    if (this.selectedCatName && this.plantOption && this.selectedDeptCatName && this.selectedSubAreaCatName && this.documentTypeOption && this.storageLocationOption && this.files.length > 0 ) {
      const modalData = {
        "mainHead": this.selectedCatName,
        "mainHeadAbbr": this.selectedCatNameAbbr,
        "plants": this.plantOption,
        "department": this.selectedDeptCatName,
        "departAbbr": this.selectedDeptCatNameAbbr,
        "subArea": this.selectedSubAreaCatName,
        "subAreaAbbr": this.selectedSubAreaCatNameAbbr,
        "documentType": this.documentTypeOption,
        "storageLocation": this.storageLocationOption,
        "isStatutory": isStatutoryDocument,
        "isRestrictedDocument": isRestrictedDocument,
        "hodRestricted": ishodRestricted
        
      };
      // //console.log(modalData);
      formData.append("requestbody", JSON.stringify(modalData));
    
      
      this.uploadService.upload(formData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.successfulSubmitAlert();
          }
        },
        error: (err: any) => {
          this.unsuccessfulSubmitAlert();
        }
      });
    } else {
      // //console.log("Please fill all the required fields.");
      const modalData = {
        "mainHead": this.selectedCatName,
        "mainHeadAbbr": this.selectedCatNameAbbr,
        "plants": null,
        "department": null,
        "departAbbr": null,
        "subArea": null,
        "subAreaAbbr": null,
        "documentType": this.documentTypeOption,
        "storageLocation": this.storageLocationOption,
        "isStatutory": isStatutoryDocument,
        "isRestrictedDocument": isRestrictedDocument,
        "hodRestricted": ishodRestricted
        
      };
      // //console.log(modalData);
      formData.append("requestbody", JSON.stringify(modalData));

      
      this.uploadService.upload(formData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {

            
            this.successfulSubmitAlert();
          }
        },
        error: (err: any) => {
          this.unsuccessfulSubmitAlert();
        }
      });

    }


  }

  getAllMainHeadData() {
    this.uploadDocument.allMainHeadList().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.mainHeadList = event.body?.categoryList || [];
          // //console.log("main head:",this.mainHeadList);
          
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onMainHeadChange(selectedValue: string, selectedAbbr: string ) {
    this.getPlantList(selectedValue, "main-head",selectedAbbr);
  }

  getPlantList(selectedValue: string, mainHead: string,selectedAbbr:string) {
    this.uploadDocument.allDataList(selectedValue, mainHead).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.plantList = event.body?.categoryList || [];
          // //console.log("plant list:",this.plantList);
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getAllPlantList(selectedValue: string, plantHeader: string) {
    this.uploadDocument.allPlantList(selectedValue, plantHeader).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.departmentList = event.body?.categoryList || [];
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getSubAreaList(selectedValue: string, departmentHeader: string) {
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

  successfulSubmitAlert() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your document was uploaded successfully",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {

      window.location.reload();
      
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
