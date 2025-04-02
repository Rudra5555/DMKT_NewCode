import { Component ,Input,OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { DataService, SideBar, SideBarMenu, routes } from 'src/app/core/core.index';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { CommonService } from 'src/app/shared/common/common.service';
import {AdminDashboardComponent} from 'src/app/feature-module/main/dashboard/admin-dashboard/admin-dashboard.component'
import { LoginComponentService } from 'src/app/services/login-component.service';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-menu-one',
  templateUrl: './side-menu-one.component.html',
  styleUrls: ['./side-menu-one.component.scss'],
})
export class SideMenuOneComponent implements OnDestroy,OnInit{
  public roleData : any;
  public rData: any 
  public userRole :any;
  public menuFlag = 1;
  public routes = routes;
  public multilevel: Array<boolean> = [false, false, false];
  base = 'dashboard';
  page = '';
  last = '';
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  side_bar_data: Array<SideBar> = [];

  languages = [];
  sub: Subscription = new Subscription;
  @Input() childProperty: any;
  role:any;
  respData:any;
  notifiCount:any;

  constructor(
    public router: Router,
    private data: DataService,
    private sideBar: SideBarService,
    private common: CommonService,
    private loginService : LoginComponentService
   
  ) {
    
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        this.last = splitVal[3];
      }
    });

    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
  }
  public count = 0;
  ngOnInit(): void {

    this.getUploadDocNotification();

    this.rData = localStorage.getItem('role')

    if(this.rData == "Admin")
      {
        this.data.getSideBarData.subscribe((res: Array<SideBar>) => {
          this.side_bar_data = res;
       
        });
      }
      if(this.rData == "Librarian")
        {
          this.data.getSideBarData1.subscribe((res: Array<SideBar>) => {
            this.side_bar_data = res;
      
          });
        }
        if(this.rData == "User")
          {
            this.data.getSideBarData2.subscribe((res: Array<SideBar>) => {
              this.side_bar_data = res;
            
            });
          }
          if(this.rData == "SuperUser")
            {
              this.data.getSideBarData3.subscribe((res: Array<SideBar>) => {
                this.side_bar_data = res;
            
              });
            }
            if(this.rData == "HOD")
              {
                this.data.getSideBarData4.subscribe((res: Array<SideBar>) => {
                  this.side_bar_data = res;
              
                });
              }
        
      



    //console.log("SIDE MENU %%%% :",this.rData)
  this.role = this.data.send_data.next;

   if(this.count == 0){

this.count++;

   }
 
  }


  getUploadDocNotification() {
  
    this.loginService.libUploadDocNotific().subscribe({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const decryptedData = this.loginService.convertEncToDec(event.body);
          const res = JSON.parse(decryptedData);
          
          this.respData = res;
          this.notifiCount = this.respData.data;
  
        // console.log("ppppppp",this.notifiCount);
        
  
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          // this['msg'] += " " + err.error.message;
        }
      },
    });
  }

  
  public miniSideBarMouseHover(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  public expandSubMenus(menu: SideBarMenu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          // //console.log("resMenu.menuValue === menu.menuValue");
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            // //console.log("menu.showSubRoute === false");
            sessionStorage.removeItem('menuValue');
          }
          // else{
          //   //console.log("menu.showSubRoute === true");
          // }
        } else {
          //console.log("resMenu.menuValue !=== menu.menuValue");
          
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.data.resetData();
  }
  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  openMenu(menu: any): void {
     //console.log("Sub menu ...");
    if (this.openMenuItem === menu) {
      //console.log("close --?? Sub menu ...");
      this.openMenuItem = null; 
    } else {
      this.openMenuItem = menu; 
      localStorage.setItem("subSideMenu",this.openMenuItem );
      
      //console.log("close --?? ...");
    
    }
  }
  openSubmenuOne(subMenus: any): void {
    // //console.log("Sub menu ...");
    
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null; 
    } else {
      this.openSubmenuOneItem = subMenus; 
    }
  }

   
  }




