import { routes } from 'src/app/core/helpers/routes/routes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { DataService, getDeptList } from 'src/app/core/core.index';
import { DatePipe } from '@angular/common';
import { FileManagementService } from 'src/app/services/file-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewerType } from 'ngx-doc-viewer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';
import { pageSelection } from '../../subscriptions/subscribed-companies/subscribed-companies.component';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import Swal from 'sweetalert2';
import { el } from '@fullcalendar/core/internal-common';
declare let $: any;

@Component({
  selector: 'app-hod',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit{
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
    isLoading: boolean = false; 
    // pagination variables
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
    dataSource!: MatTableDataSource<getDeptList>;
    public contactlist: Array<getDeptList> = [];
    public totalPages = 0;
    public message: any;
    public selectedFiles: any;
    public uploadFileForm!: FormGroup ;
      public editClientForm!: FormGroup ;
    //  public multipleFiles: File[] = [];
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
    public mainHeadList: any[] = [];
    public departmentList: any[] = [];
    public subAreaList: any[] = [];
    public plantList: any[] = [];
    public disableSubmitBtn:boolean= false;
    public selectedCatName: any;
    //  public uploadDocumentFlag: boolean = false;
    //  public uploadDocumentSizeFlag: boolean = false;
     public documentTypeFlag: boolean = false;
     public fileNames: string[] = [];
     files: any[] = [];
     
     searchQuery: string = '';
     documentList: Array<{ displayText: string, referenceId: number }> = [];
     dataLoaded: boolean = false;
     selectedDocument: string = ''; // To store the selected document text
     documentId:any;
     departmentId:any;
     plant:any;
    plantId:any;
     startDate:any;
     endDate:any;
  
     remarks: string = '';
     selectedCatNameAbbr: any;
     selectedDeptCatNameAbbr: any;
     resp: any;
     msg: any;
     respData: any;
     selectFileData:any;
     loggedUserId:any;
     loggedSuperUserId:any;
     generatedBy:any;
     selectedFileUrl:any;
     allDeptList:any;
     selectedPlant:any;
  
    
  
  
  
    //** / pagination variables
    constructor(private data: DataService,private datePipe: DatePipe,private uploadDocument: UploadDocumentComponentService, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService : LoginComponentService) {
   
  
      this.bsRangeValue = [this.bsValue, this.maxDate];

      this.uploadFileForm = this.formBuilder.group({
         mainHead: ['', []],
        plants: ["", [Validators.required]],
        department: ["", [Validators.required]],
        departmentAbbr: ["", [Validators.required]],
       
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

      this.getDeptFileList()
    
      
    }
    
    formatDate(date: Date): string {
      return this.datePipe.transform(date, 'yyyy-MM-dd')!;
    }
  
  

  ngOnInit() {

    this.setLast15Days();
   
  }

  closeModalBtn() {
    this.uploadFileForm.get('plants')?.reset('');
    this.uploadFileForm.get('department')?.reset('');
    this.uploadFileForm.get('departmentAbbr')?.reset('');
  }




  onPlantSelect(event: any) {
    this.selectedPlant = event.value;
    if(this.selectedPlant == "CPP-2 (540MW)"){
      this.plantId = 1;}
    if(this.selectedPlant == "CPP-3 (1200MW)"){
      this.plantId = 2;}
     
    console.log('Selected Plant:', this.plantId);
    // You can perform any action here, like sending it to a service or storing in a variable.
  }


  getDeptFileList() {
    this.isLoading = true; // Start loader
    this.contactlist = [];
    this.serialNumberArray = [];

    this.uploadDocument.getDeptList(this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const respData = event.body.data;

          console.log("mrmrmrmrmrmr",respData);
          
  
          this.totalData = respData.length;

          respData.map((item: getDeptList, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            item.id = serialNumber;
            this.contactlist.push(item);
            this.serialNumberArray.push(serialNumber);
          }
        });

        this.dataSource = new MatTableDataSource<getDeptList>(this.contactlist);
        this.calculateTotalPages(respData.length, this.pageSize);
          
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




openModal(fileUrl: string , documentName : string) {
  this.approvedDocumentName = documentName;
  this.doc =  fileUrl;
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
          //console.log('API Response:', event.body);  
  
          if (event.body && event.body.data && Array.isArray(event.body.data)) {
            this.documentList = event.body.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department,  
              plant: doc.plant,
              fileName : doc.plant           
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
          //console.log('API Response:', event.body); 
  
          if (event.body && event.body.data && Array.isArray(event.body.data)) {
            this.documentList = event.body.data.map((doc: any) => ({
              displayText: `${doc.uniqueFileName} (${doc.docVersion})`,
              refernceId: doc.refernceId,
              department: doc.department, 
              plant: doc.plant,
              fileName : doc.fileName             
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
  





  onSubmit(): void {
    if (this.uploadFileForm.invalid) {
      console.log('Form is invalid');
      this.uploadFileForm.markAllAsTouched();
      this.unsuccessfulSubmitAlert();
      return;
    }

    const formData = this.uploadFileForm.value;
    const payload = {
      departmentName: formData.department,
      departmentAbbr: formData.departmentAbbr,
      plantId: this.plantId,
      headId: '1',
    };
    console.log(payload);
    

    this.uploadDocument.addDept(payload).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const res = event.body;
          this.uploadFileForm.get('mainHead')?.reset('');
          this.uploadFileForm.get('plants')?.reset('');
          this.uploadFileForm.get('department')?.reset('');
          this.uploadFileForm.get('departmentAbbr')?.reset('');
            this.successfulSubmitAlert();
        }
      },
      error: (err: any) => {
        console.error(err);
        this.unsuccessfulSubmitAlert();
      }
    });
  
    console.log('Payload:', payload);
  }
  
  public sortData(sort: Sort) {
    const data = this.contactlist.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
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
      this.getDeptFileList()
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getDeptFileList()
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
    this.getDeptFileList()
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
    this.getDeptFileList()
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


successfulSubmitAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "New Department is added",
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
  }).then(() => {

    window.location.reload();

  });;
}


}
