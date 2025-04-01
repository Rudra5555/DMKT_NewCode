import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getfileList } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { clientsDatas, companiesList } from 'src/app/core/core.index';
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { filter, flatMap, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';
import { LoginComponentService } from 'src/app/services/login-component.service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-file-manager-mainhead',
  templateUrl: './file-manager-mainhead.component.html',
  styleUrl: './file-manager-mainhead.component.scss'
})
export class FileManagerMainheadComponent implements OnInit, OnDestroy {
  [x: string]: any;
  public searchDataValue = '';
  public routes = routes
  public filter = false;
  elem = document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
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

  dataSource!: MatTableDataSource<getfileList>;
  public fileList: Array<getfileList> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup;
  public editClientForm!: FormGroup;
  public multipleFiles: File[] = [];
  public getRole: any;
  public bigId: any;
  public roleFlag: boolean = false;
  documentTypeDataList : any
  departmentName: any;
  subAreaName: any;
  subAreaNameOnHeader: any;
  decryptedPlantName: any;
  decryptedMainHeadName: any;
  categoryList = new Map();
  mainHead: any;
  plants: any;
  encryptedPlantName: any;
  decryptedMainHead:any;
  docView: any;
  viewer: ViewerType = 'google';
  selectedType = 'xlsx';
  timestamp: string ='';
  startDate: any;
  endDate: any;
  catName: any;
  catId: any
  loggedUserRole: any;
  isLoading: boolean = false;
  respData: any;
  public loggedUserName: any;
  public loggedUserId:any;
  transformedMap: Map<string, any> = new Map();
  documentTypeSet = new Set<string>();
  documentTypeList:any;
  resultMap:any;
  valueObject:any;
  finalList:any;
  fileListOne:any;
  copyDataList:any;
  getFileName: any;

  filterRes:any;
  public fullDataList:any;
  public filteredList:any;
  public firstRes:any;

  private unsubscribe$ = new Subject<void>();

