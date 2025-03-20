import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Validators } from 'ngx-editor';
import { DataService, apiResultFormat, getClient, routes } from 'src/app/core/core.index';
import { UploadDocumentComponentService } from 'src/app/services/upload-document-component.service';
import { LoginComponentService } from "src/app/services/login-component.service";
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { IdleService } from 'src/app/services/idle.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public clientsData: Array<getClient> = [];
  public searchDataValue = '';
  dataSource!: MatTableDataSource<getClient>;
  public routes = routes;
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
  msg:any;
  selectedClient: any = {};
  loggedInUser: any;
  adminRoleFlag: boolean = false;
  librarianRoleFlag: boolean = false;
  uniqueDepartments: string[] = [];
  uniquePlants: string[] = [];
  selectedPlant: string = '';
  selectedDepartment: string = '';
  isLoading: boolean = false; 

  public fullDataList:any;
  public filteredList:any;
  public res:any;

  constructor(
    private data: DataService,
    private formBuilder: FormBuilder,
    private loginService: LoginComponentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private idleService: IdleService

  ) {
  }

  ngOnInit(): void {
    this.getTableData();
    this.cdr.markForCheck();

    const client = this.idleService.getClientData();
    this.loggedInUser = localStorage.getItem('role')?.trim().toLowerCase();
  
    this.adminRoleFlag = this.loggedInUser === 'admin';
    this.librarianRoleFlag = this.loggedInUser === 'librarian';
  
    this.cdr.detectChanges();  // Force UI update
  }

  private getTableData(): void {
    this.clientsData = [];
    this.serialNumberArray = [];
    this.isLoading = true;

       this.loginService.getUserInfo().subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
            const respData=event.body
            this.res=event.body.response

            let dropdownData = this.getUniqueDropdownOptions(respData);
            this.uniqueDepartments = dropdownData.uniqueDepartments;
            this.uniquePlants = dropdownData.uniquePlants;

            this.totalData=this.res.length;
          
            this.fullDataList = [...this.res];
            this.filteredList = [...this.res];
            this.paginateData(this.filteredList);
            this.calculateTotalPages(this.filteredList.length, this.pageSize);

            this.isLoading = false;

            }
          },
          error: (err: any) => {
            if (err.error && err.error.message) {
              this.msg += " " + err.error.message;
              this.isLoading = false;
            }
          }
        });
  }

  getUniqueDropdownOptions(response: any) {
    let departmentSet = new Set<string>();
    let plantSet = new Set<string>();
  
    response.response.forEach((user: any) => {
      user.departmentNameList.forEach((dept: any) => {
        departmentSet.add(dept.departmentName);
        plantSet.add(dept.plantName);
      });
    });

    let uniqueDepartments = Array.from(departmentSet);
    let uniquePlants = Array.from(plantSet);
  
    return { uniqueDepartments, uniquePlants };
  }
  
  applyFilter() {

    this.clientsData = [];
    this.serialNumberArray = [];
    this.isLoading = true;

       this.loginService.getFilterUserList(this.selectedDepartment,this.selectedPlant).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
            this.res=event.body.response
           
            this.totalData=this.res.length;
          
            this.fullDataList = [...this.res];
            this.filteredList = [...this.res];
            this.paginateData(this.filteredList);
            this.calculateTotalPages(this.filteredList.length, this.pageSize);
      

            this.isLoading = false;
            }
          },
          error: (err: any) => {
            if (err.error && err.error.message) {
              this.msg += " " + err.error.message;
              this.isLoading = false;
            }
          }
        });
  }

  getPlantNames(client: getClient): string {
    return client.departmentNameList && Array.isArray(client.departmentNameList)
      ? client.departmentNameList.map(dept => dept.plantName || 'N/A').join(', ')
      : 'N/A';
  }
  
  getDepartmentNames(client: getClient): string {
    return client.departmentNameList && Array.isArray(client.departmentNameList)
      ? client.departmentNameList.map(dept => dept.departmentName || 'N/A').join(', ')
      : 'N/A';
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
     this.filteredList = this.fullDataList.filter((item: getClient) => 
       item.userName.toLowerCase().includes(filterValue)
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
 
   private paginateData(data: getClient[]): void {
     this.clientsData = [];
     this.serialNumberArray = [];
   
     data.forEach((item, index) => {
       const serialNumber = index + 1;
       if (index >= this.skip && index < this.skip + this.pageSize) {
         item.id = serialNumber;
         this.clientsData.push(item);
         this.serialNumberArray.push(serialNumber);
       }
     });
   
     this.dataSource = new MatTableDataSource<getClient>([...this.clientsData]);
   }
 
   
   public changePageSize(newPageSize: number): void {
     this.pageSize = newPageSize; 
     this.currentPage = 1;
     this.skip = 0;
   
     this.calculateTotalPages(this.filteredList.length, this.pageSize);
     this.paginateData(this.filteredList); 
   }

  navigateWithClient(client: any) {
    if (!client) return;
    this.idleService.setClientData(client);
  }


  setSelectedClient(client: any) {
    this.selectedClient = { ...client }; // Store selected client data
  }

}
export interface pageSelection {
  skip: number;
  limit: number;
}


