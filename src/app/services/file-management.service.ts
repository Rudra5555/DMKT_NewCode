import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  
  public directory:any;
  // private baseUrl = 'http://103.168.18.28:8080'; //dev server
  // private baseUrl = 'http://10.101.71.204:8080'; //vedanta dev server
  private baseUrl = 'http://10.101.71.190:8080'; //vedanta Prod Server

  constructor(private http: HttpClient) { }

  upload(file: any): Observable<HttpEvent<any>> {    
    const req = new HttpRequest('POST', `${this.baseUrl}/upload/multiple-doc-upload`, file, {
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
