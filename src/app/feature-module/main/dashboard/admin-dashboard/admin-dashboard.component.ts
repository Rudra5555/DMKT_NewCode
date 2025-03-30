import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChartConfiguration, ChartData, ChartOptions, ChartType, ChartDataset } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { routes } from "src/app/core/helpers/routes/routes";
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from "@angular/common";

type Label = string[];
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {

  totalFileCount: number = 0;
  totalActiveUser: number = 0;
  totalBlockUser: number = 0;
  totalActiveHod: number = 0;
  totalDepartment: number = 0;
  previousFileCount: number | null = null;
  isIncrease: boolean | null = null;
  isLoading: boolean = false; 
  public uName: any;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  public lableUser!: any;
  public userRole: any;
  public adi: any;
  chartOptions = {
    // Your chart options here
  };
  LoginComponentService: any;
  msg: string | undefined;
  res: any;
  date: any;
  departmentData: any;
  resArray: any;
  dateArray: string[] = [];
  deptDataArray: any[] = [];
  fileList: any[] = [];
  fileCount: any;
  incCount: any;
  pieRes:any;
  public barChartLabels2: string[] = [];
  public barChartType: ChartType = 'bar';
  public userId: any;
  userName: string | undefined;
  noRecordFlag: boolean = false;

  constructor(private router: ActivatedRoute, private loginService: LoginComponentService, private datePipe: DatePipe) {


    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  setLast7Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    this.bsRangeValue = [startDate, endDate];
    this.onDateRangeSelected();
  }

  onDateRangeSelected() {
    
    const startDate = this.formatDate(this.bsRangeValue[0]);
    const endDate = this.formatDate(this.bsRangeValue[1]);

    this.loginService.getTotalFileCount(startDate, endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);
          this.res = res.data;

          if (this.res != null) {

            this.fileCount = this.res.totalFileCount
            this.incCount = this.res.totalIncrement

          }
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });



    this.loginService.AllAdminFileList(startDate, endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.res = res;

          this.res = res.response;
          this.fileList = this.res;
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
       
      },
    });

    this.loginService.onDateRangeSelectedBar(startDate, endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const resData = JSON.parse(decryptedData);

          this.res = resData;
          this.resArray = this.res.data;
          this.dateArray = this.resArray[0].dateList || [];
          this.deptDataArray = this.resArray[0].listOfDepartmentDataListDto || [];

          this.barChartLabels2 = this.dateArray;
          this.barChartData2 = {
            labels: this.barChartLabels2,
            datasets: this.deptDataArray.map((deptData: any) => {
              return {
                data: deptData.departmentDataList || [],
                label: deptData.departmentName || '',
                stack: 'a'
              };
            })
          };
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

    
    this.loginService.onDateRangeSelectedPie(startDate, endDate).subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

           this.pieRes = res.data;

           this.pieChartData = {
            labels: this.pieRes.map((deptData: any) => deptData.dept), 
            datasets: [
              {
                data: this.pieRes.map((deptData: any) => deptData.userCount), 
              }
            ]
          };
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

  }

  // Helper method to format the date
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }


  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.userId = +params['userId'];
    });
    this.userName = localStorage.getItem('loggedUserName') ?? '';
    this.setLast7Days();
    this.loginService.getTotalActiveUser().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.totalActiveUser = res.data.activeUserCount;

        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

    this.loginService.getTotalBlockUser().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.totalBlockUser = res.data.totalBlockedUserCount;

        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

    this.loginService.getTotalActiveHods().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);
          this.totalActiveHod = res.data.totalActiveHodCount;

        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

    this.loginService.getTotalDepartment().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);

          this.totalDepartment = res.data.totalNumberOfDepartment;


        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.msg += " " + err.error.message;
        }
      },
    });

    const getSessionData = sessionStorage.getItem("Email");
    const getLocal = localStorage.getItem("EmailId");
    this.userRole = localStorage.getItem("user_role");
    this.lableUser = ['2/2/2024', '7/7/2024', '5/5/2024', '6/6/2024', '3/3/2024'];
  }

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public layoutWidth = "1";
  public routes = routes;


  public getUserRole() {
    return this.userRole;
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels1: string[] = ['07/07/2024', '08/07/2024', '09/07/2024', '10/07/2024', '11/07/2024', '12/07/2024', '13/07/2024'];
  public barChartLegend = true;
  public barChartPlugins = [];
  
  public barChartData2: ChartData<'bar'> = {
    labels: this.barChartLabels2,
    datasets: []
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels:[],
    datasets: [
      {
        data: [],
      },
    ],
  };

  public barChartData1: ChartData<'bar'> = {
    labels: this.barChartLabels1,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Operation A', stack: 'a' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Mechanical B', stack: 'a' },
      { data: [20, 40, 20, 10, 70, 17, 80], label: 'Electrical C', stack: 'a' }
    ]
  };


  // public pieChartData: ChartData<'pie', number[], string | string[]> = {
  //   labels: ['Mechanical', 'Electrical', 'Boiler', 'Civil', 'C&I', 'Turbine', 'Bop'],
  //   datasets: [
  //     {
  //       data: [300, 500, 100, 20, 23, 67, 90],
  //     },
  //   ],
  // };

  updateFileCount(newCount: number): void {
    if (this.previousFileCount === null) {
      this.isIncrease = null;  // Flat line on first load as there's nothing to compare to
    } else if (this.previousFileCount < newCount) {
      this.isIncrease = true;  // Show up arrow
    } else if (this.previousFileCount > newCount) {
      this.isIncrease = false;  // Show down arrow
    } else {
      this.isIncrease = null;  // Show flat line
    }

    this.previousFileCount = this.totalFileCount;
    this.totalFileCount = newCount;
  }

}



