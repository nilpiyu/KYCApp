import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router } from '@angular/router'
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  private userCredentials={};
  private fieldErrors ={};
	@BlockUI() blockUI: NgBlockUI;
  
  constructor(private authenticationApiService:AuthenticationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef,private router:Router) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    
  }

  ngOnInit() {
  }

  public saveAndUpdatePassword(){
    this.sendPasswordResetLink(this.userCredentials);
  }

  public sendPasswordResetLink(userCredentials){
    this.blockUserInterface();
    this.authenticationApiService.sendPasswordResetLink(userCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        setTimeout(()=>{
          this.router.navigate(['/confirmation-of-reset']);
        }, 1000);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
       
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

  public checkMaxLength(length, data, messageId){
    if(data && data.length) {
      if(data.length >= length) {
        this.fieldErrors[messageId] = true;
      }
      else{
        this.fieldErrors[messageId] = false;
      }
    }
    else{
      this.fieldErrors[messageId] = false;
    }
  }
}
