import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router'
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocalStorageService } from './../../services/local-storage.service';
import { SignOutComponent } from './../sign-out/sign-out.component';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers:[SignOutComponent]
})
export class ChangepasswordComponent implements OnInit {

  private userCredentials={};
  private fieldErrors:any = {};
  private maxLengthExceeded=[]
  private authenticationOTP:boolean;
  public barLabel: string = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];
  
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private authenticationApiService:AuthenticationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef,private router:Router, private localStorageService:LocalStorageService, private signOutComponent:SignOutComponent) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.authenticationOTP=this.localStorageService.getGoogle2FAStatus();
  }

  public saveAndUpdatePassword(){
    this.changePassword(this.userCredentials);
  }    

  public changePassword(userCredentials){
    this.blockUserInterface();
    this.authenticationApiService.changePassword(userCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        setTimeout(()=>{
          this.signOutComponent.userSignOut();
          this.router.navigate(['/login']);              
        }, 1000);
      }, 
      error=>{
        this.unblockUserInterface();
        this.userCredentials={};
        this.errorMessage(error)
      });
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

  /* max length validation */
  public checkMaxLength(length, data, messageId){
    if(data && data.length) {
      if(data.length >= length) {
        this.fieldErrors[messageId] = true;
      }
      else{
        this.fieldErrors[messageId] = false;
      }
    } else {
      this.fieldErrors[messageId] = false;
    }
  }
}
