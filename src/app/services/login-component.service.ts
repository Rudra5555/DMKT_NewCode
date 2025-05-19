import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginComponentService {

//  private baseUrl = 'http://103.168.18.28:8080'; //dev server
//  private baseUrl = 'http://10.101.71.204:8080'; //Vedanta dev server
// private baseUrl = 'https://10.101.71.190:8080'; //vedanta Prod Server
private baseUrl = 'https://dmkt.balco.in:8080';

  private secretKey = '1234567890123456'; // Must match Java key
  private iv = 'abcdefghijklmnop'; // Must match Java IV

  constructor(private http: HttpClient) { }

  convertEncToDec(encryptedData:string):any{

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(this.secretKey), {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
    
    // Convert bytes to string
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  }


  login(file: any): Observable<HttpEvent<any>> {
      const req = new HttpRequest('POST', `${this.baseUrl}/auth/login`, file, {
        responseType: 'json'
      });

      return this.http.request(req);
    }

    // (done)
    getPlantList(category: string): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/get-catwise-info/${category}/1`, {
        responseType: 'json'
      });
  
      return this.http.request(req);
    }

    // (done)
    allCategoryList(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/category/get-all-catefory`, {
        responseType: 'json'
      });
    
      return this.http.request(req);
    }
    
    // (done)
    allCategoryListHead(): Observable<HttpEvent<any>> {
      const req = new HttpRequest('GET', `${this.baseUrl}/catinfo/getmainhead`, {
        responseType: 'json'
      });
   
      return this.http.request(req);
}

// (done)
getDetailsByCateName(catName:any , catType:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/catinfo/getcategory/${catName}/${catType}`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getFileList(categoryList: Map<any, any>,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  const mainHead = categoryList.get('main-head');
  const plants = categoryList.get('plants');

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}&sFilter=DOCUMENT`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });

  return this.http.request(req);
}

getMainHeadFileList(categoryList: Map<any, any>,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  const mainHead = categoryList.get('main-head');
  const plants = categoryList.get('plants');

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getTotalFileCount(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-total-document-volume?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getTotalActiveUser(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-active-users`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getTotalBlockUser(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-blocked-users`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getTotalActiveHods(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-active-hod`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getTotalDepartment(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/admin-dashboard-data/get-all-department-count`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
onDateRangeSelectedPie(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/department-plot/user-dept-chart/${startDate}/${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
 }

// (done)
onDateRangeSelectedBar(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/department-plot/get-plot/${startDate}/${endDate}`, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
userNotification(userId: any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/get-user-access-notification/${userId}`, {
    responseType: 'json'
  });

  return this.http.request(req); 
}

// (done)
getNotifications(userId: any): Observable<any> {
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

// (done)
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

// (done)
AllAdminFileList(startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/document/get-info?fileName=&startDate=${startDate}&endDate=${endDate}&sort=refernceId,DESC`, {
    responseType: 'json'
  });

  return this.http.request(req);
}


// (done)
getFileLists(mainHead:any,plants:any,departmentName:any,subAreaName:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
// console.log( "from api call",mainHead,plants,departmentName,subAreaName,sDate,eDate);

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });

  return this.http.request(req); 
}

getFileListsByFilter(mainHead:any,plants:any,departmentName:any,subAreaName:any,sDate:any,eDate:any,docTypeFilter:any): Observable<HttpEvent<any>> {

  const url = `${this.baseUrl}/document/get-all-document-by-name/${mainHead}/${plants}/${departmentName}/${subAreaName}?startDate=${sDate}&endDate=${eDate}`;
  
  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });

  return this.http.request(req);
}

// (done)
getFileListforOther(mainHead:any,sDate:any,eDate:any): Observable<HttpEvent<any>> {
  
  const url = `${this.baseUrl}/document/get-all-doc-by-main-head/${mainHead}?startDate=${sDate}&endDate=${eDate}`;

  const req = new HttpRequest('GET', url, {
    responseType: 'json'
  });

  return this.http.request(req); 
}

// (done)
approvedDocList(userId: any,startDate:any , endDate:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/workflow/get-approval-docs/${userId}?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'json'
  });
  return this.http.request(req);
}

userUpload(file: FormData): Observable<HttpEvent<any>> {
  const req = new HttpRequest('POST', `${this.baseUrl}/doc-request/submit-request`, file, {
    responseType: 'json'  
  });

  return this.http.request(req);
}

// (done)
getDocumentType(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/documentType/getDocumentTypesAndSubTypes`, {
    responseType: 'json'  
  });

  return this.http.request(req);
}

librarianVerifyDoc(userId: any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/doc-request/view-request/${userId}`, {
    responseType: 'json'
  });

  return this.http.request(req);
}


upload(file: any): Observable<HttpEvent<any>> {
  
    const req = new HttpRequest('POST', `${this.baseUrl}/upload/multiple-doc-upload`, file, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  updateDocStatus(file: any): Observable<HttpEvent<any>> {
   
    const req = new HttpRequest('POST', `${this.baseUrl}/doc-request/update-doc-status`, file, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  // (done)
  libUploadDocNotific(): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/doc-request/workflow-count`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  // (done)
  appAndRejFileList(startDate:any , endDate:any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/doc-request/get-list-req-workflow?startDate=${startDate}&endDate=${endDate}`, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }
// (done)
  notificTwo(userId:any ): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/doc-request/get-user-notification/${userId}/1/100`, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

  // (done)
  allSearch(searchValue:any ): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/document/doc-search?sSearch=${searchValue}`, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

// (done)
  accessRole(loggedUserId:any ): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/user/get-access-roles/${loggedUserId}`, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

  addUser(payload:any ): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/user/set-user-info`,payload, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

  // (done)
  markedAsReadFileNotification(workflowDocId:any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/doc-request/notification-marking-as-read/${workflowDocId}`, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

  // (done)
  markedAsReadStatutoryNotification(stepId:any): Observable<HttpEvent<any>> {
    const req = new HttpRequest('GET', `${this.baseUrl}/workflow/notification-marking-as-read/${stepId}`, {
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

// (done)
getUserInfo(): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/user/get-all-user-info`, {
    responseType: 'json'
  });

  return this.http.request(req);
  }

// (done)
getFilterUserList(dept:any,plant:any): Observable<HttpEvent<any>> {
  const req = new HttpRequest('GET', `${this.baseUrl}/user/get-all-user-info?dept=${dept}&plant=${plant}`, {
    responseType: 'json'
  });

  return this.http.request(req);
  }

}