  //** / pagination variables
  constructor(private data: DataService, private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer, _uploadService: FileManagementService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private loginService: LoginComponentService) {

    this.route.queryParams.subscribe(params => {
      this.catName = params['catName'];
      this.catId = params['catId'];
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      this.categoryList = params['categoryList'];
      this.mainHead = params['mainHead'];
      this.plants = params['plants'];
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);
    });
  }


  ngOnInit(): void {
    this.getDocumentTypeList();
    this.loggedUserRole = localStorage.getItem("role")

    this.setLast15Days();

    this.route.queryParams.subscribe((params) => {
      try {
        const encryptedMainHeadName = params['mainHeadName'];
        const encryptedPlantName = params['plantName'];
        const secretKey = this.timestamp; // Ensure this matches the sender's key
  
        // Decrypt the parameters
        this.decryptedMainHeadName = CryptoJS.AES.decrypt(encryptedMainHeadName, secretKey).toString(CryptoJS.enc.Utf8);
        this.decryptedPlantName = CryptoJS.AES.decrypt(encryptedPlantName, secretKey).toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Error decrypting query parameters:", error);
      }
    });

    this.getRole = localStorage.getItem('role');
    if (this.getRole == "Admin") {
      this.roleFlag = true;

    } if (this.getRole == "Librarian") {
      this.roleFlag = true;
    } if (this.getRole == "User") {
      this.roleFlag = false;
    } if (this.getRole == "SuperUser") {
      this.roleFlag = false;
    } if (this.getRole == "Hod") {
      this.roleFlag = false;
    }

    this.uploadFileForm = this.formBuilder.group({

      uploadFile: ["", [Validators.required]],
      area: ["", [Validators.required]],
      deptName: ["", [Validators.required]],
      instName: ["", [Validators.required]],
      docType: ["", [Validators.required]],
    });

    // this.getFileListDetails();
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

    this.getFileListDetails()
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  getFileListDetails() {
    this.isLoading = true; 
    this.fileList = [];
    
    this.loginService.getFileListforOther(this.decryptedMainHeadName, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          
          const res = JSON.parse(decryptedData);
          this.respData = res.data;

          
          const convertToKB = (bytes: number): number => {
            return Math.round(bytes / 1024);
          };

           this.fileListOne = this.respData.map((item: any) => {
            const filteredVersions = item.listOfDocumentVersoinDtos.filter((version: any) => {
              if (this.loggedUserRole === 'User') {
              return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
              } else if (this.loggedUserRole === 'SuperUser') {
              return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
              } else if (this.loggedUserRole === 'HOD') {
              return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
              } else if (this.loggedUserRole === 'Librarian' || this.loggedUserRole === 'Admin') {
                return true;
              }
              return false;
              });
                    
             return filteredVersions.length > 0 ? { ...item, listOfDocumentVersoinDtos: filteredVersions } : null;
             })
            .filter((item: null) => item !== null);

          this.fileListOne.forEach((item: any) => {
            if (item.documentType) {
              this.documentTypeSet.add(item.documentType);
            }
          });
          
          this.documentTypeList = Array.from(this.documentTypeSet);

   
          
          this.transformedMap = this.transformApiResponseToMap(this.fileListOne);


          this.firstRes = Array.from(this.transformedMap.values());
          this.totalData = this.firstRes.length;

          this.fullDataList = [...this.firstRes];
          this.filteredList = [...this.firstRes];
          this.paginateData(this.filteredList);
          this.calculateTotalPages(this.filteredList.length, this.pageSize);
          
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
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

        
        this.transformedMap.set(fileNameAsKey, this.valueObject);
  
        this.fileList = Array.from(this.transformedMap.values());
  
 
  }
  
  downloadDocument(doucmentUrl:any, item:any){
    this.loggedUserRole;
    this.loggedUserId = localStorage.getItem("loggedInUserId");
    this.loggedUserName = localStorage.getItem("loggedUserName");

  }
  
setFileUrl(fileUrl: any, fileName: any, fileSize: number, event: Event) {
  event.preventDefault(); // Prevents the modal from opening by default
  this.getFileName = fileName;
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
  
  const filteredData = this.fullDataList.filter((item: any) => item.documentType === docType);

  if(filteredData!='' ){
    this.filterRes = this.fullDataList.filter((item: any) => item.documentType === docType);

    // this.fullDataList = [...this.filterRes];
    this.filteredList = [...this.filterRes];
    this.paginateData(this.filteredList);
    this.calculateTotalPages(this.filteredList.length, this.pageSize);
  }
  else{
    this.filterRes = this.fullDataList;

    this.fullDataList = [...this.filterRes];
    this.filteredList = [...this.filterRes];
    this.paginateData(this.filteredList);
    this.calculateTotalPages(this.filteredList.length, this.pageSize);
  }
  }

// ****************************************************

public sortData(sort: Sort) {
  if (!sort.active || sort.direction === '') {
    return;
  }

  this.filteredList = this.filteredList.sort((a: any, b: any) => {
    const aValue = (a as any)[sort.active];
    const bValue = (b as any)[sort.active];

    return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
  });

  this.paginateData(this.filteredList);
}


public getMoreData(event: string): void {
  if (event === 'next' && this.currentPage < this.totalPages) {
    this.currentPage++;
  } else if (event === 'previous' && this.currentPage > 1) {
    this.currentPage--;
  }

  this.skip = (this.currentPage - 1) * this.pageSize;
  this.paginateData(this.filteredList);
}


public moveToPage(pageNumber: number): void {
  if (pageNumber < 1 || pageNumber > this.totalPages) return;

  this.currentPage = pageNumber;
  this.skip = (pageNumber - 1) * this.pageSize;

  this.paginateData(this.filteredList);
}



public searchData(value: string): void {
  const filterValue = value.trim().toLowerCase();

  // 🔹 Search within full dataset
  this.filteredList = this.fullDataList.filter((item: getfileList) => 
    item.fileName.toLowerCase().includes(filterValue)
  );
  this.skip = 0;
  this.calculateTotalPages(this.filteredList.length, this.pageSize);
  this.paginateData(this.filteredList);
}



private calculateTotalPages(totalData: number, pageSize: number): void {
  this.pageNumberArray = [];
  this.pageSelection = [];

  this.totalPages = Math.ceil(totalData / pageSize);

  for (let i = 1; i <= this.totalPages; i++) {
    const limit = pageSize * i;
    const skip = limit - pageSize;
    this.pageNumberArray.push(i);
    this.pageSelection.push({ skip: skip, limit: limit });
  }
}

private paginateData(data: getfileList[]): void {
  this.fileList = [];
  this.serialNumberArray = [];

  data.forEach((item, index) => {
    const serialNumber = index + 1;
    if (index >= this.skip && index < this.skip + this.pageSize) {
      item.id = serialNumber;
      this.fileList.push(item);
      this.serialNumberArray.push(serialNumber);
    }
  });

  this.dataSource = new MatTableDataSource<getfileList>([...this.fileList]);
}


public changePageSize(newPageSize: number): void {
  this.pageSize = newPageSize; 
  this.currentPage = 1;
  this.skip = 0;

  this.calculateTotalPages(this.filteredList.length, this.pageSize);
  this.paginateData(this.filteredList); 
}


  // ******************************************
  openFilter() {
    this.filter = !this.filter;
  }
  toggleFilterDropdown() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }
  fullscreen() {
    if (!document.fullscreenElement) {
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


  onMultipleSelect(event: { addedFiles: File[] }) {
    this.multipleFiles.push(...event.addedFiles);
    this.selectedFiles = this.multipleFiles;
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


  getDocumentTypeList() {
    this.loginService.getDocumentType().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
        
          const res = JSON.parse(decryptedData);
  
          this.documentTypeDataList = res || [];

        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
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

  onSubmit() {
    console.warn('Your data has been submitted', this.uploadFileForm.value);

    let modalData = {
      'uploadFile': this.uploadFileForm.controls['uploadFile'].value,
      'departmentName': this.uploadFileForm.controls['departmentName'].value,
      'isStatutoryDocument': this.uploadFileForm.controls['isStatutoryDocument'].value
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

  convertBytesToKB(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

}
