import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { routes } from 'src/app/core/core.index';
import { DataService } from 'src/app/core/services/data/data.service';
import { apiResultFormat, getfileList } from 'src/app/core/services/interface/models';
import { pageSelection } from 'src/app/feature-module/employee/employees/departments/departments.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { clientsDatas, companiesList } from 'src/app/core/core.index';
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { filter, flatMap, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';
import { LoginComponentService } from 'src/app/services/login-component.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-file-manager-mainhead',
  templateUrl: './file-manager-mainhead.component.html',
  styleUrl: './file-manager-mainhead.component.scss'
})
export class FileManagerMainheadComponent implements OnInit, OnDestroy {
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
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];


  dataSource!: MatTableDataSource<getfileList>;
  public fileList: Array<getfileList> = [];
  public totalPages = 0;
  public message: any;
  public selectedFiles: any;
  public uploadFileForm!: FormGroup;
  public editClientForm!: FormGroup;
  public multipleFiles: File[] = [];
  public getRole: any;
  public bigId: any;
  public roleFlag: boolean = false;
  documentTypeDataList : any
  departmentName: any;
  subAreaName: any;
  subAreaNameOnHeader: any;
  decryptedPlantName: any;
  decryptedMainHeadName: any;
  categoryList = new Map();
  mainHead: any;
  plants: any;
  encryptedPlantName: any;
  decryptedMainHead:any;
  doc: string = '';
  viewer: ViewerType = 'google';
  selectedType = 'xlsx';
  timestamp: string ='';
  startDate: any;
  endDate: any;
  catName: any;
  catId: any
  loggedUserRole: any;
  isLoading: boolean = false;
  respData: any;
  public loggedUserName: any;
  public loggedUserId:any;
  transformedMap: Map<string, any> = new Map();
  documentTypeSet = new Set<string>();
  documentTypeList:any;

  resultMap:any;

  valueObject:any;
  finalList:any;

  fileListOne:any;

  copyDataList:any;

  private unsubscribe$ = new Subject<void>();


  //** / pagination variables
  constructor(private data: DataService, _uploadService: FileManagementService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private loginService: LoginComponentService) {


    this.route.queryParams.subscribe(params => {
      this.catName = params['catName'];
      this.catId = params['catId'];
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      this.categoryList = params['categoryList'];
      this.mainHead = params['mainHead'];
      this.plants = params['plants'];
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);
    });
