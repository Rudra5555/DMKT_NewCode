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
  public uname:any
  public flag: boolean = false;
  public visible : boolean = false;
  public fileList:any
  public modalFileList:any;
  public myData:any;
  public modalMyData:any;
  public fileListTmp!: any;
  public modalFileListTmp!:any;
  public cardColorList!: ['card1','card2','card3'];
  public searchTextVal:any;
  public routes = routes;
  // public routes = routes;
  // public projectSliderOptions: OwlOptions = {
  //   loop: true,
  //   margin: 20,
  //   nav: true,
  //   dots: false,
  //   smartSpeed: 2000,
  //   autoplay: false,
  //   navText: [
  //     '<i class="fa-solid fa-chevron-left"></i>',
  //     '<i class="fa-solid fa-chevron-right"></i>',
  //   ],

  //   responsive: {
  //     0: {
  //       items: 1,
  //     },
  //     600: {
  //       items: 3,
  //     },
  //     992: {
  //       items: 4,
  //     },
  //     1200: {
  //       items: 3,
  //     },
  //     1400: {
  //       items: 1,
  //     },
  //   },
  // };
  // public companySliderOptions: OwlOptions = {
  //   loop: true,
  //   margin: 20,
  //   nav: true,
  //   dots: false,
  //   smartSpeed: 2000,
  //   autoplay: false,
  //   navText: [
  //     '<i class="fa-solid fa-chevron-left"></i>',
  //     '<i class="fa-solid fa-chevron-right"></i>',
  //   ],
  //   responsive: {
  //     0: {
  //       items: 2,
  //     },
  //     600: {
  //       items: 2,
  //     },
  //     992: {
  //       items: 2,
  //     },
  //     1200: {
  //       items: 3,
  //     },
  //     1400: {
  //       items: 4,
  //     },
  //   },
  // };
  // @ViewChild('chart') chart!: ChartComponent;
  // public chartOptions: Partial<ChartOptions>;\


  // colors=['#ADD8E6','#F08080','#90EE90','#FAFAD2' , '#E0FFFF', '#FAFAD2',  '#FFA07A','#87CEFA','#FFB6C1','#5ef3fb' , '#79fd37', '#fd37dc'];
  colors=['#fc0859', '#ff6a00', '#00ff00', '#00ab52', '#0800a7', '#ff00ff', '#dcfe00', '#00c39f'];

  materials: any;
  randomItem!: string;
  searchFilterList: any;
 selected= 'Departments';


  constructor(private formBuilder: FormBuilder,private router: Router) {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: 'Break',
    //       data: [-50, -120, -80, -180, -80, -70, -100],
    //     },
    //     {
    //       name: 'Hours',
    //       data: [200, 250, 200, 290, 220, 300, 250],
    //     },
    //   ],
    //   colors: ['#FC133D', '#55CE63'],

    //   chart: {
    //     type: 'bar',
    //     height: 210,
    //     stacked: true,

    //     zoom: {
    //       enabled: true,
    //     },
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 280,
    //       options: {
    //         legend: {
    //           position: 'bottom',
    //           offsetY: 0,
    //         },
    //       },
    //     },
    //   ],
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       borderRadius: 4,
    //       borderRadiusApplication: 'end', // "around" / "end"
    //       borderRadiusWhenStacked: 'all', // "all"/"last"
    //       columnWidth: '20%',
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   // stroke: {
    //   //     width: 5,
    //   //     colors: ['#fff']
    //   //   },
    //   yaxis: {
    //     min: -200,
    //     max: 300,
    //     tickAmount: 5,
    //   },
    //   xaxis: {
    //     categories: [
    //       ' Jan ',
    //       'Feb',
    //       'Mar',
    //       'Apr',
    //       'May',
    //       'Jun',
    //       'Jul',
    //       'Aug',
    //       'Sep',
    //     ],
    //   },
    //   legend: { show: false },
    //   fill: {
    //     opacity: 1,
    //   },
    // };
  }


  public getColor(){
    
    this.randomItem = this.colors[Math.floor(Math.random()*this.colors.length)];
    //console.log('s',this.randomItem);
  }



  ngOnInit(): void {

    this.uname = localStorage.getItem("loggedUserName");
    //console.log("header ====>",this.uname)


    this.getAllFilesForm = this.formBuilder.group({
      dropDownData: ["", [Validators.required]],   /**this.formBuilder.array([]) */
    
      
    });

    this.fileList = [
      {
        id: 1, dType:'Plant' , totalFiles: '456' , src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2,dType:'Sub-Area' , totalFiles: '456' , src:'../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2, dType:'Main Head' , totalFiles: '256', src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType:'Department' ,totalFiles: '459',  src:'../../../../../assets/img/deptImg.jpg'
      },
      {
        id: 1, dType:'Plant' , totalFiles: '456' , src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2,dType:'Sub-Area' , totalFiles: '456' , src:'../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2,dType:'Main Head' , totalFiles: '256', src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType:'Department' ,totalFiles: '459',  src:'../../../../../assets/img/deptImg.jpg'
      },
      {
        id: 1, dType:'Plant' , totalFiles: '456' , src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2,dType:'Sub-Area' , totalFiles: '456' , src:'../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2,dType:'Main Head' , totalFiles: '256', src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType:'Department' ,totalFiles: '459',  src:'../../../../../assets/img/deptImg.jpg'
      },

      {
        id: 1, dType:'Plant' , totalFiles: '456' , src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 2,dType:'Sub-Area' , totalFiles: '456' , src:'../../../../../assets/img/instImg.jpeg'
      },
      {
        id: 2,dType:'Main Head' , totalFiles: '256', src:'../../../../../assets/img/areaImg.jpg'
      },
      {
        id: 3, dType:'Department' ,totalFiles: '459',  src:'../../../../../assets/img/deptImg.jpg'
      },
      // ,{
      //   id: 12,dType:'Area' , totalFiles: '7856'
      // }

    ]
    this.myData = this.fileList;
this.fileListTmp = this.fileList


this.modalFileList = [
  {
    id: 1, name:'Main Head' , size: '456kb' , docType: "Bill"
  },
  {
    id: 2, name:'Instrument' , size: '456.5kb', docType: "File"
  },
  {
    id: 3, name:'Department' ,size: '459.55kb', docType: "Manual"
  },
  {
    id: 4, name:'Instrument' , size: ' 987kb', docType: "Picture"
  },
  {
    id: 5, name:'Department' , size: ' 872kb', docType: "Drawing"
  },
  {
    id: 6, name:'Main Head' , size: ' 987kb', docType: "Document"
  },
  {
    id: 7, name:'Main Head' , size: '796', docType: "Drawing"
  },
  {
    id: 8, name:'Instrument' , size: '796', docType: "Bill"
  },
  {
    id: 9, name:'Department' , size: ' 2467', docType: "Bill"
  },
  {
    id: 10, name:'Department' , size: ' 54646', docType: "Excel"
  },
  {
    id: 11, name:'Main Head' , size: '7564677', docType: "Excel"
  },
  {
    id: 12, name:'Main Head' , size: '76856', docType: "Manual"
  }

]
this.modalMyData = this.modalFileList;
this.modalFileListTmp = this.modalFileList



  
  }

  searchKey(data:string)
  {
    this.searchTextVal=data;
    alert(this.searchTextVal)
  }

  // search filter in files name
  // searchBName(searchValue: string) {
  //   this.searchFilterList = this.modalFileList.filter((res: { name: string; }) => {
  //     return res.name.toLowerCase().includes(searchValue.toLowerCase());
      
  //   });
  // }

