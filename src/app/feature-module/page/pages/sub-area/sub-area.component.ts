import { routes } from 'src/app/core/helpers/routes/routes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { DataService, getRecentDocument } from 'src/app/core/core.index';
import { DatePipe } from '@angular/common';
import { FileManagementService } from 'src/app/services/file-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewerType } from 'ngx-doc-viewer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Sort } from '@angular/material/sort';

import { Observable } from 'rxjs';
import { pageSelection } from '../../subscriptions/subscribed-companies/subscribed-companies.component';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
declare let $: any;

@Component({
  selector: 'app-sub-area',
  templateUrl: './sub-area.component.html',
  styleUrls: ['./sub-area.component.scss']
})
export class SubAreaComponent implements OnInit{
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
    dataSource!: MatTableDataSource<getRecentDocument>;
    public contactlist: Array<getRecentDocument> = [];
    public totalPages = 0;
    public message: any;
    public selectedFiles: any;
    public uploadFileForm!: FormGroup ;
      public editClientForm!: FormGroup ;
      public plantOption: any;
      public selectedDeptCatName: any;
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
     public departmentFlag: boolean = false;
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
    //  public requestProof : any
    // subject = new BehaviorSubject('')
  
  
    
  
  
  
    //** / pagination variables
    constructor(private data: DataService,private datePipe: DatePipe,private uploadDocument: UploadDocumentComponentService, _uploadService: FileManagementService, private formBuilder: FormBuilder, private loginService : LoginComponentService) {
   
  
      this.bsRangeValue = [this.bsValue, this.maxDate];

      this.uploadFileForm = this.formBuilder.group({
           mainHead: ['', Validators.required],
        plants: ["", [Validators.required]],
        department: ["", [Validators.required]],
        subArea: ["", [Validators.required]],
        subAreaAbbr: ["", [Validators.required]],
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
  
  
      //  this.getFileListDetails()
    
      
    }
    
    formatDate(date: Date): string {
      return this.datePipe.transform(date, 'yyyy-MM-dd')!;
    }
  
  

  ngOnInit() {

 
    this.setLast15Days();
    

   this.getRole = localStorage.getItem('role');
   if(this.getRole == "Admin"){
    this.roleFlag = true;
    
    //console.log(this.roleFlag)
  }if(this.getRole == "Librarian"){
    this.roleFlag = true;
  }if(this.getRole == "User"){
    this.roleFlag = false;
    //console.log(this.roleFlag)
  }if(this.getRole == "SuperUser"){
    this.roleFlag = false;
    //console.log(this.roleFlag)
  }if(this.getRole == "Hod"){
    this.roleFlag = false;
    //console.log(this.roleFlag)
  }



    
    // this.getTableData();
    // this.getFileListDetails()
  

    this.uploadFileForm.get('mainHead')?.valueChanges.subscribe(value => {
      const [catName, abbreviation] = value.split('~');
      this.selectedCatName = catName;
      this.selectedCatNameAbbr = abbreviation
console.log(this.selectedCatName,this.selectedCatNameAbbr);

      // if (catName != 'POWER O&M') {
      //   this.plantList = [];
      //   this.departmentList = [];
      //   this.subAreaList = [];
      // }
      this.getMainHeadList(catName, "main-head");

    });

    this.getAllMainHeadData();
    
    this.uploadFileForm.get('plants')?.valueChanges.subscribe(value => {
      if (value != null) {
        this.getAllPlantList(value, "plants");
        this.plantOption = value;
      } else {
        console.log("No plant selected or value is null.");

      }
    });


    this.uploadFileForm.get('department')?.valueChanges.subscribe(value => {
      const [deptName, deptAbbr] = value.split('~');
      // this.getSubAreaList(deptName, "department");
      this.selectedDeptCatName = deptName;
      this.selectedDeptCatNameAbbr = deptAbbr;

    });
 
  }


  getAllMainHeadData() {
    this.uploadDocument.allMainHeadList().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.mainHeadList = event.body?.categoryList || [];

        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }


  getMainHeadList(selectedValue: string, mainHead: string) {
console.log(selectedValue,mainHead);

    if (selectedValue != '' && mainHead != null) {

      this.uploadDocument.allDataList(selectedValue, mainHead).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.plantList = event.body?.categoryList || [];
            console.log(this.plantList);
            
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  getAllPlantList(selectedValue: string, plantHeader: string) {

    if (selectedValue != '' && plantHeader != null) {
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
  }

  selectedDepartment(event: any) {
    const [catName, abbreviation] = event.value.split('~');
    this.selectedDeptCatName = catName;
    this.selectedDeptCatNameAbbr = abbreviation;
    if (this.selectedDeptCatName != null) {
      this.departmentFlag = false;
    }

    if (this.selectedDeptCatName !== null && this.selectedDeptCatName !== undefined) {
      this.getSubAreaList(this.selectedDeptCatName, "department");
    } else {
      console.log("selectedDeptCatName is null or undefined.");
    }
  }
  getSubAreaList(selectedValue: string, departmentHeader: string) {
    if (selectedValue != '' && departmentHeader != null) {
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
  }

  getFileListDetails() {
    this.contactlist = [];
    this.serialNumberArray = [];

    this.loginService.AllAdminFileList(this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.respData = event.body.response;

          let filteredData = this.respData;

          console.log("mnmnmnmnmnmnmnm",filteredData);
          
          if(this.contactlist.length == 0){
            this.noRecordFlag = true;
          }
  
          this.totalData = this.respData.length;

          const convertToKB = (bytes: number): number => {
            return Math.round(bytes / 1024);
          };

        filteredData.map((item: getRecentDocument, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            item.id = serialNumber;
            this.contactlist.push(item);
            this.serialNumberArray.push(serialNumber);
          }
        });

        this.dataSource = new MatTableDataSource<getRecentDocument>(this.contactlist);
        this.calculateTotalPages(filteredData.length, this.pageSize);
          
  
  
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
      },
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
      return statusCode; 
  }
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
  






  // onSubmit(){

  //   const selectedPlant = this.uploadFileForm.get('plants')?.value;
  //   console.log('Selected Plant:', selectedPlant);

  //   const departmentName =  this.uploadFileForm.get('department')?.value;
  // console.log(departmentName);
  
    
  // }


  onSubmit(): void {
    if (this.uploadFileForm.invalid) {
      console.log('Form is invalid');
      this.uploadFileForm.markAllAsTouched();
      return;
    }
  
    const formData = this.uploadFileForm.value;
  
    const selectedMainHead = this.mainHeadList.find(
      (item) => item.optionVal === formData.mainHead
    );
   console.log(selectedMainHead);
   
  
    const selectedPlant = this.plantList.find(
      (item) => item.catName === formData.plants
    );  
  

    const selectedDepartment = this.departmentList.find(
      (item) => item.catName === formData.department
    ); 



    const headId = selectedMainHead?.catId || null;
  
    const plantId = selectedPlant?.catId || null;

    const departmentId = selectedDepartment?.catId || null;
  
    const payload = {
      subArea: formData.subArea,
      subAreaAbbr: formData.subAreaAbbr,
      plantId: plantId,
      headId: headId,
      departmentId: departmentId,
    };

    this.uploadDocument.addSubArea(payload).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const res = event.body;
          console.log("huuuuuuuuuu",res);
          
        }
      },
      error: (err: any) => {
        console.error(err);
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

}
