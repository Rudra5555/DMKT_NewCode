import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Subject } from 'rxjs';
import {
  HorizontalSideBar,
  SideBar,
  SideBarMenu,
  apiResultFormat,
  routes,
} from '../../core.index';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {

  send_data = new Subject<any>();


  allAppliedCandidates!: Array<object>;
  userRole: any;
  behaviorSubject = new BehaviorSubject<string>('')


  constructor(private http: HttpClient) { }
  ngOnInit(): void {

  }

  public getEmployees(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/employee.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getallAppliedCandidates(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/applied-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getholidays(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/holidays.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLeave(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leave-admin.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDepartment(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/department.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDesignations(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/designation.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTimeSheet(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/timesheet.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getShiftSchedule(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/shift.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getShiftList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/shiftlist.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getOverTime(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/overtime.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getClient(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/clients.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getProjects(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/projects.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getTickets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/tickets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEstimate(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/estimates.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getInvoice(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/invoice-page.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPayment(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/payments.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenses(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/expenses.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getProvidentFund(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/provident-fund.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTaxes(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/taxes.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCategories(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/categories.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getBudgets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/budgets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeSalary(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-salary.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll1(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item1.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll2(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item2.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAddPayroll3(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payroll-item3.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPolicies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/policies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenseReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/expense-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoiceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoice-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPaymentReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payment-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/project-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getTaskReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/task-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getUserReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/user-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEmployeeReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/employee-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPayslipReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/payslip-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendanceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attendance-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAttendReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/attend-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getLeaveReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leave-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDailyReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/daily-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPerformanceReport(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-indicator.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPerformanceappraisal(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/performance-appraisal.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getGoalList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getGoalType(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/goal-type.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTrainList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTrainType(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/training-type.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTrainer(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/trainers.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPromotion(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/promotion.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getResignation(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/resignation.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTermination(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/termination.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-page.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAllJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-all.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSavedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-saved.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAppliedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-applied.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOfferedJobs(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-offered.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getVisited(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-visited.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getArchived(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/user-dashboard-archived.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getManageJobs(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/manage-jobs.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getManageResume(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/manage-resumes.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getShortList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/shortlist-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInterview(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/interview-questions.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getOffer(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/offer-approval.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getExpire(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/experience-level.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSchedule(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/schedule-timing.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/candidates-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResult(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeResults(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/aptitude-result.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAptitudeCandidate(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/applied-candidate.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUsers(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/users.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSubscribed(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/subscribed-company.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDataTable(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/form-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsCategory(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-category.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getAssetsNew(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/assets-new.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/assets-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectContent(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/JSON/project-content.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinterview(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/interview.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPipeline(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/pipeline.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getContactlist(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/contact-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCompanies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/companies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLeads(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/leads-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getdeals(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/deals-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getActivities(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/activity.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  public sideBar: SideBar[] = [
    {
      tittle: 'Main',
      icon: 'airplay',
      showAsTab: false,
      separateRoute: false,
      menu: [

      ],
    },

    {
      tittle: 'Admin Dashboard',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'Admin Dashboard',
          route: routes.admin,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user',
          base: 'clients',
          page1: 'client-page',
          materialicons: 'person',
          subMenus: [],
        },
      ]

    },




    {
      tittle: 'User Management',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'User Management',
          route: routes.userList,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'users',
          base: 'clients',
          page1: 'client-list',
          materialicons: 'person',
          subMenus: [],
        },

        {
          menuValue: ' Document ',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-text',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: ' Add Department ',
          route: routes.DepartmentComponent,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'cube',
          base: 'page',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: ' Add Sub-Area ',
          route: routes.SubAreaComponent,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'cube',
          base: 'page',
          materialicons: 'person',
          subMenus: [],
        },
      ]

    },

    {
      tittle: '',
      icon: '',
      showAsTab: true,
      separateRoute: false,
      menu: [

      ]
    },

  ];




  public sideBar1: SideBar[] = [
    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'Librarian Dashboard',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user',
          base: 'admin',
          materialicons: 'person',
          subMenus: [],
        },


        {
          menuValue: 'Recent Updated Documents',
          route: routes.LibRecentUploaded,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'book',
          base: 'admin',
          materialicons: 'person',
          subMenus: [],
        },
      ]


    },
    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'Upload Document',
          route: routes.UploadDoc,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-upload',
          base: 'admin',
          materialicons: 'person',
          subMenus: [],
        },

      ]

    },

    {
      tittle: '',
      icon: '',
      showAsTab: true,
      separateRoute: false,
      menu: [

        {
          menuValue: 'User Management',
          route: routes.userList,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'users',
          base: 'clients',
          page1: 'client-list',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: 'Verify Uploaded Doc',
          route: routes.verifyuploadeddocument,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-upload',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: 'A&R Doc List',
          route: routes.approvedrejectdocument,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'book',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },

      ]
    },


  ];


  public sideBar2: SideBar[] = [

    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'User Dashboard',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user',
          base: 'admin',
          materialicons: 'person',
          subMenus: [],
        },]

    },
    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

       
        {
          menuValue: 'Statutory Document List',
          route: routes.StatutoryDoc,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'book-open',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: ' Requested Document List',
          route: routes.RequestedDoc,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'book',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: 'Document Upload Page',
          route: routes.UserDocumentUpload,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-upload',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: 'Statutory Notification List',
          route: routes.StatutoryDocNotificationComponent,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'bell',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        }, 
        {
          menuValue: 'File Upload Notification List',
          route: routes.FileUploadNotificationComponent,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
      ]


    },






    {
      tittle: '',
      icon: '',
      showAsTab: true,
      separateRoute: false,
      menu: [



      ]
    },


  ];



  public sideBar3: SideBar[] = [


    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'SuperUser Dashboard',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user',
          base: 'admin',
          materialicons: 'person',
          subMenus: [],
        },]

    },
    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        // {
        //   menuValue: 'Statutory Document List',
        //   route: routes.StatutoryDoc,
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   icon: 'book-open',
        //   base: 'HOD',
        //   materialicons: 'person',
        //   subMenus: [],
        // },
        // {
        //   menuValue: ' Requested Document List',
        //   route: routes.RequestedDoc,
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   icon: 'book',
        //   base: 'HOD',
        //   materialicons: 'person',
        //   subMenus: [],
        // },
        {
          menuValue: 'Document Upload Page',
          route: routes.UserDocumentUpload,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file-upload',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
        {
          menuValue: 'File Upload Notification List',
          route: routes.FileUploadNotificationComponent,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'file',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },
      ]


    },
    {
      tittle: '',
      icon: '',
      showAsTab: true,
      separateRoute: false,
      menu: [


      ]
    },

  ];

  public sideBar4: SideBar[] = [

    {
      tittle: '',
      icon: '',
      showAsTab: false,
      separateRoute: false,
      menu: [

        {
          menuValue: 'HOD Dashboard',
          route: routes.employee,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'user',
          base: 'HOD',
          materialicons: 'person',
          subMenus: [],
        },]

    },
    {
      tittle: '',
      icon: 'layers',
      showAsTab: false,
      separateRoute: false,
      menu: [


      ]

    },
    {
      tittle: '',
      icon: '',
      showAsTab: true,
      separateRoute: false,
      menu: [

      ]
    },

  ];


  public getSideBarData: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar);
  public resetData(): void {
    this.sideBar.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }

  public getSideBarData1: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar1);
  public resetData1(): void {
    this.sideBar1.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }


  public getSideBarData2: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar2);
  public resetData2(): void {
    this.sideBar2.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }



  public getSideBarData3: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar3);
  public resetData3(): void {
    this.sideBar3.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }

  public getSideBarData4: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar4);
  public resetData4(): void {
    this.sideBar4.map((res: SideBar) => {
      res.showAsTab = false;
      res.menu.map((menus: SideBarMenu) => {
        menus.showSubRoute = false;
      });
    });
  }


  allCustomPolicy = [
    {
      id: 1,
      name: 'John deo',
      days: 5,
    },
  ];

  companiesList = [
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
    {
      id: 1,
      company: 'Delta Infotech',
    },
  ];

  clientsDatas = [
    {
      name: 'Barry Cuda',
      role: 'CEO',
      company: 'Global Technologies',
      image: 'avatar-19',
      clientId: 'CLT-0008',
      email: 'barrycuda@example.com',
      phone: '9876543210',
      status: 'Active',
      id: 1,
      img: 'assets/img/profiles/avatar-19.jpg',
    },
    {
      name: 'Tressa Wexler',
      role: 'Manager',
      company: 'Delta Infotech',
      image: 'avatar-29',
      clientId: 'CLT-0003',
      email: 'tressawexler@example.com',
      phone: '9876543211',
      status: 'Inactive',
      id: 2,
      img: 'assets/img/profiles/avatar-29.jpg',
    },
    {
      name: 'Ruby Bartlett ',
      role: 'CEO',
      company: 'Cream Inc',
      image: 'avatar-07',
      clientId: 'CLT-0002',
      email: 'rubybartlett@example.com',
      phone: '9876543212',
      status: 'Inactive',
      id: 3,
      img: 'assets/img/profiles/avatar-07.jpg',
    },
    {
      name: 'Misty Tison',
      role: 'CEO',
      company: 'Wellware Company',
      image: 'avatar-06',
      clientId: 'CLT-0001',
      email: 'tisonmisty@example.com',
      phone: '9876543213',
      status: 'Inactive',
      id: 4,
      img: 'assets/img/profiles/avatar-06.jpg',
    },
    {
      name: 'Daniel Deacon',
      role: 'CEO',
      company: 'Mustang Technologies',
      image: 'avatar-14',
      clientId: 'CLT-0006',
      email: 'danieldeacon@example.com',
      phone: '9876543214',
      status: 'Active',
      id: 5,
      img: 'assets/img/profiles/avatar-14.jpg',
    },
    {
      name: 'Walter  Weaver',
      role: 'CEO',
      company: 'International Software',
      image: 'avatar-18',
      clientId: 'CLT-0007',
      email: 'walterweaver@example.com',
      phone: '9876543215',
      status: 'Active',
      id: 6,
      img: 'assets/img/profiles/avatar-18.jpg',
    },
    {
      name: 'Amanda Warren',
      role: 'CEO',
      company: 'Mercury Software Inc',
      image: 'avatar-28',
      clientId: 'CLT-0005',
      email: 'amandawarren@example.com',
      phone: '9876543216',
      status: 'Active',
      id: 7,
      img: 'assets/img/profiles/avatar-28.jpg',
    },
    {
      name: 'Bretty Carlson',
      role: 'CEO',
      company: 'Carlson Technologies',
      image: 'avatar-13',
      clientId: 'CLT-0004',
      email: 'bettycarlson@example.com',
      phone: '9876543217',
      status: 'Inactive',
      id: 8,
      img: 'assets/img/profiles/avatar-13.jpg',
    },
  ];

  projects = [
    {
      name: 'Office Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Aravind',
      teamMember: 'Prakash',
      projectId: 'PRO-001',
      id: 1,
    },
    {
      name: 'Hospital Administration',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Ashok',
      teamMember: 'Aravind',
      projectId: 'PRO-001',
      id: 2,
    },
    {
      name: 'Project Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-08-2023',
      startDate: '17-07-2023',
      priority: 'High',
      projectleader: 'vijay',
      teamMember: 'prakash',
      projectId: 'PRO-001',
      id: 3,
    },
    {
      name: 'Video Calling App',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-03-2023',
      priority: 'High',
      projectleader: 'Ashok',
      teamMember: 'Aravind',
      projectId: 'PRO-001',
      id: 4,
    },
    {
      name: 'Project Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-08-2023',
      startDate: '17-07-2023',
      priority: 'High',
      projectleader: 'vijay',
      teamMember: 'prakash',
      projectId: 'PRO-001',
      id: 5,
    },
    {
      name: 'Office Management',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. When an unknown printer took a galley of type and scrambled it...',
      endDate: '17-04-2023',
      startDate: '17-04-2023',
      priority: 'High',
      projectleader: 'Aravind',
      teamMember: 'Prakash',
      projectId: 'PRO-001',
      id: 6,
    },
  ];

  allKnowledgeBase = [
    {
      title: 'Installation & Activation',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 1,
    },
    {
      title: 'Premium Members Features',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 2,
    },
    {
      title: 'API Usage & Guide lines',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 3,
    },
    {
      title: 'Getting Started',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 4,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 5,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 6,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 7,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 8,
    },
    {
      title: 'Lorem ipsum dolor',
      list1: 'Sed ut perspiciatis unde omnis?',
      list2: 'Sed ut perspiciatis unde omnis?',
      list3: 'Sed ut perspiciatis unde omnis?',
      list4: 'Sed ut perspiciatis unde omnis?',
      list5: 'Sed ut perspiciatis unde omnis?',
      id: 9,
    },
  ];

  allroles = [
    {
      roleName: 'Administrator',
      id: 1,
    },
    {
      roleName: 'CEO',
      id: 2,
    },
    {
      roleName: 'Manager',
      id: 3,
    },
    {
      roleName: 'Team Leader',
      id: 4,
    },
    {
      roleName: 'Accountant',
      id: 5,
    },
    {
      roleName: 'Web Developer',
      id: 6,
    },
    {
      roleName: 'Web Designer',
      id: 7,
    },
    {
      roleName: 'HR',
      id: 8,
    },
    {
      roleName: 'UI/UX Developer',
      id: 9,
    },
    {
      roleName: 'SEO Analyst',
      id: 10,
    },
  ];

  allLeaveType = [
    {
      leaveType: 'Casual Leave',
      leaveDays: '12 Days',
      id: 1,
      status: 'Active',
    },
    {
      leaveType: 'Medical Leave',
      leaveDays: '12 Days',
      id: 2,
      status: 'Inactive',
    },
    {
      leaveType: 'Loss of Pay',
      leaveDays: '10 Days',
      id: 3,
      status: 'Active',
    },
  ];
  lstEmployee = [
    {
      firstname: 'John Doe',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Designer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 1,
      img: 'assets/img/profiles/avatar-02.jpg',
    },
    {
      firstname: 'Richard Miles',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 2,
      img: 'assets/img/profiles/avatar-09.jpg',
    },
    {
      firstname: 'John Smith',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-05-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 3,
      img: 'assets/img/profiles/avatar-10.jpg',
    },
    {
      firstname: 'Mike Litorus',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'IOS Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 4,
      img: 'assets/img/profiles/avatar-05.jpg',
    },
    {
      firstname: 'Wilmer Deluna',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 5,
      img: 'assets/img/profiles/avatar-01.jpg',
    },
    {
      firstname: 'Jeffrey Warden',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web  Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 6,
      img: 'assets/img/profiles/avatar-12.jpg',
    },
    {
      firstname: 'Bernardo Galaviz',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Web  Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 7,
      img: 'assets/img/profiles/avatar-13.jpg',
    },
    {
      firstname: 'Lesley Grauer',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 8,
      img: 'assets/img/profiles/avatar-16.jpg',
    },
    {
      firstname: 'Jeffery Lalor',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Team Leader',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 9,
      img: 'assets/img/profiles/avatar-16.jpg',
    },
    {
      firstname: 'Loren Gatlin',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 10,
      img: 'assets/img/profiles/avatar-04.jpg',
    },
    {
      firstname: 'Tarah Shropshire',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 11,
      img: 'assets/img/profiles/avatar-03.jpg',
    },
    {
      firstname: 'Catherine Manseau',
      lastname: 'Manseau',
      username: 'Manseau',
      password: '123445',
      confirmpassword: '123456',
      department: 'software',
      designation: 'Android Developer',
      phone: '9842354254',
      email: 'catherine@example.com',
      mobile: '9876543210',
      joindate: '18-04-2013',
      role: 'Web Developer',
      employeeId: 'FT-0001',
      company: 'FT-0001',
      id: 12,
      img: 'assets/img/profiles/avatar-08.jpg',
    },
  ];
  public getDoclist(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/JSON/doc-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

}
