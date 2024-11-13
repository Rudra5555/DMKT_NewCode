import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDocumentComponentService {
  // private baseUrl = 'http://localhost:8080';
  // private serverBaseUrl = 'http://10.101.71.204:9090';

 private baseUrl = 'http://103.168.18.28:8080';

  constructor(private http: HttpClient) { }



  // login(file: any): Observable<HttpEvent<any>> {
   
  //     const req = new HttpRequest('POST', `${this.baseUrl}/auth/login`, file, {
  //       responseType: 'json'
  //     });
  
  //     return this.http.request(req);
  //   }



  //   getPlantList(category: string): Observable<HttpEvent<any>> {
  //     const req = new HttpRequest('GET', `${this.baseUrl}/category/get-catwise-info/${category}/1`, {
  //       responseType: 'json'
  //     });
    
  //     return this.http.request(req);
  //   }


  //   allCategoryList(): Observable<HttpEvent<any>> {
  //     const req = new HttpRequest('GET', `${this.baseUrl}/category/get-all-catefory`, {
  //       responseType: 'json'
  //     });
    
  //     return this.http.request(req);
  //   }

   allMainHeadList(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/main-head-dropdown`, {
        responseType: 'json'
      });
        // console.log("main head list:::",req);
      return this.http.request(req);
    }

    allPlantList(getData: any, mainHead: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/${mainHead}`, {
        responseType: 'json'
      });
        // console.log("plant list:::",req);
      return this.http.request(req);
    }


    allSubAreaList(getData: any, mainHead: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/${mainHead}`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }

    allDataList(getData: any, mainHead: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/${mainHead}`, {
        responseType: 'json'
        
      });
    
      return this.http.request(req);
    }







    allPlantDepartmentSubAreaList(getData: any, mainHead: string): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/Main Head`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }






}
