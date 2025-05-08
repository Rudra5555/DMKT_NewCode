import { ChangeDetectorRef, Component, ElementRef, model, OnInit, viewChild, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes, url } from 'src/app/core/core.index';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { apiResultFormat, getSearchfileList } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bootstrapApplication, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ViewerType } from 'ngx-doc-viewer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Sort } from '@angular/material/sort';
import { AES } from 'crypto-ts';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

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
  public fileListUK: any
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
  getFileName: any;
  documentNameSearch: boolean = true;
  optionArr: any;
  backButtonList: any = []
  categoryList = new Map();
  data: any[] = [];
  msg: string = '';
  allData: any[] = [];
  mainHeadName: any;
  plantType: any;
  dataset = new MatTableDataSource<any>();

  // colors = ['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];
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

  [x: string]: any;
  public searchDataValue = '';
  public filter = false;
  elem=document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  maxDate = new Date();
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
   public bigId:any;
   public roleFlag: boolean = false;

   departmentName:any;
   subAreaName: any;
   subAreaNameOnHeader:any;
   mainHead:any;
   plants:any;
   docView: SafeResourceUrl | null = null;
   viewer: ViewerType = 'google';
   selectedType = 'xlsx';
   startDate:any;
   endDate:any;
   loggedUserRole:any;
   respData:any;

  transformedMap: Map<string, any> = new Map();

  documentTypeSet = new Set<string>();
  documentTypeList:any;
  resultMap:any;
  valueObject:any;
  finalList:any;
  fileListOne:any;
  copyDataList:any;
  fileListRes:any;

  public fullDataList:any;
  public filteredList:any;

  // public dataset!: Array<data>;
  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginComponentService, private datePipe: DatePipe,private cdr: ChangeDetectorRef,private sanitizer: DomSanitizer) {
  }


  // public getColor() {
  //   this.randomItem = this.colors[Math.floor(Math.random() * this.colors.length)];
  // }

  ngOnInit(): void {
    this.loggedUserRole = localStorage.getItem('role');

    this.optionCategory = "department"
    this.getDataByCategory(this.optionCategory);

    this.getAllCategory()
    this.allCategoryListHead();
    this.uname = localStorage.getItem("loggedUserName");

    this.getAllFilesForm = this.formBuilder.group({
      searchKeyData: ["", [Validators.required]],

    });

    // const rawUrl = 'https://example.com/path-to-doc'; // Replace with your real URL
    // this.docView = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  
    
  }

  getManualLink(role: string): string {
    switch (role) {
      case 'Admin':
        return 'assets/files/KCDQuickGuide.pdf';
      case 'User':
        return 'assets/files/KCDQuickGuide.pdf';
      case 'Librarian':
        return 'assets/files/KCDQuickGuide.pdf';
      case 'SuperUser':
        return 'assets/files/KCDQuickGuide.pdf';
      case 'HOD':
        return 'assets/files/KCDQuickGuide.pdf';
      default:
        return 'javascript:void(0);'; // Default case if role is not matched
    }
  }

  getTopImage(departmentName: string): string {
    const topImages: { [key: string]: string } = {
      OPERATION: 'assets/img/areaImage1.JPG',
      MECHANICAL: 'assets/img/DSC_5538.JPG',
      ELECTRICAL: 'assets/img/DSC_0070.JPG',
      "C&I": 'assets/img/DSC_5538.JPG',
      CIVIL: 'assets/img/DSC_0070.JPG',
      CHP: 'assets/img/DSC_5538.JPG',
      AHP: 'assets/img/DSC_5538.JPG',
    };
    return topImages[departmentName] || 'assets/img/DSC_5538.JPG'; // Default image
  }
  
  getAvatarImage(departmentName: string): string {
    const avatarImages: { [key: string]: string } = {
      OPERATION: 'assets/img/Power-O&M.jpg',
      "ASH-DYKE": 'assets/img/Ash-Dyke.jpg',
      ELECTRICAL: 'assets/img/Power-Sale.jpg',
      MECHANICAL: 'assets/img/Ash-Dyke.jpg',
      "C&I": 'assets/img/Plant-Infra.jpg',
      CIVIL: 'assets/img/Coal-Commercial.jpg',
      CHP: 'assets/img/Plant-Infra.jpg',
      AHP: 'assets/img/Power-Sale.jpg',
    };
    return avatarImages[departmentName] || 'assets/img/Power-Sale.jpg'; // Default avatar
  }

  getFontSize(listLength: number): string {
    if (listLength > 15) return '0.6rem';
    if (listLength > 10) return '0.6rem';
    if (listLength > 6) return '0.7rem';
    return '0.8rem';
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.data = res
          if (res && Array.isArray(res.categoryList)) {
            this.data = res.categoryList;
          } else {
            console.error("Unexpected response structure:", res);
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.allData = res
          if (res && Array.isArray(res.categoryList.listCategoryInfoDtos)) {
            this.allData = res.categoryList.listCategoryInfoDtos;
          } else {
            console.error("Unexpected response structure:", res);
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.headList = res.categoryList.listCategoryInfoDtos
   
          
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.plantsList = res.categoryList.listCategoryInfoDtos;
          // console.log(this.plantsList);
          
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.plantsList = res.categoryList
          if(this.plantsList.length==0){
            this.navigateToRoute(catName,catId);
          }
          // console.log(this.plantsList);
          if (res && Array.isArray(res.categoryList)) {
            this.data = res.categoryList;
          } else {
            console.error("Unexpected response structure:", res);
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
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);
          try {
            if (res?.documentLists) {
              this.fileListUK = res.documentLists;
        
              // Use the timestamp as the secret key
              const secretKey = this.timestamp;
        
              // Encrypt the fileList using AES encryption
              const encryptedParam = CryptoJS.AES.encrypt(
                JSON.stringify(this.fileListUK),
                secretKey
              ).toString();
        
              // console.log("Encrypted fileList:", encryptedParam);
        
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
    
      // Server-side search
      this.cardHide = true;
      this.documentNameSearch = false;
  
      this.loginService.allSearch(searchValue).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const decryptedData = this.loginService.convertEncToDec(event.body);
            const resData = JSON.parse(decryptedData);

            const res = resData.documentLists;
            this.fileListRes = res;

            this.fileListOne = this.fileListRes.map((item: any) => {
              const filteredVersions = item.listOfDocumentVersoinDtos.filter((version: any) => {
                if (this.loggedUserRole === 'User') {
                  return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
                } else if (this.loggedUserRole === 'SuperUser') {
                  return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
                } else if (this.loggedUserRole === 'HOD') {
                  return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
                } else if (this.loggedUserRole === 'Librarian' || this.loggedUserRole === 'Admin') {
                  return true;
                }
                return false;
              });
              
                return filteredVersions.length > 0 ? { ...item, listOfDocumentVersoinDtos: filteredVersions } : null;
              })
              .filter((item: null) => item !== null);
  
            this.transformedMap = this.transformApiResponseToMap(this.fileListOne);

            this.fileListSearch = Array.from(this.transformedMap.values());

            this.totalData = this.fileListSearch.length;
          
            // this.fullDataList = [...this.fileListSearch];
            this.filteredList = [...this.fileListSearch];
            this.paginateData(this.filteredList);
            this.calculateTotalPages(this.filteredList.length, this.pageSize);
            
            // this.isLoading = false;
  
  
  
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

        // console.log("value object N",this.valueObject);
        
        this.transformedMap.set(fileNameAsKey, this.valueObject);
        this.fileListSearch = Array.from(this.transformedMap.values());
  }

// **********************************

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



// public searchData(value: string): void {
//   const filterValue = value.trim().toLowerCase();

//   // 🔹 Search within full dataset
//   this.filteredList = this.fullDataList.filter((item: getSearchfileList) => 
//     item.fileName.toLowerCase().includes(filterValue)
//   );
//   this.skip = 0;
//   this.calculateTotalPages(this.filteredList.length, this.pageSize);
//   this.paginateData(this.filteredList);
// }



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

private paginateData(data: getSearchfileList[]): void {
  this.fileListSearch = [];
  this.serialNumberArray = [];

  data.forEach((item, index) => {
    const serialNumber = index + 1;
    if (index >= this.skip && index < this.skip + this.pageSize) {
      item.id = serialNumber;
      this.fileListSearch.push(item);
      this.serialNumberArray.push(serialNumber);
    }
  });

  this.dataSource = new MatTableDataSource<getSearchfileList>([...this.fileListSearch]);
}


public changePageSize(newPageSize: number): void {
  this.pageSize = newPageSize; 
  this.currentPage = 1;
  this.skip = 0;

  this.calculateTotalPages(this.filteredList.length, this.pageSize);
  this.paginateData(this.filteredList); 
}


// **************************************
  
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
  // openModal(fileUrl: any) {
  //   // console.log("Opening modal for PDF:", fileUrl);
  //   this.docView = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  //   setTimeout(() => {
  //     const modalTrigger = document.getElementById('view_files');
  //     if (modalTrigger) {
  //       modalTrigger.classList.add('show');
  //       modalTrigger.style.display = 'block';
  //       document.body.classList.add('modal-open');
      
  //     }
  //   }, 10);
  // }

  openModal(fileUrl: string) {
    if (!fileUrl) return;
  
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
  convertBytesToKB(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

}