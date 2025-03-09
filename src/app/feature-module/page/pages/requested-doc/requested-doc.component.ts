import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getcontactlist } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { clientsDatas, companiesList } from 'src/app/core/core.index';
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, flatMap, Observable, ReplaySubject, Subject } from 'rxjs';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { encode } from 'base64-arraybuffer';

import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-requsted-doc',
  templateUrl: './requested-doc.component.html',
  styleUrl: './requested-doc.component.scss'
})
export class RequestedDocComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
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
  isLoading: boolean = false; 
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  dataSource!: MatTableDataSource<getcontactlist>;
  public contactlist: Array<getcontactlist> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup;
  public editClientForm!: FormGroup;
  public reasonFlag: boolean = false;
  public requestFileFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  public uploadDocumentSizeFlag: boolean = false;
  public getRole: any;
  public roleFlag: boolean = false;
  userName: string | undefined;
  base64String: any;
  public approvedDocumentName: any;
  doc: string = '';
  viewer: ViewerType = 'google';
  selectedType = 'xlsx';
  public requestedFileName: any
  res: any;
  public disableSubmitBtn: boolean = false;
  public documentTypeFlag: boolean = false;
  public fileNames: string[] = [];
  files: any[] = [];
  docView: any;
  searchQuery: string = '';
  documentList: Array<{ displayText: string, referenceId: number }> = [];
  dataLoaded: boolean = false;
  selectedDocument: string = ''; // To store the selected document text
  documentId: any;
  departmentId: any;
  plant: any;

  remarks: string = '';

  startDate: any;
  endDate: any;

  resp: any;
  msg: any;
  respData: any;
  selectFileData: any;
  loggedUserId: any;
  loggedSuperUserId: any;
  generatedBy: any;
  selectedFileUrl: any;
  subject = new BehaviorSubject('')






  //** / pagination variables
  constructor(private data: DataService,private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer, private datePipe: DatePipe, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService: LoginComponentService) {

    this.bsRangeValue = [this.bsValue, this.maxDate];

  }

  setLast7Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    this.bsRangeValue = [startDate, endDate];
    this.onDateRangeSelected();
  }

  onDateRangeSelected() {
    this.startDate = this.formatDate(this.bsRangeValue[0]);
    this.endDate = this.formatDate(this.bsRangeValue[1]);
    this.approvedDocumentList(localStorage.getItem('loggedInUserId'))
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  formatExecutedData(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy')!;
  }

  ngOnInit(): void {

    this.setLast7Days();

    this.loggedUserId = localStorage.getItem('loggedInUserId');
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




    // this.getTableData();

  }

  public approvedDocumentList(loggedUserId: any): void {
    this.contactlist = [];
    this.isLoading = true; // Start loader
    this.serialNumberArray = [];

    this.loginService.approvedDocList(loggedUserId, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const responseData = event.body.data;
          console.log(responseData);
          

          const filteredData = responseData.filter((item: getcontactlist) => item.documentApprovalStatus === 'A');

          this.totalData = filteredData.length;
          filteredData.map((item: getcontactlist, index: number) => {
            const serialNumber = index + 1;
            if (index >= this.skip && serialNumber <= this.limit) {
              item.id = serialNumber;
              this.contactlist.push(item);
              this.serialNumberArray.push(serialNumber);
            }
          });

          this.dataSource = new MatTableDataSource<getcontactlist>(this.contactlist);
          this.calculateTotalPages(filteredData.length, this.pageSize);
          this.isLoading = false; 
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
        this.isLoading = false; 
      }
    });
  }

  getStatusText(statusCode: string): string {
    switch (statusCode) {
      case 'A':
        return 'Approvedd';
      case 'R':
        return 'Rejected';
      case 'P':
        return 'Pending';
      default:
        return statusCode; // Fallback to the original status if no match
    }
  }

  downloadDocument(doucmentUrl:any, item:any){
      // this.loggedUserRole;
      // this.loggedUserId = localStorage.getItem("loggedInUserId");
      // this.loggedUserName = localStorage.getItem("loggedUserName");
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
    console.log("Opening modal for PDF:", fileUrl);
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

  // openModal(fileUrl: string, documentName: string) {

  //   this.approvedDocumentName = documentName;
  //   this.doc = fileUrl;

  // }
  onFocus(): void {
    if (!this.dataLoaded) {
      this.loadInitialData();
      this.dataLoaded = true;
    }
  }


  loadInitialData(): void {
    this.loginService.searchDocuments('').subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {

          if (event.body && event.body.data && Array.isArray(event.body.data)) {
            this.documentList = event.body.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department,
              plant: doc.plant,
              fileName: doc.plant
            }));
          } else {
            console.error('Unexpected response format:', event.body);
            this.documentList = [];
          }
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
      },
    });
  }

  onSearch(): void {
    this.loginService.searchDocuments(this.searchQuery).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.data && Array.isArray(event.body.data)) {
            this.documentList = event.body.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department,
              plant: doc.plant,
              fileName: doc.fileName
            }));
          } else {
            console.error('Unexpected response format:', event.body);
            this.documentList = [];
          }
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
      },
    });
  }




  selectDocument(doc: { displayText: string; refernceId: any; department: string; plant: string, fileName: string }): void {
    if (!doc) return;
    console.log(doc);
    
    this.documentId = doc.refernceId;
    this.departmentId = doc.department;
    this.plant = doc.plant;
    this.selectedDocument = doc.displayText;
    this.searchQuery = doc.displayText;
    this.documentList = [];

    if (this.documentId != null) {
      this.requestFileFlag = false
    }

  }














  // onFileDropped($event: any) {
  //   this.prepareFilesList($event);

  // }

  // fileBrowseHandler(files: any) {



  //   this.prepareFilesList(files.target.files);

  // }

  // deleteFile(index: number) {
  //   if (this['files'][index].progress < 100) {
  //     return;
  //   }
  //   this['files'].splice(index, 1);
  //   this.calculateTotalFileSize(this['files']);
  // }

  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this['files'].length) return;
  //     const progressInterval = setInterval(() => {
  //       if (this['files'][index].progress === 100) {
  //         clearInterval(progressInterval);
  //         this.uploadFilesSimulator(index + 1);
  //       } else {
  //         this['files'][index].progress += 5;
  //       }
  //     }, 50);
  //   }, 50);

  // }

  // prepareFilesList(files: Array<any>) {

  //   if (files != null) {
  //     this.uploadDocumentFlag = false;
  //     this.disableSubmitBtn = false;
  //   }
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.files.push(item);

  //     this.calculateTotalFileSize(this.files);
  //   }
  //   this.fileDropEl.nativeElement.value = "";
  //   this.uploadFilesSimulator(0);

  // }

  // getBase64EncodedFileData(file: File): Observable<string> {
  //   return new Observable(observer => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const { result } = reader;
  //       const data = result as ArrayBuffer;
  //       const base64Encoded = encode(data);

  //       observer.next(base64Encoded);
  //       observer.complete();
  //     };

  //     reader.onerror = () => {
  //       observer.error(reader.error);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // }

  // calculateTotalFileSize(files: Array<any>) {
  //   const fiftyMB = 2 * 1024 * 1024;
  //   let totalSize = 0;

  //   for (const file of files) {
  //     totalSize += file.size;
  //   }

  //   if (totalSize <= fiftyMB) {
  //     this['uploadDocumentSizeFlag'] = false;
  //   } else {
  //     this['uploadDocumentSizeFlag'] = true;
  //   }

  // }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


  public sortData(sort: Sort) {
    const data = this.contactlist.slice();
    if (!sort.active || sort.direction === '') {
      this.contactlist = data;
    } else {
      this.contactlist = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.contactlist = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.approvedDocumentList(this.loggedUserId);
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.approvedDocumentList(this.loggedUserId);
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
    this.approvedDocumentList(this.loggedUserId);
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
    this.approvedDocumentList(this.loggedUserId);
  }
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

  replaceDotsWithSlashes(name: string): string {
    return name.replace(/\./g, '/');
  }

}
function hideRequestFromButton() {
  throw new Error('Function not implemented.');
}




