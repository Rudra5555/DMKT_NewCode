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
  public totalPages = 0;
  msg:any;
  selectedClient: any = {};
  loggedInUser: any;
  adminRoleFlag: boolean = false;
  librarianRoleFlag: boolean = false;

  //** / pagination variables
  // constructor(private data: DataService) {}

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
    console.log("Client Data:", client);

   
    this.loggedInUser = localStorage.getItem('role')?.trim().toLowerCase();
    console.log("Logged In User:", this.loggedInUser);
  
    this.adminRoleFlag = this.loggedInUser === 'admin';
    this.librarianRoleFlag = this.loggedInUser === 'librarian';
  
    console.log("Admin Role Flag:", this.adminRoleFlag);
    console.log("Librarian Role Flag:", this.librarianRoleFlag);
  
    this.cdr.detectChanges();  // Force UI update
  }

  
  private getTableData(): void {
    this.clientsData = [];
    this.serialNumberArray = [];

       this.loginService.getUserInfo().subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
            const res=event.body
            console.log("User Data:", res);
            
           
            this.totalData = res.response.length;
              
            res.response.map((res: getClient, index: number) => {
              const serialNumber = index + 1;
              if (index >= this.skip && serialNumber <= this.limit) {
                res.id = serialNumber;
                this.clientsData.push(res);
                this.serialNumberArray.push(serialNumber);
              }
            });
            this.dataSource = new MatTableDataSource<getClient>(this.clientsData);
            this.calculateTotalPages(this.totalData, this.pageSize);

            }
          },
          error: (err: any) => {
            if (err.error && err.error.message) {
              this.msg += " " + err.error.message;
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
    const data = this.clientsData.slice();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (!sort.active || sort.direction === '') {
      this.clientsData = data;
    } else {
      this.clientsData = data.sort((a: any, b: any) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.clientsData = this.dataSource.filteredData;
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
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
    this.getTableData();
  }

  public changePageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
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


  navigateWithClient(client: any) {
    if (!client) return;
    console.log("Navigating to User Management Profile with Client Data:", client);
    
    console.log(client.userPicture);
    
    this.idleService.setClientData(client);
    console.log("Client data stored in IdleService.");
  }


  setSelectedClient(client: any) {
    this.selectedClient = { ...client }; // Store selected client data
    console.log("Selected Client:", this.selectedClient);
  }

}
export interface pageSelection {
  skip: number;
  limit: number;
}


