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
import { clientsDatas, companiesList} from 'src/app/core/core.index';
import { FileManagementService } from 'src/app/services/file-management.service';
import { HttpResponse } from '@angular/common/http';
import { filter, flatMap, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ResourceLoader } from '@angular/compiler';
import { NgxDocViewerModule, ViewerType } from 'ngx-doc-viewer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { param } from 'jquery';
import { DatePipe } from '@angular/common';
import { LoginComponentService } from 'src/app/services/login-component.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements OnInit , OnDestroy {
[x: string]: any;
  public searchDataValue = '';
  public routes = routes
  public filter = false;
  elem=document.documentElement
  isFilterDropdownOpen: boolean = false;
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  selectedDocType :any;

  // pagination variables
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

   categoryList = new Map();
   mainHead:any;
   plants:any;

   doc: string = '';
   viewer: ViewerType = 'google';
   selectedType = 'xlsx';
   isLoading: boolean = false; 
   startDate:any;
   endDate:any;

   loggedUserRole:any;
   documentTypeDataList : any
   respData:any;

  private unsubscribe$ = new Subject<void>();
  transformedMap: Map<string, any> = new Map();

  documentTypeSet = new Set<string>();
  documentTypeList:any;

  resultMap:any;

  valueObject:any;
  finalList:any;

  fileListOne:any;

  copyDataList:any;

  //** / pagination variables
  constructor(private data: DataService, _uploadService: FileManagementService, private formBuilder: FormBuilder,private route: ActivatedRoute, private router: Router,private datePipe: DatePipe,private loginService : LoginComponentService) {

    this.route.queryParams.subscribe(params => {
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      this.categoryList=params['categoryList'];
       this.mainHead = params['mainHead'];
     this.plants =params['plants'];
      
      
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);
      
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

    this.getFileListDetails();
  }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }


 
  ngOnInit(): void {
    
    this.getDocumentTypeList();
    this.loggedUserRole=localStorage.getItem("role")
    console.log("rolleee loginr=ed: ",this.loggedUserRole);
    

    
    this.setLast15Days();

    this.route.queryParams.subscribe(params => {
      this.departmentName = params['DepartmentName'];
      this.subAreaName = params['subAreaName'];
      
      this.subAreaNameOnHeader = this.capitalizeFirstLetter(params['subAreaName']);
      
    });






    this.route.queryParams.subscribe(params => {
      if (params['fileList']) {
        this.fileList = JSON.parse(decodeURIComponent(params['fileList']));
    
        const convertToKB = (bytes: number): number => {
          return Math.round((bytes / 1024) );
        };
          
        this.fileList = this.fileList.filter((item: any) => {
          return item.listOfDocumentVersoinDtos.some((version: any) => {
            if (this.loggedUserRole === 'User') {
              return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
            } else if (this.loggedUserRole === 'SuperUser') {
              return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
            } else if (this.loggedUserRole === 'HOD') {
              return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
            }
            return false;
          });
        });
        

        this.fileList.forEach((item: any) => {
          item.selectedVersion = this.getLatestVersion(item.listOfDocumentVersoinDtos);
          item.listOfDocumentVersoinDtos.forEach((version: any) => {
            version.fileSizeKB = convertToKB(parseInt(version.fileSize, 10));
          });
        });
    
    
        if (this.fileList.length > 0 && this.fileList[0].selectedVersion) {
          this.doc = this.fileList[0].selectedVersion.fileUrl;
        
        }
      } else {

          } 
        }); 



    

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

    this.getFileListDetails()
    // this.fileManagerTableData();
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
    this.fileList = [];
    this.serialNumberArray = [];
  
    this.loginService.getFileLists(this.mainHead, this.plants, this.departmentName, this.subAreaName, this.startDate, this.endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.respData = event.body.documentLists;
          console.log("response:", this.respData);
          
  
          const convertToKB = (bytes: number): string => {
            return (bytes / 1024).toFixed(2);
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
          //copy data
          this.copyDataList = Array.from(this.transformedMap.values());

          console.log("vgyvgscgshadfgavsdcha:^^^^",this.finalList);
          
  
          console.log("response..............",this.transformedMap);
          
          this.totalData = this.fileList.length;

          this.respData.forEach((item: any) => {
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
  
          this.fileList.forEach((item: any) => {
            item.selectedVersion = this.getLatestVersion(item.listOfDocumentVersoinDtos);
            item.listOfDocumentVersoinDtos.forEach((version: any) => {
              version.fileSizeKB = convertToKB(parseInt(version.fileSize, 10));
            });
          });
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


  // transformApiResponseToMap(apiResponse: any[]): Map<string, any> {
  //   const resultMap = new Map<string, any>();

  //   apiResponse.forEach((item) => {
  //     const fileName = item.fileName;
    
    
  //     //let listOfDocumentVersoinDtosObj = item.listOfDocumentVersoinDtos;
  //     let revObj = item.listOfDocumentVersoinDtos.slice().reverse();
  //     // console.log("bbbbbbbbb:::::::",JSON.stringify(revObj[0]));
  //     const newUniqueFileName=revObj[0].uniqueFileName;
  //     const fileSize =revObj[0].fileSize || null;
      
  //     // const listOfDocumentVersoinDtos = item.listOfDocumentVersoinDtos.slice().reverse().map((version:any) => ({
  //     //   fileName:item.fileName,
  //     //   versionId: version.versionId,
  //     //   versionName: version.versionName,
  //     //   versionReleaseDate: version.versionReleaseDate,
  //     //   fileUrl: version.fileUrl,
  //     //   uniqueFileName: version.uniqueFileName,
  //     //   fileSize: version.fileSize,
  //     //   hodDocument: version.hodDocument,
  //     //   statutoryDocument: version.statutoryDocument,
  //     //   restrictedDocument: version.restrictedDocument,
  //     // }));

  //     const listOfDocumentVersoinDtos = item.listOfDocumentVersoinDtos

  //     const documentType = item.documentType;
  //     const documentSubType = item.documentSubType;
  //     const storageLocation = item.storageLocation;
  //     const fileUrl = item.listOfDocumentVersoinDtos[0]?.fileUrl || null;
  //     let versionName = revObj[0].versionName
  //     let versionReleaseDate = revObj[0].versionReleaseDate
  //     const selectedVersion= versionName.concat("-",versionReleaseDate);

  //     const valueObject = {
  //       newUniqueFileName,
  //       fileName,
  //       fileSize,
  //       listOfDocumentVersoinDtos,
  //       documentType,
  //       documentSubType,
  //       storageLocation,
  //       fileUrl,
  //       selectedVersion
  //     };

  //     resultMap.set(fileName, valueObject);
  //   });

  //   console.log("dddddd",JSON.stringify(this.transformedMap));
    

  //   return resultMap;
  // }


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
  
  
  // getFileListDetailsByFilter() {
  //   this.fileList = [];
  //   this.serialNumberArray = [];
  
  //   this.loginService.getFileListsByFilter(this.mainHead, this.plants, this.departmentName, this.subAreaName, this.startDate, this.endDate,this.selectedDocType).subscribe({
  //     next: (event: any) => {
  //       if (event instanceof HttpResponse) {
  //         this.respData = event.body.documentLists;
  //         console.log("response:", this.respData);
          
  
  //         const convertToKB = (bytes: number): string => {
  //           return (bytes / 1024).toFixed(2);
  //         };
  
  //         this.fileList = this.respData.filter((item: any) => {
  //           return item.listOfDocumentVersoinDtos.some((version: any) => {
  //             if (this.loggedUserRole === 'User') {
  //               return !version.hodDocument && !version.statutoryDocument && !version.restrictedDocument;
  //             } else if (this.loggedUserRole === 'SuperUser') {
  //               return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.statutoryDocument;
  //             } else if (this.loggedUserRole === 'HOD') {
  //               return (!version.hodDocument && !version.statutoryDocument && !version.restrictedDocument) || version.hodDocument;
  //             }
  //             return false;
  //           });
  //         });
  
  //         this.totalData = this.fileList.length;
  
  //         this.fileList.map((item: getfileList, index: number) => {
  //           const serialNumber = index + 1;
  //           if (index >= this.skip && serialNumber <= this.limit) {
  //             item.id = serialNumber;
  //             this.serialNumberArray.push(serialNumber);
  //           }
  //         });
  
  //         this.dataSource = new MatTableDataSource<getfileList>(this.fileList);
  //         this.calculateTotalPages(this.fileList.length, this.pageSize);
  
  //         this.fileList.forEach((item: any) => {
  //           item.selectedVersion = this.getLatestVersion(item.listOfDocumentVersoinDtos);
  //           item.listOfDocumentVersoinDtos.forEach((version: any) => {
  //             version.fileSizeKB = convertToKB(parseInt(version.fileSize, 10));
  //           });
  //         });
  
  //         if (this.fileList.length > 0 && this.fileList[0].selectedVersion) {
  //           this.doc = this.fileList[0].selectedVersion.fileUrl;
  //         }
  
  //       }
  //     },
  //     error: (err: any) => {
  //       if (err.error && err.error.message) {
  //         this['msg'] += " " + err.error.message;
  //       }
  //     },
  //   });
  // }
 
  capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }




  public sortData(sort: Sort) {
    const data = this.fileList.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
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
    console.log("get all file by filter",this.fileList);
    
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

// onDocumentTypeChange(docType:any){
//   console.log("Selected Doctye DATA::",docType);
//   this.selectedDocType = docType;
//   this.fileManagerTableData(this.selectedDocType);
// }


// fileManagerTableData(filterData:any){
 
//   if(filterData == null || filterData == ''){
//     this.getFileListDetails();
//   }else{
//     alert("else part")
//     this.getFileListDetailsByFilter();
//   }
// }



getDocumentTypeList() {
  // alert("hi")
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


onMultipleSelect(event: { addedFiles: File[] }) {
  this.multipleFiles.push(...event.addedFiles);
  this.selectedFiles = this.multipleFiles;
  //console.log("file capchurd :",this.multipleFiles)
}

onRemoveMultiple(event: File) {
  this.multipleFiles.splice(this.multipleFiles.indexOf(event), 1);
}

upload(file: File): void {
//console.log(file);
if (file) {
  this['uploadService'].upload(file).subscribe({
    next: (event: any) => {
      if (event instanceof HttpResponse) {
        const msg = file.name + ": Successful!";
        // this.message.push(msg);
      //  this.fileInfos = this.uploadService.getFiles();
      }
    },
    error: (err: any) => {
      let msg = file.name + ": Failed!";

      if (err.error && err.error.message) {
        msg += " " + err.error.message;
      }

      // this.message.push(msg);
     // this.fileInfos = this.uploadService.getFiles();
    }
  });
}
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

onSubmit(){
console.warn('Your data has been submitted', this.uploadFileForm.value);



let modalData = {
  'uploadFile': this.uploadFileForm.controls['uploadFile'].value,
  'departmentName' : this.uploadFileForm.controls['departmentName'].value,
  'isStatutoryDocument' : this.uploadFileForm.controls['isStatutoryDocument'].value
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

onDocumentTypeChange(docType: any) {
  
  const filteredData = this.copyDataList.filter((item: any) => item.documentType === docType);

  if(filteredData!='' ){
    this.fileList = this.copyDataList.filter((item: any) => item.documentType === docType);
  }
  else{
    this.fileList = this.copyDataList;
  }
  }

  
 
}

