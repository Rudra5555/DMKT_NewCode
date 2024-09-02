import { Component,OnDestroy,OnInit,ViewEncapsulation, inject } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';
import { CommonService } from './shared/common/common.service';
import { routes, url } from './core/core.index';
import { IdleService } from './services/idle.service';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
//import { UiSweetalertsComponent } from './feature-module/ui-interface/base-ui/ui-sweetalerts/ui-sweetalerts.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,

}) 
export class AppComponent implements OnInit,OnDestroy {
idleService = inject(IdleService);
timerInterval :  any;
timer:any;
private idleSubscription?: Subscription;

  title = 'template';
  base = '';
  page = '';
  last = '';

  constructor(
    private common: CommonService,
    private router: Router
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.router.events.subscribe((data: RouterEvent) => {
      // //console.log('base',this.base);
      // //console.log('page',this.page);
      // //console.log('last',this.last);
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    })
  }
 
  ngOnInit(): void {
  
  this.idleSubscription =  this.idleService.idleState.subscribe((isIdle) => {
    if(isIdle){
    this.withTitle();
      // //console.log('User is Idle');
    } else {
      // //console.log("User Is Active");
    }
   });
  
  }

  ngOnDestroy(): void {
    //console.log("AUto Destroy")
   if(this.idleSubscription){
    this.idleSubscription.unsubscribe();
   }
  }
 
  onUserAction(){
    this.idleService.resetTimer();
  }

  withTitle() {
    // Swal.fire({
    //   title: "The Internet?",
    //   text: "That thing is still around?"
      

    // })

    Swal.fire({
      title: "Session Timeout",
      text: "If you want to continue then click Yes! or you will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      timer: 6000
    }).then((result) => {
      
     
      if (result.isConfirmed) {
        Swal.fire({
          title: "Continue!",
          text: "You choose to continue this session.",
          icon: "success"
        });
      }else{
        // if(this.idleSubscription){
        //   this.idleSubscription.unsubscribe();
        //  }
        this.ngOnDestroy();
        localStorage.clear();
        this.router.navigate([routes.login]);
      }
     
    });
  }

    // // Keep me Signed in
    // public doUnload(): void {
    //   this.doBeforeUnload();
    // }
  
    // // Keep me Signed in
    // public doBeforeUnload(): void {
    //   //console.log("Tab distroyed")
    //   location.replace("https://www.w3schools.com")
    //   // Clear localStorage
    // this.ngOnDestroy();
    // }







  public getRoutes(events: url) {
    const splitVal = events.url.split('/');
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  }
}