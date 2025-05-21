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
  getFileName: any;
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
  selectedDocument: string = '';
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
  public filteredList:any;
  public fullDataList:any;
  public filteredApprovedData:any;
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

  // formatExecutedData(date: string): string {
  //   return this.datePipe.transform(date, 'dd-MM-yyyy')!;
  // }
formatExecutedData(dateStr: string): string {
  if (!dateStr) return '';

  // Input format: "21/05/25, 12:00 am"
  const [datePart] = dateStr.split(',');
  const [yy, mm, dd] = datePart.split('/').map(part => parseInt(part, 10));

  const fullYear = 2000 + yy; // Assumes 21 => 2021

  // Reconstruct as DD-MM-YYYY
  const formattedDate = `${dd.toString().padStart(2, '0')}-${mm.toString().padStart(2, '0')}-${fullYear}`;
  return formattedDate;
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

  }

  public approvedDocumentList(loggedUserId: any): void {
    this.contactlist = [];
    this.isLoading = true; // Start loader
   

    this.loginService.approvedDocList(loggedUserId, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          const responseData = res.data;
         
          this.filteredApprovedData = responseData.filter((item: getcontactlist) => item.documentApprovalStatus === 'A');
          console.log("Filtered Approved Data:", this.filteredApprovedData);
          

          this.totalData=this.filteredApprovedData.length;
          
          this.fullDataList = [...this.filteredApprovedData];
          this.filteredList = [...this.filteredApprovedData];
          this.paginateData(this.filteredList);
          this.calculateTotalPages(this.filteredList.length, this.pageSize);
          
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
        return 'Approved';
      case 'R':
        return 'Rejected';
      case 'P':
        return 'Pending';
      default:
        return statusCode; // Fallback to the original status if no match
    }
  }

  downloadDocument(doucmentUrl:any, item:any){

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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          if (res && res.data && Array.isArray(res.data)) {
            this.documentList = res.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department,
              plant: doc.plant,
              fileName: doc.plant
            }));
          } else {
            console.error('Unexpected response format:', res);
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          if (res && res.data && Array.isArray(res.data)) {
            this.documentList = res.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department,
              plant: doc.plant,
              fileName: doc.fileName
            }));
          } else {
            console.error('Unexpected response format:', res);
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

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


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
      this.filteredList = this.fullDataList.filter((item: getcontactlist) => 
        item.uniqueDocumentName.toLowerCase().includes(filterValue)
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
  
    private paginateData(data: getcontactlist[]): void {
      this.contactlist = [];
      this.serialNumberArray = [];
    
      data.forEach((item, index) => {
        const serialNumber = index + 1;
        if (index >= this.skip && index < this.skip + this.pageSize) {
          item.id = serialNumber;
          this.contactlist.push(item);
          
          
          this.serialNumberArray.push(serialNumber);
        }
      });
    
      this.dataSource = new MatTableDataSource<getcontactlist>([...this.contactlist]);
    }
  
    
    public changePageSize(newPageSize: number): void {
      this.pageSize = newPageSize; 
      this.currentPage = 1;
      this.skip = 0;
    
      this.calculateTotalPages(this.filteredList.length, this.pageSize);
      this.paginateData(this.filteredList); 
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




