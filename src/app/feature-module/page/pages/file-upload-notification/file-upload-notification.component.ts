import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getreadFileNotificationList } from 'src/app/core/services/interface/models';
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


@Component({
  selector: 'app-file-upload-notification',
  templateUrl: './file-upload-notification.component.html',
  styleUrl: './file-upload-notification.component.scss'
})
export class FileUploadNotificationComponent implements OnInit {
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
  dataSource!: MatTableDataSource<getreadFileNotificationList>;
  public readFileNotificationList: Array<getreadFileNotificationList> = [];
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
  res: any;
  files: any[] = [];
  resp: any;
  msg: any;
  respData: any;
  loggedUserId: any;
  loggedSuperUserId: any;
  subject = new BehaviorSubject('')
  readFileList:any;
  public fullDataList:any;
  public filteredList:any;

  constructor(private data: DataService, private datePipe: DatePipe, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService: LoginComponentService) {

  }

  ngOnInit(): void { 
    this.markAsReadFilesNotif();
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

  public markAsReadFilesNotif(){
  this.readFileNotificationList = [];
    this.isLoading = true;
    
    const storedData = localStorage.getItem('fileUploadNotificationList');
    this.readFileList = storedData ? JSON.parse(storedData) : [];

    this.totalData=this.readFileList.length;
    
    this.fullDataList = [...this.readFileList];
    this.filteredList = [...this.readFileList];
    this.paginateData(this.filteredList);
    this.calculateTotalPages(this.filteredList.length, this.pageSize);


    this.isLoading = false; 

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
       this.filteredList = this.fullDataList.filter((item: getreadFileNotificationList) => 
         item.fileName.toLowerCase().includes(filterValue)||
       item.executedByName.toLowerCase().includes(filterValue)
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
   
     private paginateData(data: getreadFileNotificationList[]): void {
       this.readFileNotificationList = [];
       this.serialNumberArray = [];
     
       data.forEach((item, index) => {
         const serialNumber = index + 1;
         if (index >= this.skip && index < this.skip + this.pageSize) {
           item.id = serialNumber;
           this.readFileNotificationList.push(item);
           this.serialNumberArray.push(serialNumber);
         }
       });
     
       this.dataSource = new MatTableDataSource<getreadFileNotificationList>([...this.readFileNotificationList]);
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




