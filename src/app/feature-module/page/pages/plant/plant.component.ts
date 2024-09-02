// import {Component, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import {DataTablesModule} from 'angular-datatables';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
declare let $: any;

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent {
  name = 'Angular';

  public routes = routes;

  headList: any;
  msg: any;
  
  constructor(private formBuilder: FormBuilder,private router: Router,private loginService : LoginComponentService) {
   
  }

  ngOnInit() {

this.allCategoryListHead();
 
  }






  allCategoryListHead() {

    this.loginService.allCategoryListHead().subscribe({
     
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.headList = event.body.categoryList.listCategoryInfoDtos
         
          //console.log(this.headList); // Log the extracted data
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


  buttonInRowClick(event: any): void {
    event.stopPropagation();
    //console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    //console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    //console.log('next clicked')
  }
  previousButtonClickEvent(): void {
    //do previous particular the records like  0 - 100 rows.
    //we are calling to API
  }
}