public updateDb(file: any){
  var getData =this.getAllFilesForm.value.dropDownData; 
  
  // //console.log("DropDown data from dropdown :::x",getData)
  //console.log('Your data select ::', file);

}



public onSubmit(file: any){
  // var getData =this.getAllFilesForm.value.dropDownData; 
  var getData = file;
  
  // //console.log("DropDown data from dropdown :::x",getData)
  //console.log('Your data has been submitted ::', getData);

// if(getData == "Area"){
//   this.flag = true;
// }if(getData == "departments"){
//   this.flag = true;
// }
if(getData.length>0){
  this.myData = this.fileList.filter((res: { dType: string; }) => {
  
    return res.dType.toLowerCase().includes(getData.toLowerCase());
  });
  //console.log("name==="+JSON.stringify( this.myData))
  
}else{
 // alert("hhhhhhhhhhhh"+JSON.stringify(this.lstSearchListTmp))
  this.myData = this.fileListTmp;
  //console.log("else part == :",  this.myData)
}


}


public searchText(searchTxt :string){
  var getData =this.getAllFilesForm.value.dropDownData; 
  //console.log("from modal search : ", searchTxt)

  if(searchTxt.length>0){
    this.modalMyData = this.modalFileList.filter((res: { name: string; }) => {
    
      return res.name.toLowerCase().includes(searchTxt.toLowerCase());
    });
    //console.log("name==="+JSON.stringify( this.modalMyData))
    
  }else{
   // alert("hhhhhhhhhhhh"+JSON.stringify(this.lstSearchListTmp))
    this.modalMyData = this.modalFileListTmp;
  }
}



// public onDropdownChange(){
//  if( this.getAllFilesForm.dropDownData.value){
//   this.onSubmit();
//  }
// }

navigateToFileManager() {
  this.router.navigate(['apps/file-manager']);
}



}


