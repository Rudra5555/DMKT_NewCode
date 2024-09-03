import { Component, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes, url } from 'src/app/core/core.index';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface data {
  id: number, dType: string, totalFiles: string, src: url, name: string, size?: string, docType: string, last_modified?: string;
}

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
})
export class EmployeeDashboardComponent implements OnInit {


  public getAllFilesForm!: FormGroup;
  public uname: any
  public flag: boolean = false;
  public visible: boolean = false;
  public fileList: any
  public modalFileList: any;
  public myData: any;
  public modalMyData: any;
  public fileListTmp!: Array<data>;
  public modalFileListTmp!: Array<data>;
  public cardColorList!: ['card1', 'card2', 'card3'];
  public searchTextVal: any;
  public routes = routes;
  public data: any
  public msg: any
  openLink() {
    this.router.navigate([routes.filemanager])

  }




  colors = ['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];

  materials: any;
  randomItem!: string;
  searchFilterList: any;
  selected = 'Departments';


  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginComponentService) {
  }



  public getColor() {

    this.randomItem = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  getFileList() {

    this.loginService.getFileList().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.data = event.body
        }

      },



      error: (err: any) => {
        if (err.error && err.error.message) {

          this.msg += " " + err.error.message;
        }
      }
    });
  }


  ngOnInit(): void {
    this.getFileList()
    this.uname = localStorage.getItem("ami");
    //console.log("header ====>",this.uname)


    this.getAllFilesForm = this.formBuilder.group({
      dropDownData: ["", [Validators.required]],   /**this.formBuilder.array([]) */


    });

    this.fileList = [
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/blue.jpg'
      },

      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/blue.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/blue.jpg'
      },

    ]
    this.myData = this.fileList;
    this.fileListTmp = this.fileList


    this.modalFileList = [
      {
        id: 1, name: 'Main Head', size: '456kb', docType: "Bill"
      },
      {
        id: 2, name: 'Instrument', size: '456.5kb', docType: "File"
      },
      {
        id: 3, name: 'Department', size: '459.55kb', docType: "Manual"
      },
      {
        id: 4, name: 'Instrument', size: ' 987kb', docType: "Picture"
      },
      {
        id: 5, name: 'Department', size: ' 872kb', docType: "Drawing"
      },
      {
        id: 6, name: 'Main Head', size: ' 987kb', docType: "Document"
      },
      {
        id: 7, name: 'Main Head', size: '796', docType: "Drawing"
      },
      {
        id: 8, name: 'Instrument', size: '796', docType: "Bill"
      },
      {
        id: 9, name: 'Department', size: ' 2467', docType: "Bill"
      },
      {
        id: 10, name: 'Department', size: ' 54646', docType: "Excel"
      },
      {
        id: 11, name: 'Main Head', size: '7564677', docType: "Excel"
      },
      {
        id: 12, name: 'Main Head', size: '76856', docType: "Manual"
      }

    ]
    this.modalMyData = this.modalFileList;
    this.modalFileListTmp = this.modalFileList




  }

  searchKey(data: string) {
    this.searchTextVal = data;
    alert(this.searchTextVal)
  }


  public updateDb(file: any) {
    var getData = this.getAllFilesForm.value.dropDownData;


  }



  public onSubmit(file: any) {

    var getData = file;



    if (getData.length > 0) {
      this.myData = this.fileList.filter((res: { dType: string; }) => {

        return res.dType.toLowerCase().includes(getData.toLowerCase());
      });


    } else {

      this.myData = this.fileListTmp;
    }


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
  navigateToFileManager() {
    this.router.navigate(['apps/file-manager']);
  }


}
