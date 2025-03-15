import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadDocumentComponentService {

//  private baseUrl = 'http://103.168.18.28:8080';//dev server
private baseUrl = 'http://10.101.71.204:8080'; //prod server

  constructor(private http: HttpClient) { }

   allMainHeadList(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/main-head-dropdown`, {
        responseType: 'json'
      });
      return this.http.request(req);
    }

    allPlantList(getData: any, mainHead: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/${mainHead}`, {
        responseType: 'json'
      });
      return this.http.request(req);
    }

    allSubAreaList(getData: any, mainHead: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/cat-wise-dropdown/${getData}/${mainHead}`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }

    docTypeListData(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/documentType/getDocumentTypesAndSubTypes`, {
        responseType: 'json'
      });
      return this.http.request(req);
    }

    subDocTypeList(docId: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/documentType/getDocumentSubTypesBy/${docId}`, {
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

    addDept(payload:any): Observable<HttpEvent<any>> { 
      const req = new HttpRequest('POST', `${this.baseUrl}/department/add-new-department`, payload,{
        responseType: 'json'  
      });
    
      return this.http.request(req);
    }


    addSubArea(payload:any): Observable<HttpEvent<any>> {  
      const req = new HttpRequest('POST', `${this.baseUrl}/instrument/save-new-subarea`,payload, {
        responseType: 'json'  
      });
    
      return this.http.request(req);
    }

    getSubArea(startDate:any , endDate:any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/instrument/get-all-subarea?startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
        }

    getDeptList(startDate:any , endDate:any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/department/get-new-department?startDate=${startDate}&endDate=${endDate}`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
        }

}
