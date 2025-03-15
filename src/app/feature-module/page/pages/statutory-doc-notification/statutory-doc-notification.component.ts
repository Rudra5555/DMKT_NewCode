import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getReadNotificationList } from 'src/app/core/services/interface/models';
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
  selector: 'app-statutory-doc-notification',
  templateUrl: './statutory-doc-notification.component.html',
  styleUrl: './statutory-doc-notification.component.scss'
})
export class StatutoryDocNotificationComponent implements OnInit {
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
  dataSource!: MatTableDataSource<getReadNotificationList>;
  public readNotificationList: Array<getReadNotificationList> = [];
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

  statutoryReadNotificationList:any;

  //** / pagination variables
  constructor(private data: DataService, private datePipe: DatePipe, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService: LoginComponentService) {

    this.bsRangeValue = [this.bsValue, this.maxDate];

  }

  ngOnInit(): void {
    this.StDocmarkAsReadNotif();

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

  public StDocmarkAsReadNotif(){
    this.readNotificationList = [];
    this.serialNumberArray = [];
    this.isLoading = true;
    const storedData = localStorage.getItem('statutoryReadNotificationList');
    const statutoryReadNotificationList = storedData ? JSON.parse(storedData) : [];

    this.totalData = statutoryReadNotificationList.length;

    statutoryReadNotificationList.map((item: getReadNotificationList, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        item.id = serialNumber;
        this.readNotificationList.push(item);
        this.serialNumberArray.push(serialNumber);
      }
    });

    this.dataSource = new MatTableDataSource<getReadNotificationList>(this.readNotificationList);
    this.calculateTotalPages(statutoryReadNotificationList.length, this.pageSize);
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

  public sortData(sort: Sort) {
    const data = this.readNotificationList.slice();
    if (!sort.active || sort.direction === '') {
      this.readNotificationList = data;
    } else {
      this.readNotificationList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.readNotificationList = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
   
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.StDocmarkAsReadNotif();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.StDocmarkAsReadNotif();
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
    this.StDocmarkAsReadNotif();
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
    this.StDocmarkAsReadNotif();
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



