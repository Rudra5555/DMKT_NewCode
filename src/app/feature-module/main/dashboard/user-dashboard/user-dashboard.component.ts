import { Component, ElementRef, model, OnInit, viewChild, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes, url } from 'src/app/core/core.index';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { apiResultFormat, getSearchfileList } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';


// import { ViewerType } from 'ngx-doc-viewer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Sort } from '@angular/material/sort';

declare let $: any;


interface data{
  docName: string, docType: string, version: string, docSize: string, download?: string, view?: string;
}

interface DocumentData {
  docName: string;
  docType: string;
  version: string;
  docSize: string;
  download: string;
  view: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  @ViewChild("exaple") exaple!: UserDashboardComponent;
  @ViewChild('closebutton') closePlantModalBtn: any;
  @ViewChild('autoScroll') autoScroll!: ElementRef;

  public optionCategory: any;
  public getAllFilesForm!: FormGroup;
  public uname: any
  public flag: boolean = false;
  public visible: boolean = false;
  public fileList: any
  public modalFileList: any;
  public myData: any;
  public modalMyData: any;
  public skip = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public limit: number = this.pageSize;

  public fileListTmp!: Array<data>;
  public modalFileListTmp!: Array<data>;
  public cardColorList!: ['card1', 'card2', 'card3'];
  public searchTextVal: any;
  public routes = routes;
  public currentPage = 1;
  cardHide: boolean = true;
  documentNameSearch: boolean = true;
  optionArr: any;
  backButtonList: any = []
  categoryList = new Map();
  data: any[] = [];
  msg: string = '';
  allData: any[] = [];
  // fileListSearch: any[] = [];
  mainHeadName: any;
  plantType: any;
  dataset = new MatTableDataSource<DocumentData>();

  colors = ['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];
  searchKeyData: string = ''; 
  materials: any;
  randomItem!: string;
  searchFilterList: any;
  selected = 'Departments';
  headList: any[] = [];
  plantsList: any[] = [];
  plantsDataList: any[] = [];
  subAreaList: any[] = [];
  subAreaDataList: any[] = [];
  bsRangeValue: Date[] | undefined;

// ****************************************

  [x: string]: any;
  public searchDataValue = '';
  public filter = false;
  elem=document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  maxDate = new Date();
  // pagination variables
  public lastIndex = 0;
  public totalData = 0;
  public serialNumberArray: Array<number> = [];
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  res:any;

  dataSource!: MatTableDataSource<getSearchfileList>;
  public fileListSearch: Array<getSearchfileList> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup ;
    public editClientForm!: FormGroup ;
   public multipleFiles: File[] = [];
   public getRole:any;
  //  public fileList:any;
   public bigId:any;
   public roleFlag: boolean = false;

   departmentName:any;
   subAreaName: any;
   subAreaNameOnHeader:any;
   mainHead:any;
   plants:any;

   doc: string = '';
   viewer: ViewerType = 'google';
   selectedType = 'xlsx';

   startDate:any;
   endDate:any;

   loggedUserRole:any;

   respData:any;



  // public dataset!: Array<data>;
  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginComponentService, private datePipe: DatePipe) {

    

  }


  public getColor() {

    this.randomItem = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  



  ngOnInit(): void {
    let userIdd = localStorage.getItem('loggedUserId');


    this.optionCategory = "department"
    this.getDataByCategory(this.optionCategory);

    this.getAllCategory()
    this.allCategoryListHead();
    this.uname = localStorage.getItem("loggedUserName");



    this.getAllFilesForm = this.formBuilder.group({
      searchKeyData: ["", [Validators.required]],

    });
   

  }

  onClick(): void {
    this.autoScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  searchKey(data: string) {
    this.searchTextVal = data;
    alert(this.searchTextVal)
  }


  public updateDb(file: any) {
    var getData = this.getAllFilesForm.value.dropDownData;

  }



  public onSubmit() {


    this.optionCategory = this.getAllFilesForm.controls['dropDownData'].value

    this.getDataByCategory(this.optionCategory)


  }


  public searchText(searchTxt: string) {
    var getData = this.getAllFilesForm.value.dropDownData;


    if (searchTxt.length > 0) {
      this.modalMyData = this.modalFileList.filter((res: { name: string; }) => {

        return res.name.toLowerCase().includes(searchTxt.toLowerCase());
      });


    } else {
      this.modalMyData = this.modalFileListTmp;
    }
  }


  getDataByCategory(optionCategory: any) {
    this.loginService.getPlantList(optionCategory).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.data = event.body
          if (event.body && Array.isArray(event.body.categoryList)) {
            this.data = event.body.categoryList;
          } else {
            console.error("Unexpected response structure:", event.body);
          }
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    });
  }

  getAllCategory() {

    this.loginService.allCategoryList().subscribe({

      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.allData = event.body
          if (event.body && Array.isArray(event.body.categoryList.listCategoryInfoDtos)) {
            this.allData = event.body.categoryList.listCategoryInfoDtos;
          } else {
            console.error("Unexpected response structure:", event.body);
          }

        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    });
  }

  allCategoryListHead() {

    this.loginService.allCategoryListHead().subscribe({

      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.headList = event.body.categoryList.listCategoryInfoDtos
          console.log("main head::,",this.headList);
          
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    }

    );
  }
  getAllDtaForHide() {

    this.allCategoryListHead();
    this.cardHide = true;
    this.documentNameSearch = true;
  }

  backButton(id: any) {
    if (id == 'plants') {
      this.allCategoryListHead()
    } else {
      let ele = this.backButtonList[this.backButtonList.length - 2]
      this.headList = ele
    }


  }


