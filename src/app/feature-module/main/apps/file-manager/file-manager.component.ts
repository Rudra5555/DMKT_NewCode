import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getfileList } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { filter, flatMap, of, Subject, switchMap, takeUntil } from 'rxjs';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';
import { LoginComponentService } from 'src/app/services/login-component.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements OnInit , OnDestroy {
[x: string]: any;
  public searchDataValue = '';
  public routes = routes
  public filter = false;
  elem=document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  selectedDocType :any;
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public loggedUserName: any;
  dataSource!: MatTableDataSource<getfileList>;
  public fileList: Array<getfileList> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup ;
  public editClientForm!: FormGroup ;
  public multipleFiles: File[] = [];
  public getRole:any;
  public bigId:any;
  public roleFlag: boolean = false;
  public loggedUserId: any;
   departmentName:any;
   subAreaName: any;
   subAreaNameOnHeader:any;
   categoryList = new Map();
   mainHead:any;
   plants:any;
   docView: any;
   isLoading: boolean = false; 
   startDate:any;
   endDate:any;
   loggedUserRole:any;
   documentTypeDataList : any
   respData:any;
  private unsubscribe$ = new Subject<void>();
  transformedMap: Map<string, any> = new Map();
  documentTypeSet = new Set<string>();
  documentTypeList:any;
  resultMap:any;
  valueObject:any;
  finalList:any;
  fileListOne:any;
  copyDataList:any;

  @ViewChild('view_files', { static: false }) viewFilesModal!: ElementRef

  constructor(private data: DataService, private cdr: ChangeDetectorRef,
    _uploadService: FileManagementService, private formBuilder: FormBuilder,
        private route: ActivatedRoute, private router: Router,
        private datePipe: DatePipe,private loginService : LoginComponentService,private sanitizer: DomSanitizer) {

    this.route.queryParams.subscribe(params => {
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      this.categoryList = params['categoryList'];
      this.mainHead = params['mainHead'];
      this.plants = params['plants'];
      
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);
    });
  }

  setLast15Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 15);

    this.bsRangeValue = [startDate, endDate];
    this.onDateRangeSelected();
  }

  onDateRangeSelected() {
    this.startDate = this.formatDate(this.bsRangeValue[0]);
     this.endDate = this.formatDate(this.bsRangeValue[1]);

    this.getFileListDetails();
  }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }


 
  ngOnInit(): void {
    
    this.getDocumentTypeList();
    this.loggedUserRole=localStorage.getItem("role")  
    this.setLast15Days();

    this.route.queryParams.subscribe(params => {
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);  
    });

   this.getRole = localStorage.getItem('role');
   if(this.getRole == "Admin"){
    this.roleFlag = true;
    
  }if(this.getRole == "Librarian"){
    this.roleFlag = true;
  }if(this.getRole == "User"){
    this.roleFlag = false;

  }if(this.getRole == "SuperUser"){
    this.roleFlag = false;

  }if(this.getRole == "Hod"){
    this.roleFlag = false;
  
  }

    this.getFileListDetails()
    this.uploadFileForm = this.formBuilder.group({
  
      uploadFile: ["", [Validators.required]],
      area: ["", [Validators.required]],
      deptName: ["", [Validators.required]],
      instName: ["", [Validators.required]],
      docType: ["", [Validators.required]],
    });


  }

 

  getFileListDetails() {
    this.isLoading = true; 
    this.fileList = [];
    this.serialNumberArray = [];
  
    this.loginService.getFileLists(this.mainHead, this.plants, this.departmentName, this.subAreaName, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.respData = event.body.documentLists;

          const convertToKB = (bytes: number): string => {
            return (bytes / 1024).toFixed(2);
          };
  
          this.fileListOne = this.respData.filter((item: any) => {
            return item.listOfDocumentVersoinDtos.some((version: any) => {
              if (this.loggedUserRole === 'User') {
                return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
              } else if (this.loggedUserRole === 'SuperUser') {
                return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
              } else if (this.loggedUserRole === 'HOD') {
                return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
              }else if (this.loggedUserRole === 'Librarian' || this.loggedUserRole === 'Admin') {
                return true; 
              }
            });
          });
          // console.log("file list one",this.fileListOne);
          
          this.transformedMap = this.transformApiResponseToMap(this.fileListOne);

          this.fileList = Array.from(this.transformedMap.values());
          // console.log("file list",JSON.stringify( this.fileList));
          
          //copy data
          this.copyDataList = Array.from(this.transformedMap.values());

          // console.log("vgyvgscgshadfgavsdcha:^^^^",this.finalList);
          
  
          // console.log("response...",this.transformedMap);
          
          this.totalData = this.fileList.length;

          this.fileListOne.forEach((item: any) => {
            if (item.documentType) {
              this.documentTypeSet.add(item.documentType);
            }
          });
          
          this.documentTypeList = Array.from(this.documentTypeSet);
  
          this.fileList.map((item: getfileList, index: number) => {
            const serialNumber = index + 1;
            if (index >= this.skip && serialNumber <= this.limit) {
              item.id = serialNumber;
              this.serialNumberArray.push(serialNumber);
            }
          });
  
          this.dataSource = new MatTableDataSource<getfileList>(this.fileList);
     
          
          this.calculateTotalPages(this.fileList.length, this.pageSize);
  
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
        this.isLoading = false;
      },
    });
  }



  transformApiResponseToMap(apiResponse: any[]): Map<string, any> {
    const resultMap = new Map<string, any>();
  
    apiResponse.forEach((item) => {

      const fileName = item.fileName;
      const documentType = item.documentType;
      const documentSubType = item.documentSubType;
      const storageLocation = item.storageLocation;
  
      const listOfDocumentVersoinDtos = item.listOfDocumentVersoinDtos.slice().reverse() || [];
      if (listOfDocumentVersoinDtos.length === 0) {
        console.warn(`No versions found for file: ${fileName}`);
        return;
      }
  
      const firstVersion = listOfDocumentVersoinDtos[0];
  
      const newUniqueFileName = firstVersion.newUniqueFileName;
      const fileUrl = firstVersion.fileUrl || null;
      const fileSize = firstVersion.fileSize ;
      const versionName=firstVersion.versionName
      const versionReleaseDate=firstVersion.versionReleaseDate
  
      const valueObject = {
        newUniqueFileName,
        fileName,
        fileSize,
        listOfDocumentVersoinDtos,
        documentType,
        documentSubType,
        storageLocation,
        fileUrl,
        versionName,
        versionReleaseDate
      };
  
      resultMap.set(fileName, valueObject);
    });
    return resultMap;
  }
  
  capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  public sortData(sort: Sort) {
    const data = this.fileList.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.fileList = data;
    } else {
      this.fileList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.fileList = this.dataSource.filteredData;
    // console.log("get all file by filter",this.fileList);
    
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getFileListDetails()
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getFileListDetails()
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getFileListDetails()
  }
  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getFileListDetails()
  }
  openFilter() {
    this.filter = !this.filter;
  }
  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }
  fullscreen() {
    if(!document.fullscreenElement) {
      this.elem.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
  }
  public selectedFieldSet = [0];
  currentStep = 0;
  nextStep() {
    this.currentStep++;
  }
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;


selected1 = 'option1';

selectFiles(_event: any): void {
  
}


getDocumentTypeList() {
  this.loginService.getDocumentType().subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        this.documentTypeDataList = event.body || [];
        // console.log("DOCUMENT TYPE:: ",this.documentTypeDataList);

      }
    },
    error: (err: any) => {
      console.error(err);
    }
  });
}


