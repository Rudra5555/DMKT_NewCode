// import {Component, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
// import {DataTablesModule} from 'angular-datatables';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Component,OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators,} from "@angular/forms";
import { NgModel } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'app-List-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.scss']
})
export class ListRequestComponent implements OnInit {
isAllSelected() {
throw new Error('Method not implemented.');
}
masterToggle() {
throw new Error('Method not implemented.');
}
  name = 'Angular';
  public routes = routes;
  public addContactForm!: FormGroup ;
  public editContactForm!: FormGroup ;
  public allContacts: Array<object> = [];
  public contactSidebar = ["company", "client", "staff"];
  public searchText!: string;
  public url = "list-request";
  constructor(private formBuilder: FormBuilder,

    // _bsRangeValue: any; 
    // selection: any;
) { }

  ngOnInit() {
    // let table = $('#example').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });

    this.addContactForm = this.formBuilder.group({
      contactName: ["", [Validators.required]],
      contactNumber: ["", [Validators.required]],
      contactEmail: ["", [Validators.required]],
    });

    // Edit Contact Form Validation And Getting Values

    this.editContactForm = this.formBuilder.group({
      editContactName: ["", [Validators.required]],
      editContactEmail: ["", [Validators.required]],
      editContactNumber: ["", [Validators.required]],
    });
  }
  // }

  // buttonInRowClick(event: any): void {
  //   event.stopPropagation();
  //   //console.log('Button in the row clicked.');
  // }

  // wholeRowClick(): void {
  //   //console.log('Whole row clicked.');
  // }

  // nextButtonClickEvent(): void {
  //   //do next particular records like  101 - 200 rows.
  //   //we are calling to api

  //   //console.log('next clicked')
  // }
  // previousButtonClickEvent(): void {
  //   //do previous particular the records like  0 - 100 rows.
  //   //we are calling to API
  }