  // ************getting main head details***************

  getDetailsByCateName(catName: any, catId: any) {

    if (catId == 'main-head') {
      this.categoryList.set(catId, catName);

      this.mainHeadName = catName;
    }


    if (catId == "plants") {
      this.cardHide = false;
      this.documentNameSearch = true;
      this.closePlantModalBtn.nativeElement.click();
    }

    this.loginService.getDetailsByCateName(catName, catId).subscribe({

      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.plantsList = event.body.categoryList.listCategoryInfoDtos;
          console.log(this.plantsList);
          
          this.backButtonList.push(this.headList)
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    });
  }

  // **************getting Plants name*******************

  getDetailsByPlantsName(catName: any, catId: any) {
    this.onClick();

    if (catId == 'plants') {
      this.categoryList.set(catId, catName);

      this.plantType = catName;
    }

    if (catId == "plants") {
      this.cardHide = false;
      this.documentNameSearch = true;
      this.closePlantModalBtn.nativeElement.click();
    }
    this.loginService.getDetailsByCateName(catName, catId).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.plantsList = event.body.categoryList
          console.log(this.plantsList);
          this.subAreaList = event.body.categoryList
          console.log(this.subAreaList);
          let subArea = event.body.categoryList
          if (event.body && Array.isArray(event.body.categoryList)) {
            this.data = event.body.categoryList;
          } else {
            console.error("Unexpected response structure:", event.body);
          }
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      }
    });
  }


  getDetailsByPlantsDataName(departmentName: string, subAreaName: string) {
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 15);

    this.bsRangeValue = [startDate, endDate];
    const startDt = this.formatDate(this.bsRangeValue[0]);
    const endDt = this.formatDate(this.bsRangeValue[1]);
    this.getFileListDetails(departmentName, subAreaName, this.categoryList, startDt, endDt)
  }

  getFileListDetails(departmentName: string, subAreaName: string, categoryList: Map<any, any>, startDate: any, endDate: any) {
    const mainHead = categoryList.get('main-head');
    const plants = categoryList.get('plants');
    

    this.loginService.getFileList(categoryList, departmentName, subAreaName, startDate, endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.fileList = event.body.documentLists;
          const encodedFileList = encodeURIComponent(JSON.stringify(this.fileList));
          this.router.navigate([routes.filemanager], { queryParams: { fileList: encodedFileList, DepartmentName: departmentName, subAreaName: subAreaName, mainHead: mainHead, plants: plants } });
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  navigateToRoute(catMainHeadName: any, catMainHeadId: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([routes.filemanagermainhead], {
        queryParams: { catName: catMainHeadName, catId: catMainHeadId }
      })
    );
    window.location.href = url;

  }

  

 
  public sortData(sort: Sort) {
    const data = this.fileListSearch.slice();
    if (!sort.active || sort.direction === '') {
      this.fileListSearch = data;
    } else {
      this.fileListSearch = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.fileListSearch = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      // this.allSubAreaList();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      // this.allSubAreaList();
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
    // this.allSubAreaList();
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
    // this.allSubAreaList();
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




  fileNameSearch(): void {
    const searchValue = this.getAllFilesForm.get('searchKeyData')?.value?.trim() || '';
    
    if (searchValue) {
      this.cardHide = true;
      this.documentNameSearch = false;
      console.log(searchValue);

      this.fileListSearch = [];
      this.serialNumberArray = [];

      this.loginService.allSearch(searchValue).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            this.res = event.body.documentLists;
            this.fileListSearch=this.res;

            this.totalData = this.fileListSearch.length;
  
            const convertToKB = (bytes: number): string => {
              return (bytes / 1024).toFixed(2);
            };

            this.fileListSearch.map((item: getSearchfileList, index: number) => {
              const serialNumber = index + 1;
              if (index >= this.skip && serialNumber <= this.limit) {
                item.id = serialNumber;
                this.serialNumberArray.push(serialNumber);
              }
            });
    
            this.dataSource = new MatTableDataSource<getSearchfileList>(this.fileListSearch);
            this.calculateTotalPages(this.fileListSearch.length, this.pageSize);
    
            // fileListSearch.forEach((item: any) => {
            //   item.selectedVersion = this.getLatestVersion(item.listOfDocumentVersoinDtos);
            //   item.listOfDocumentVersoinDtos.forEach((version: any) => {
            //     version.fileSizeKB = convertToKB(parseInt(version.fileSize, 10));
            //   });
            // });
    
            // if (fileListSearch.length > 0 && fileListSearch[0].selectedVersion) {
            //   this.doc = fileListSearch[0].selectedVersion.fileUrl;
            // }
          console.log("ffffffffff",this.fileListSearch);

            
            
          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.msg += " " + err.error.message;
          }
        },
      });


    } else {
      console.log("Enter a value");
    }
  }
  


  getLatestVersion(versions: any[]): any {
    return versions.reduce((latest, version) => {
      return new Date(version.versionReleaseDate) > new Date(latest.versionReleaseDate) ? version : latest;
    });
  }
  
  
  onVersionChange(item: any, selectedVersion: any) {
  
    item.selectedVersion = selectedVersion;
  
    if (item.selectedVersion) {
      item.newUniqueFileName = item.selectedVersion.newUniqueFileName; 
      this.doc = item.selectedVersion.fileUrl; 
      console.log(`Version changed to: ${item.selectedVersion.versionName}, File Name: ${item.newUniqueFileName}`);
    }
  }
  
  
  convertBytesToKB(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

}