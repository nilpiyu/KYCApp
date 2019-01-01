import { Component, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router:Router, private localStorageService:LocalStorageService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef){
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    let authenticationStates=["/", "/login", "/sign-out", "/register", "/forget-password", "/registration-welcome", "/emailverify", "/forgot", "/confirmation-of-reset", "/changepassword", "/token-validation","/bkvs-verification","/bkvs-verification-error","/bkvs-verification-grantaccess","/bkvs-verification-login","/bkvs-verification-register", "/profile"];
    // this.localStorageService.setStates("authStates", JSON.stringify(authenticationStates));    
    this.router.events.subscribe((e: any) => {
        let menusStates:any[];
        menusStates=JSON.parse(this.localStorageService.getStates("states"));
        if(!menusStates){
          menusStates=authenticationStates;
        }
        if(e instanceof NavigationError){
          let currentState=this.localStorageService.getCurrentState();
          this.toastsManager.error("Invalid URL "+e.url.split("/")[1]);        
          this.router.navigate([currentState]);
        } else if(e instanceof NavigationEnd){
          let currentState=this.localStorageService.getCurrentState();
          let navigateState=e.url;
          this.localStorageService.setCurrentState(navigateState);
          let splitedStates=navigateState.split("?");
          let matchNavigateState=splitedStates[0];
          let stateExists=menusStates.indexOf(matchNavigateState);
          if(stateExists==-1){
            if(currentState && currentState!=navigateState){
              this.localStorageService.setCurrentState(currentState);
              this.router.navigate([currentState]);    
              this.toastsManager.error("Unauthorised "+e.url);             
            }
          }
        }
    });
  }
}
