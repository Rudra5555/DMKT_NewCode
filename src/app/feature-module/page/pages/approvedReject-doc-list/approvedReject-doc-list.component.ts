// import {Component, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import {DataTablesModule} from 'angular-datatables';
import { routes } from "src/app/core/helpers/routes/routes";
import { Component, OnInit } from "@angular/core";
import { FileManagementService } from "src/app/services/file-management.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UploadDocumentComponentService } from "src/app/services/upload-document-component.service";
import { LoginComponentService } from "src/app/services/login-component.service";
import Swal from "sweetalert2";
import { HttpResponse } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import {
  apiResultFormat,
  getApproveAndRejDoc,
} from "src/app/core/services/interface/models";
import { MatTableDataSource } from "@angular/material/table";
import { Sort } from "@angular/material/sort";
import { pageSelection } from "src/app/feature-module/employee/employees/departments/departments.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
declare let $: any;

export interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export const OPTIONS: Option[] = [
  {
    value: "fruits",
    label: "Fruits",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
];

@Component({
  selector: "app-approvedReject-doc-list",
  templateUrl: "./approvedReject-doc-list.component.html",
  styleUrls: ["./approvedReject-doc-list.component.scss"],
})
export class ApprovedRejectDocListComponent implements OnInit {
  // @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  public routes = routes;
  public message: any;
  public selectedFiles: any[] = [];
  public plantList: any[] = [];
  public fileNames: string[] = [];
  public uploadFileForm!: FormGroup;

  public rejectForm!: FormGroup;

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
  public storageLocationFlag: boolean = false;
  public mainHeadFlag: boolean = false;
  public plantFlag: boolean = false;
  public departmentFlag: boolean = false;
  public submitted: boolean = false;
  public uploadDocumentSizeFlag: boolean = false;
  public disableSubmitBtn: boolean = false;
  selectedCatNameAbbr: any;
  selectedDeptCatNameAbbr: any;
  selectedSubAreaCatNameAbbr: any;
  options: Option[] = OPTIONS;
  selectedValue: string | undefined;
  remarkControl = new FormControl("", [Validators.required]);
  loggedUserId: any;
  respData: any;
  // fileList: any;
  remarks: any;

  dataSource!: MatTableDataSource<getApproveAndRejDoc>;
  public contactlist: Array<getApproveAndRejDoc> = [];

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  // ***********
  workflowDocId: string | null = null;
  msg: any;
  res: any;
  startDate: any;
  endDate: any;
  // ***********

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
  public totalPages = 0;
  public filter = false;
  elem = document.documentElement;
  isFilterDropdownOpen: boolean = false;
  public searchDataValue = '';

  // ******************

  constructor(
    private uploadService: FileManagementService,
    private formBuilder: FormBuilder,
    private uploadDocument: UploadDocumentComponentService,
    private loginService: LoginComponentService,
    private datePipe: DatePipe
  ) {
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  setLast7Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);

    this.bsRangeValue = [startDate, endDate];
    this.onDateRangeSelected();
  }

  onDateRangeSelected() {
    this.startDate = this.formatDate(this.bsRangeValue[0]);
    this.endDate = this.formatDate(this.bsRangeValue[1]);
    this.approveAndRejDocList()


  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, "yyyy-MM-dd")!;
  }

  ngOnInit(): void {
    this.setLast7Days();
    // this.approveAndRejDocList()

    this.loggedUserId = localStorage.getItem("loggedInUserId");
  }

  public approveAndRejDocList(): void {
    this.contactlist = [];

    this.loginService
      .appAndRejFileList(this.startDate, this.endDate)
      .subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.res = event.body.data;
            // const AppAndRejDoclist=this.res;
            let filteredData = this.res;


            
            console.log("ccccccccccccccc",filteredData);
            


            filteredData.map((item: getApproveAndRejDoc, index: number) => {
              const serialNumber = index + 1;
              if (index >= this.skip && serialNumber <= this.limit) {
                item.id = serialNumber;
                this.contactlist.push(item);
                this.serialNumberArray.push(serialNumber);
              }
            });
  
            this.dataSource = new MatTableDataSource<getApproveAndRejDoc>(this.contactlist);
            this.calculateTotalPages(filteredData.length, this.pageSize);

          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.msg += " " + err.error.message;
          }
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

  // **************************************************************************
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
      this.approveAndRejDocList();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.approveAndRejDocList();
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
    this.approveAndRejDocList();
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
    this.approveAndRejDocList();
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


  // ************************************************************************************
}
