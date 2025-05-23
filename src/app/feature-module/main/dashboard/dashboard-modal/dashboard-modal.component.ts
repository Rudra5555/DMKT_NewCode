import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ChartConfiguration, ChartData, ChartOptions, ChartType, ChartDataset } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { Validators } from "ngx-editor";
import { routes } from "src/app/core/helpers/routes/routes";

type Label = string[];
@Component({
  selector: "app-dashboard-modal",
  templateUrl: "./dashboard-modal.component.html",
  styleUrls: ["./dashboard-modal.component.scss"],
})
export class DashboardModalComponent implements OnInit {

  public getAllFilesForm!: FormGroup;
  public uname: any
  public flag: boolean = false;
  public visible: boolean = false;
  public fileList: any
  public modalFileList: any;
  public myData: any;
  public modalMyData: any;
  public fileListTmp!: any;
  public modalFileListTmp!: any;
  public cardColorList!: ['card1', 'card2', 'card3'];
  public searchTextVal: any;
  public routes = routes;

  colors = ['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];

  materials: any;
  randomItem!: string;
  searchFilterList: any;
  selected = 'Departments';


  constructor(private formBuilder: FormBuilder, private router: Router) {

  }


  public getColor() {

    this.randomItem = this.colors[Math.floor(Math.random() * this.colors.length)];

  }



  ngOnInit(): void {

    this.uname = localStorage.getItem("loggedUserName");



    this.getAllFilesForm = this.formBuilder.group({
      dropDownData: ["", [Validators.required]],   /**this.formBuilder.array([]) */


    });

    this.fileList = [
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/deptImg.jpg'
      },
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/deptImg.jpg'
      },
      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/deptImg.jpg'
      },

      {
        id: 1, dType: 'Plant', totalFiles: '456', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2, dType: 'Sub-Area', totalFiles: '456', src: '../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2, dType: 'Main Head', totalFiles: '256', src: '../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType: 'Department', totalFiles: '459', src: '../../../../../assets/img/deptImg.jpg'
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


