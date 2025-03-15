import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getRecentDocument } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { clientsDatas, companiesList} from 'src/app/core/core.index';
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, flatMap, Observable, ReplaySubject, Subject } from 'rxjs';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { encode } from 'base64-arraybuffer';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import Swal from 'sweetalert2';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-lib-recent-uploaded',
  templateUrl: './lib-recent-uploaded.component.html',
  styleUrl: './lib-recent-uploaded.component.scss'
})
export class LibRecentUploadedComponent implements OnInit {
@ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
[x: string]: any;
  public searchDataValue = '';
  public routes = routes
  public filter = false;
  elem=document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  public noRecordFlag: boolean = false;
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
  dataSource!: MatTableDataSource<getRecentDocument>;
  public contactlist: Array<getRecentDocument> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup ;
  public editClientForm!: FormGroup ;
  public reasonFlag: boolean = false;
  public requestFileFlag: boolean = false;
  public uploadDocumentFlag: boolean = false;
  public uploadDocumentSizeFlag: boolean = false;
  public getRole:any;
  public roleFlag: boolean = false;
  userId: number | undefined;
  userName: string | undefined;
  base64String:any;
  public approvedDocumentName: any;
  doc: string = '';
  viewer: ViewerType = 'google';
  selectedType = 'xlsx';
  public requestedFileName: any
  res: any;
  isLoading: boolean = false; 
  public disableSubmitBtn:boolean= false;
  public documentTypeFlag: boolean = false;
  public fileNames: string[] = [];
  files: any[] = [];
   
  searchQuery: string = '';
  documentList: Array<{ displayText: string, referenceId: number }> = [];
  dataLoaded: boolean = false;
  selectedDocument: string = '';
  documentId:any;
  departmentId:any;
  plant:any;

   startDate:any;
   endDate:any;

   remarks: string = '';

   resp: any;
   msg: any;
   respData: any;
   selectFileData:any;
   loggedUserId:any;
   loggedSuperUserId:any;
   generatedBy:any;
   selectedFileUrl:any;

   public fullDataList:any;
   public filteredList:any;
 
  subject = new BehaviorSubject('')

  constructor(private data: DataService,private datePipe: DatePipe, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService : LoginComponentService) {
 
  this.bsRangeValue = [this.bsValue, this.maxDate];
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

  ngOnInit(): void {
  
    this.setLast15Days();
    
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
    this.contactlist = [];

    this.loginService.AllAdminFileList(this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.res = event.body.response;

          this.totalData=this.res.length;
          
          this.fullDataList = [...this.res];
          this.filteredList = [...this.res];
          this.paginateData(this.filteredList);
          this.calculateTotalPages(this.filteredList.length, this.pageSize);
          
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

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


// ***************************************
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
     this.filteredList = this.fullDataList.filter((item: getRecentDocument) => 
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
 
   private paginateData(data: getRecentDocument[]): void {
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
   
     this.dataSource = new MatTableDataSource<getRecentDocument>([...this.contactlist]);
   }
 
   
   public changePageSize(newPageSize: number): void {
     this.pageSize = newPageSize; 
     this.currentPage = 1;
     this.skip = 0;
   
     this.calculateTotalPages(this.filteredList.length, this.pageSize);
     this.paginateData(this.filteredList); 
   }
   
  // *****************************************
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

 
}
function hideRequestFromButton() {
  throw new Error('Function not implemented.');
}