onMultipleSelect(event: { addedFiles: File[] }) {
  this.multipleFiles.push(...event.addedFiles);
  this.selectedFiles = this.multipleFiles;
  //console.log("file capchurd :",this.multipleFiles)
}

onRemoveMultiple(event: File) {
  this.multipleFiles.splice(this.multipleFiles.indexOf(event), 1);
}

upload(file: File): void {

if (file) {
  this['uploadService'].upload(file).subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        const msg = file.name + ": Successful!";
      }
    },
    error: (err: any) => {
      let msg = file.name + ": Failed!";

      if (err.error && err.error.message) {
        msg += " " + err.error.message;
      }
    }
  });
}
}


uploadFiles(): void {
this.message = [];

if (this.selectedFiles) {
  for (let i = 0; i < this.selectedFiles.length; i++) {
    this.upload(this.selectedFiles[i]);
  }
  this.selectedFiles = undefined;
}
}

onSubmit(){
console.warn('Your data has been submitted', this.uploadFileForm.value);

let modalData = {
  'uploadFile': this.uploadFileForm.controls['uploadFile'].value,
  'departmentName' : this.uploadFileForm.controls['departmentName'].value,
  'isStatutoryDocument' : this.uploadFileForm.controls['isStatutoryDocument'].value
}

console.warn('Your data has been submitted', modalData);

if (modalData) {
  this['uploadService'].upload(modalData).subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        const msg = modalData + ": Successful!";
    
      }
    },
    error: (err: any) => {
      let msg = modalData + ": Failed!";

      if (err.error && err.error.message) {
        msg += " " + err.error.message;
      }

    }
  });
}