console.log("mainHead:: ",this.mainHead);


  }

 





  ngOnInit(): void {
    this.getDocumentTypeList();
    this.loggedUserRole = localStorage.getItem("role")

    this.setLast15Days();

    // this.route.queryParams.subscribe(params => {
    //   this.departmentName = params['DepartmentName'];
    //   this.subAreaName = params['subAreaName'];

    //   this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);

    // });


    this.route.queryParams.subscribe((params) => {
      try {
        // Retrieve encrypted query parameters
        const encryptedMainHeadName = params['mainHeadName'];
        const encryptedPlantName = params['plantName'];
      
  
        // Define the same secret key used for encryption
        const secretKey = this.timestamp; // Ensure this matches the sender's key
  
        // Decrypt the parameters
//this.decryptedMainHead = CryptoJS.AES.decrypt(encryptedMainHead, secretKey).toString(CryptoJS.enc.Utf8);
        this.decryptedMainHeadName = CryptoJS.AES.decrypt(encryptedMainHeadName, secretKey).toString(CryptoJS.enc.Utf8);
        this.decryptedPlantName = CryptoJS.AES.decrypt(encryptedPlantName, secretKey).toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Error decrypting query parameters:", error);
      }
    });




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

    this.uploadFileForm = this.formBuilder.group({

      uploadFile: ["", [Validators.required]],
      area: ["", [Validators.required]],
      deptName: ["", [Validators.required]],
      instName: ["", [Validators.required]],
      docType: ["", [Validators.required]],
    });

    this.getFileListDetails();

  }

  setLast15Days() {
    console.log("setLast15Days");
    
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

 

  getFileListDetails() {
    this.isLoading = true; 
    this.fileList = [];
    this.serialNumberArray = [];
    console.log("api details:: ",this.decryptedMainHeadName, this.startDate, this.endDate);
    

    this.loginService.getFileListforOther(this.decryptedMainHeadName, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.respData = event.body.data;
          console.log("RESP DATA:: ",this.respData);
          
          const convertToKB = (bytes: number): number => {
            return Math.round(bytes / 1024);
          };

          this.fileListOne = this.respData.filter((item: any) => {
            return item.listOfDocumentVersoinDtos.some((version: any) => {
              if (this.loggedUserRole === 'User') {
                return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
              } else if (this.loggedUserRole === 'SuperUser') {
                return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
              } else if (this.loggedUserRole === 'HOD') {
                return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
              }else if (this.loggedUserRole === 'Librarian' || this.loggedUserRole === 'Admin') {
                return true; 
              }
            });
          });
          this.transformedMap = this.transformApiResponseToMap(this.fileListOne);

          this.fileList = Array.from(this.transformedMap.values());
          // console.log("file list",JSON.stringify( this.fileList));
          
          //copy data
          this.copyDataList = Array.from(this.transformedMap.values());

          // console.log("vgyvgscgshadfgavsdcha:^^^^",this.finalList);
          
  
          console.log("response..............",this.transformedMap);
          
          this.totalData = this.fileList.length;

          this.fileListOne.forEach((item: any) => {
            if (item.documentType) {
              this.documentTypeSet.add(item.documentType);
            }
          });
          
          this.documentTypeList = Array.from(this.documentTypeSet);
  
          this.fileList.map((item: getfileList, index: number) => {
            const serialNumber = index + 1;
            if (index >= this.skip && serialNumber <= this.limit) {
              item.id = serialNumber;
              this.serialNumberArray.push(serialNumber);
            }
          });
  
          this.dataSource = new MatTableDataSource<getfileList>(this.fileList);
          console.log("all get file",this.dataSource);
          
          this.calculateTotalPages(this.fileList.length, this.pageSize);
  
          // this.fileList.forEach((item: any) => {
          //   item.selectedVersion = this.getLatestVersion(item.listOfDocumentVersoinDtos);
          //   item.listOfDocumentVersoinDtos.forEach((version: any) => {
          //     version.fileSizeKB = convertToKB(parseInt(version.fileSize, 10));
          //   });
          // });
          this.isLoading = false;

        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this['msg'] += " " + err.error.message;
        }
      },
    });
  }

  transformApiResponseToMap(apiResponse: any[]): Map<string, any> {
    const resultMap = new Map<string, any>();
  
    apiResponse.forEach((item) => {

      // let revObj = item.listOfDocumentVersoinDtos.slice().reverse();

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

  capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  // getLatestVersion(versions: any[]): any {
  //   return versions.reduce((latest, version) => {
  //     return new Date(version.versionReleaseDate) > new Date(latest.versionReleaseDate) ? version : latest;
  //   });
  // }
  
  
  onVersionChange(item: any,fileNameAsKey:any, selectedVersion: any) {
  
    let selectedVersionDetails = selectedVersion;
    let version=selectedVersion.versionName;
    // alert(fileName +JSON.stringify(selectedVersion))
    // alert(fileName +version)/
    // alert(JSON.stringify(selectedVersionDetails))
  
    console.log("nhhhhhhnhnhnhmdhf:::",item);
    
  
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
  
        this.fileList = Array.from(this.transformedMap.values());
  
        // console.log("After::", JSON.stringify(this.transformedMap.get(fileNameAsMapKey)))
        
  
  }
  
  downloadDocument(doucmentUrl:any, item:any){
    this.loggedUserRole;
    this.loggedUserId = localStorage.getItem("loggedInUserId");
    this.loggedUserName = localStorage.getItem("loggedUserName");
    console.log(doucmentUrl, this.loggedUserRole, this.loggedUserName, this.loggedUserId, item);
  }
  
  setFileUrl(fileUrl:any){
      this.doc=fileUrl;
    }
    
    buttonClose(){
      this.doc=''
    }



    onDocumentTypeChange(docType: any) {
  
      const filteredData = this.copyDataList.filter((item: any) => item.documentType === docType);
    
      if(filteredData!='' ){
        this.fileList = this.copyDataList.filter((item: any) => item.documentType === docType);
      }
      else{
        this.fileList = this.copyDataList;
      }
      }




// ****************************************************

  public sortData(sort: Sort) {
    const data = this.fileList.slice();
    if (!sort.active || sort.direction === '') {
      this.fileList = data;
    } else {
      this.fileList = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.fileList = this.dataSource.filteredData;
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


  onMultipleSelect(event: { addedFiles: File[] }) {
    this.multipleFiles.push(...event.addedFiles);
    this.selectedFiles = this.multipleFiles;
  }

  onRemoveMultiple(event: File) {
    this.multipleFiles.splice(this.multipleFiles.indexOf(event), 1);
  }

  upload(file: File): void {

    if (file) {
      this['uploadService'].upload(file).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const msg = file.name + ": Successful!";

          }
        },
        error: (err: any) => {
          let msg = file.name + ": Failed!";

          if (err.error && err.error.message) {
            msg += " " + err.error.message;
          }

        }
      });
    }
  }


  getDocumentTypeList() {
    this.loginService.getDocumentType().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.documentTypeDataList = event.body || [];
        console.log("DOCUMENT TYPE:: ",this.documentTypeDataList);
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }



  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(this.selectedFiles[i]);
      }
      this.selectedFiles = undefined;
    }
  }

  onSubmit() {
    console.warn('Your data has been submitted', this.uploadFileForm.value);



    let modalData = {
      'uploadFile': this.uploadFileForm.controls['uploadFile'].value,
      'departmentName': this.uploadFileForm.controls['departmentName'].value,
      'isStatutoryDocument': this.uploadFileForm.controls['isStatutoryDocument'].value
    }

    console.warn('Your data has been submitted', modalData);

    if (modalData) {
      this['uploadService'].upload(modalData).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            const msg = modalData + ": Successful!";

          }
        },
        error: (err: any) => {
          let msg = modalData + ": Failed!";

          if (err.error && err.error.message) {
            msg += " " + err.error.message;
          }
        }
      });
    }


    this.uploadFileForm.reset();

  }

  ngOnDestroy() {
    this['unsubscribe$'].next();
    this['unsubscribe$'].complete();
  }



  getLatestVersion(versions: any[]): any {
    return versions.reduce((latest, version) => {
      return new Date(version.versionReleaseDate) > new Date(latest.versionReleaseDate) ? version : latest;
    });
  }

  // onVersionChange(item: any, version: any) {
  //   item.selectedVersion = version;
  //   this.doc = version.fileUrl;
  // }



  convertBytesToKB(bytes: number): string {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

}
