import { Injectable } from '@angular/core';
import { HttpEvent, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject, ReplaySubject} from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SessionExpireService implements HttpInterceptor {
    
      constructor(private router:Router, private localStorageService:LocalStorageService) {
      }
    
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        return next.handle(req).map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status==200) {
            console.log('HttpResponse::event =', event, ';');
          } else console.log('event =', event, ';');
          return event;
        })
        .catch((err: any, caught) => {
          if (err instanceof HttpErrorResponse) {
            console.log("err--", err);
            let error={_body:JSON.stringify(err['error'])};
            if (err['error'] && (err['error']['status'] == 401) && (err['error']['message']=="Session Expired,please login Again.")) {
              console.log("Inside");
              setTimeout(()=>{
                this.localStorageService.clearLocalStorage();
                return this.router.navigate(['/login']);              
              }, 1000);
            }
            return Observable.throw(error);
          }
        });
      }
    }
    