this.uploadFileForm.reset();
}

ngOnDestroy() {
  this['unsubscribe$'].next();
  this['unsubscribe$'].complete();
}

getLatestVersion(versions: any[]): any {
  return versions.reduce((latest, version) => {
    return new Date(version.versionReleaseDate) > new Date(latest.versionReleaseDate) ? version : latest;
  });
}


onVersionChange(item: any,fileNameAsKey:any, selectedVersion: any) {

  let selectedVersionDetails = selectedVersion;
  let version=selectedVersion.versionName;

      const fileName=item.fileName;
      const extension=item.extension;
      const documentType = item.documentType;
      const documentSubType = item.documentSubType;
      const storageLocation = item.storageLocation;
      const listOfDocumentVersoinDtos= item.listOfDocumentVersoinDtos;

      item.listOfDocumentVersoinDtos.forEach((elem: any) => {

                if(elem.versionName==version)
                {
                  const newUniqueFileName=elem.uniqueFileName;
                  const fileSize =elem.fileSize;
                  const fileUrl = elem.fileUrl ;
                  const versionName=elem.versionName
                  const versionReleaseDate=elem.versionReleaseDate

                  this.valueObject = {
                    newUniqueFileName,
                    fileName,
                    fileSize,
                    listOfDocumentVersoinDtos,
                    documentType,
                    documentSubType,
                    storageLocation,
                    fileUrl,
                    versionName,
                    versionReleaseDate
                  };              
                }
            });

      // console.log("value object uuuuuuuuuuuNNNNNNNNN",this.valueObject);
      
      this.transformedMap.set(fileNameAsKey, this.valueObject);

      this.fileList = Array.from(this.transformedMap.values());

   
}

downloadDocument(doucmentUrl:any, item:any){
  this.loggedUserRole;
  this.loggedUserId = localStorage.getItem("loggedInUserId");
  this.loggedUserName = localStorage.getItem("loggedUserName");
  // console.log(doucmentUrl, this.loggedUserRole, this.loggedUserName, this.loggedUserId, item);
}


setFileUrl(fileUrl: any, fileName: any, fileSize: number, event: Event) {
  event.preventDefault(); // Prevents the modal from opening by default

  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

  if (fileExtension === 'pdf' && fileSize <= maxSize) {
    // Open modal for PDF within size limit
    this.openModal(fileUrl);
  } else if (fileExtension !== 'pdf') {
    // Show popup for non-PDF files
    this.fileExtensionPopup();
   
  } else {
    // Show popup if file is larger than 5MB
    this.fileSizePopup();
  }
}

// Function to open modal for PDFs
openModal(fileUrl: any) {
  // console.log("Opening modal for PDF:", fileUrl);
  this.docView = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  setTimeout(() => {
    const modalTrigger = document.getElementById('view_files');
    if (modalTrigger) {
      modalTrigger.classList.add('show');
      modalTrigger.style.display = 'block';
      document.body.classList.add('modal-open');
    
    }
  }, 10);
}

// Function to show popup if file is too large
fileSizePopup() {
  Swal.fire({
    title: "File size too large",
    text: "The file is larger than 5 MB and cannot be viewed. It will be downloaded instead.",
    icon: "warning",
  });
}

  unsuccessfulSubmitAlert() {
    Swal.fire({
      title: "File Size is too large to view, Please download to view the file",
      icon: "warning",
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster`
      }
    });
  }
  fileExtensionPopup() {
    Swal.fire({
      title: "Only PDF files can be viewed",
      text: "This file type cannot be previewed. It will be downloaded instead.",
      icon: "warning",
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster`
      }
    });
  }
  buttonClose(){
    const modalElement = document.getElementById('view_files'); // Get modal element
    if (modalElement) {
      modalElement.classList.remove('show'); // Remove Bootstrap's "show" class
      modalElement.style.display = 'none'; // Hide modal
      document.body.classList.remove('modal-open'); // Remove background overlay
    }
  
    this.docView =  this.docView = this.sanitizer.bypassSecurityTrustResourceUrl('');;
    this.cdr.detectChanges();
    
  }

onDocumentTypeChange(docType: any) {
  
  const filteredData = this.copyDataList.filter((item: any) => item.documentType === docType);

  if(filteredData!='' ){
    this.fileList = this.copyDataList.filter((item: any) => item.documentType === docType);
  }
  else{
    this.fileList = this.copyDataList;
  }
  }
}

