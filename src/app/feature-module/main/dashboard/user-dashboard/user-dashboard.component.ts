import { Component, ElementRef, model, OnInit, viewChild, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { routes, url } from 'src/app/core/core.index';
import { Router } from '@angular/router';
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';


interface data {
  id: number, dType: string, totalFiles: string, src: url, name: string, size?: string, docType: string, last_modified?: string;
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
  public fileListTmp!: Array<data>;
  public modalFileListTmp!: Array<data>;
  public cardColorList!: ['card1', 'card2', 'card3'];
  public searchTextVal: any;
  public routes = routes;
  cardHide: boolean = true;
  optionArr: any;
  backButtonList: any = []
  categoryList = new Map();
  data: any[] = [];
  msg: string = '';
  allData: any[] = [];

  mainHeadName: any;
  plantType: any;


  colors = ['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];

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
      dropDownData: ["", [Validators.required]],


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
    this.cardHide = true
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
      this.closePlantModalBtn.nativeElement.click();
    }

    this.loginService.getDetailsByCateName(catName, catId).subscribe({

      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.plantsList = event.body.categoryList.listCategoryInfoDtos;
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
      this.closePlantModalBtn.nativeElement.click();
    }
    this.loginService.getDetailsByCateName(catName, catId).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          this.plantsList = event.body.categoryList
          this.subAreaList = event.body.categoryList
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

}