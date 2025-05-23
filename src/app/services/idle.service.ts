import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import { throttle } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleSubject = new Subject<boolean>();
  private timeout = 600; //seconds
  private lastActivity?: Date;
  private idleCheckInterval = 600; //seconds
  private idleSubscription?: Subscription; 
  private clientData: any; 

  constructor() { 
    this.resetTimer();
    this.startWatching();
  }

  get idleState(): Observable<boolean>{
    return this.idleSubject.asObservable();
  }

  private startWatching(){
    this.idleSubscription = interval(this.idleCheckInterval * 1000)
    .pipe(throttle(() => interval(1000)))
    .subscribe(() => {
      const now = new Date();

      if(
        now.getTime() - this.lastActivity?.getTime()! > this.timeout * 1000
      ){

        this.idleSubject.next(true);

      }
    });
  }


  resetTimer(){
    this.lastActivity = new Date();
    this.idleSubject.next(false);
  }

stopWatching(){
  if(this.idleSubscription){
    this.idleSubscription.unsubscribe();
  }
}


setClientData(client: any): void {
  this.clientData = client;
  sessionStorage.setItem('clientData', JSON.stringify(client));
  console.log('Client data set in IdleService:', this.clientData);
}


getClientData(): any {
  const storedClient = sessionStorage.getItem('clientData');
  if (storedClient) {
    this.clientData = JSON.parse(storedClient);
  }
  return this.clientData; // Return data from localStorage
}








}
