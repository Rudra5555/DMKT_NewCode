import { ChangeDetectorRef, Component, ElementRef, model, OnInit, viewChild, ViewChild } from '@angular/core';
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


import { ViewerType } from 'ngx-doc-viewer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Sort } from '@angular/material/sort';
import { AES } from 'crypto-ts';
import * as CryptoJS from 'crypto-js';

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
  dataset = new MatTableDataSource<any>();

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
  timestamp: string ='';
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

  //  ****************************
  transformedMap: Map<string, any> = new Map();

  documentTypeSet = new Set<string>();
  documentTypeList:any;

  resultMap:any;

  valueObject:any;
  finalList:any;

  fileListOne:any;

  copyDataList:any;
  fileListRes:any;



  // public dataset!: Array<data>;
  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginComponentService, private datePipe: DatePipe,private cdr: ChangeDetectorRef) {

    

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
console.log("catName555",catName);

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
          try {
            if (event.body?.documentLists) {
              this.fileList = event.body.documentLists;
        
              // Use the timestamp as the secret key
              const secretKey = this.timestamp;
        
              // Encrypt the fileList using AES encryption
              const encryptedParam = CryptoJS.AES.encrypt(
                JSON.stringify(this.fileList),
                secretKey
              ).toString();
        
              console.log("Encrypted fileList:", encryptedParam);
        
              // Navigate to the route with the encrypted query parameter
              this.router.navigate([routes.filemanager], {
                queryParams: {
                  param: encryptedParam,
                  DepartmentName: departmentName,
                  subAreaName: subAreaName,
                  mainHead: mainHead,
                  plants: plants,
                },
              });
            } else {
              console.error("documentLists not found in the response body.");
            }
          } catch (error) {
            console.error("Error processing the response: ", error);
          }
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



  navigateToRoute(catPlantName: any, catMainHeadId: any) {
    console.log("Main Head Name 55555", this.mainHeadName);

    
    
    try {
  
      const secretKey = this.timestamp; // Ensure this is defined and valid
  
      // Encrypt the parameters
      const encryptedMainHadNAme = CryptoJS.AES.encrypt(this.mainHeadName, secretKey).toString();
      const encryptedPlantName = CryptoJS.AES.encrypt(catPlantName, secretKey).toString();
  
      // Create the URL with encrypted query parameters
      const url = this.router.serializeUrl(
        this.router.createUrlTree([routes.filemanagermainhead], {
          queryParams: { mainHeadName: encryptedMainHadNAme, plantName: encryptedPlantName }
        })
      );
  
      // Navigate to the URL
      window.location.href = url;
    } catch (error) {
      console.error("Error processing navigation with encryption:", error);
    }
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



  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;

    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
     
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



  
  public performSearch(): void {
    const searchValue = this.searchDataValue?.trim().toLowerCase() || ''; // Convert search value to lowercase
  
    if (searchValue) {
      if (this.dataSource) {
        // Define a filter predicate to match the word in `newUniqueFileName`
        this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
          const fileName = data.newUniqueFileName?.toLowerCase() || ''; // Convert `newUniqueFileName` to lowercase
          return fileName.includes(filter); // Check if the file name contains the search word
        };
  
        // Apply the filter
        this.dataSource.filter = searchValue; // Triggers the filterPredicate
        this.fileListSearch = this.dataSource.filteredData; // Get filtered data
  
        console.log("Filtered local data:", this.fileListSearch);
        // this.cdr.detectChanges();
      } else {
        console.warn('dataSource is undefined. Proceeding with server search.');
      }
  
      // Server-side search
      this.cardHide = true;
      this.documentNameSearch = false;
  
      this.loginService.allSearch(searchValue).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const res = event.body.documentLists;
            this.fileListRes = res;
  
            this.transformedMap = this.transformApiResponseToMap(this.fileListRes);
            this.fileListSearch = Array.from(this.transformedMap.values());
  
            // Update the dataSource with server response
            this.dataSource = new MatTableDataSource<getSearchfileList>(this.fileListSearch);
  
            // Reapply the filter predicate for server response
            this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
              const fileName = data.newUniqueFileName?.toLowerCase() || '';
              return fileName.includes(filter); // Match the search word in the file name
            };
  
            // Apply the filter again
            this.dataSource.filter = searchValue;
  
            console.log("Updated data source with server response:", this.fileListSearch);
          }
        },
        error: (err: any) => {
          if (err.error && err.error.message) {
            this.msg += " " + err.error.message;
          }
        },
      });
    } 
    
    
    
    else {
      console.log("Enter a value");
    }
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


  getLatestVersion(versions: any[]): any {
    return versions.reduce((latest, version) => {
      return new Date(version.versionReleaseDate) > new Date(latest.versionReleaseDate) ? version : latest;
    });
  }
  
  
  onVersionChange(item: any,fileNameAsKey:any, selectedVersion: any) {

    let selectedVersionDetails = selectedVersion;
    let version=selectedVersion.versionName;

    // console.log("nhhhhhhnhnhnhmdhf:::",item);
    
  
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
  
     
       
  
        console.log("value object uuuuuuuuuuuNNNNNNNNN",this.valueObject);
        
        this.transformedMap.set(fileNameAsKey, this.valueObject);
  
        this.fileListSearch = Array.from(this.transformedMap.values());
  
       //tetsting
  
  }

  setFileUrl(fileUrl:any){
    // alert("jiiii")
    console.log(fileUrl);
    
      this.doc=fileUrl;
      
    
    }
    
    buttonClose(){
      this.doc=''
    }
  
  
  convertBytesToKB(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

}