import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginComponentService {
 
  // private baseUrl = 'http://localhost:8080';
  // private serverBaseUrl = 'http://103.168.18.28:8080';

 private baseUrl = 'http://103.168.18.28:8080';

  constructor(private http: HttpClient) { }



  login(file: any): Observable<HttpEvent<any>> {
   
      const req = new HttpRequest('POST', `${this.baseUrl}/auth/login`, file, {
        responseType: 'json'
      });

  
      return this.http.request(req);
    }



    getPlantList(category: string): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/get-catwise-info/${category}/1`, {
        responseType: 'json'
      });
      
      return this.http.request(req);
    }


    // allCategoryList(): Observable<HttpEvent<any>> {
    //   const req = new HttpRequest('GET', `${this.baseUrl}/category/get-all-catefory`, {
    //     responseType: 'json'
    //   });
    
    //   return this.http.request(req);
    // }

    allCategoryList(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/get-all-catefory`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }
    allCategoryListHead(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/catinfo/getmainhead`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }


getDetailsByCateName(catName:any , catType:any): Observable<HttpEvent<any>> {
  //console.log("from api call :",catName, catType);
  
  const req = new HttpRequest('GET', `${this.baseUrl}/catinfo/getcategory/${catName}/${catType}`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }


getFileList(categoryList: Map<any, any>,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  const mainHead = categoryList.get('main-head');
  const plants = categoryList.get('plants');

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });
//console.log(req);

  return this.http.request(req);
  
}

getMainHeadFileList(categoryList: Map<any, any>,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  const mainHead = categoryList.get('main-head');
  const plants = categoryList.get('plants');

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });
//console.log(req);

  return this.http.request(req);
  
}



getTotalFileCount(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-total-document-volume?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

getTotalActiveUser(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-active-users`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

getTotalBlockUser(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-blocked-users`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

getTotalActiveHods(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-active-hod`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

getTotalDepartment(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-department-count`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

onDateRangeSelected(startDate:any , endDate:any): Observable<HttpEvent<any>> {

  //console.log('Formatted Start Date:', startDate);
  //console.log('Formatted End Date:', endDate);
  
  const req = new HttpRequest('GET', `${this.baseUrl}/department-plot/get-plot/${startDate}/${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }

onDateRangeSelectedPie(startDate:any , endDate:any): Observable<HttpEvent<any>> {

  //console.log('Formatted Start Date for Pie:', startDate);
  //console.log('Formatted End Date for Pie:', endDate);
  
  const req = new HttpRequest('GET', `${this.baseUrl}/department-plot/get-plot/${startDate}/${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
    }



// getPlantList(category: string): Observable<HttpEvent<any>> {
//   const req = new HttpRequest('GET', `${this.baseUrl}/category/get-catwise-info/${category}/1`, {
//     responseType: 'json'
//   });

//   return this.http.request(req);
// }


userNotification(userId: any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/get-user-access-notification/${userId}`, {
    responseType: 'json'
  });
  //console.log(req);
  return this.http.request(req);
 
  
}


getNotifications(userId: any): Observable<any> {
  //console.log("ID for Notifications:", userId);

  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/get-panding-notification-assignto/${userId}`, {
    responseType: 'json'
  });

  return this.http.request(req).pipe(
    catchError((error: any) => {
      console.error('Failed to fetch notifications:', error);
      return throwError(error);  // Rethrow the error to be handled later
    })
  );
}

updateDocumentStatus(payload: any) {
  return this.http.post(`${this.baseUrl}/workflow/update-current-workflow`, payload).pipe(
    catchError(error => {
      console.error('Error updating document status', error);
      return of(null);
    })
  );
}

searchDocuments(query: string): Observable<HttpEvent<any>> {

  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/search-docs?fileName=${query}`, {
    responseType: 'json'
  });

  return this.http.request(req);
  
}

requestSubmit(file: any): Observable<HttpEvent<any>> {
   
  const req = new HttpRequest('POST', `${this.baseUrl}/workflow/request-workflow`, file, {
    responseType: 'json'
  });

  return this.http.request(req);
}


AllAdminFileList(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/document/get-info?fileName=&startDate=${startDate}&endDate=${endDate}&sort=refernceId,DESC`, {
    responseType: 'json'
  });

  return this.http.request(req);
}



getFileLists(mainHead:any,plants:any,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });
//console.log(req);

  return this.http.request(req);
  
}


getFileListforOther(mainHead:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  
  const url = `${this.baseUrl}/document/get-all-doc-by-main-head/${mainHead}?startDate=${sDate}&endDate=${eDate}`;

  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });
//console.log(req);

  return this.http.request(req);
  
}


approvedDocList(userId: any,startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/get-approval-docs/${userId}?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'json'
  });
  //console.log(req);
  return this.http.request(req);
 
  
}


}
