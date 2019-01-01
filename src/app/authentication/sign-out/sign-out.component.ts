import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service'
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  constructor(
                private localStorageService:LocalStorageService, 
                private authenticationApiService:AuthenticationApiService,
                private toastsManager:ToastsManager,
                private viewContainerRef:ViewContainerRef,
                private router:Router
              ) { 
                this.toastsManager.setRootViewContainerRef(viewContainerRef);             
  }

  ngOnInit() {
  }

  public userSignOut(){
    this.blockUserInterface();
    this.authenticationApiService.userSignOut().subscribe(
      success=>{
        this.localStorageService.clearLocalStorage();
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      }
    );
  }

  /* It displays success Toaster.*/
  public successMessage(success){
    this.toastsManager.success(success.message);
  }

  /* It displays error Toaster.*/
  public errorMessage(error){
      let errorJSON=this.parseError(error._body);
      this.toastsManager.error(errorJSON.message);
  }
      
  /* It parses error object.*/
  public parseError(errorString){
      return JSON.parse(errorString);
  }

  /* It blocks UI. */
  public blockUserInterface(){
      this.blockUI.start("Wait...");
  }

  /* It unblocks UI.*/
  public unblockUserInterface(){
      this.blockUI.stop();
  }
}
