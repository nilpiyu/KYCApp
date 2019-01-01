import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-confirmation-of-email',
  templateUrl: './confirmation-of-email.component.html',
  styleUrls: ['./confirmation-of-email.component.css']
})
export class ConfirmationOfEmailComponent implements OnInit {

  private message;
  private tokenMessage:string;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private authenticationApiService:AuthenticationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.message="Please Wait.. Confirmation is in progress.";
  }

  ngOnInit() {
   this.getRegisteredUserToken();
  }

  public getRegisteredUserToken(){
    this.activatedRoute.queryParamMap.subscribe((search: any) => {
      let userVerificationToken=search['params']['token'];
      this.userEmailVerification(userVerificationToken);
    });
  }

  public userEmailVerification(userVerificationToken){
    this.blockUserInterface();
    this.authenticationApiService.userEmailVerification(userVerificationToken).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.message="Thank You for Confirmation. It has been "+success['message'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
        let navigationExtras: NavigationExtras = {
          queryParams: {
              "tokenMessage": this.tokenMessage,
              "linkState":'register-token-verification'
          }
        };
        setTimeout(()=>{
          this.router.navigate(['token-validation'], navigationExtras);
        }, 1000);
      });
  }

  /* It displays success Toaster.*/
  public successMessage(success){
      this.toastsManager.success(success.message);
  }
  
  /* It displays error Toaster.*/
  public errorMessage(error){
      let errorJSON=this.parseError(error._body);
      this.tokenMessage=errorJSON.message;
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
