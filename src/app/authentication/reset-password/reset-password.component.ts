import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private userCredentials={};
  private maxLengthExceeded = [];
  private fieldErrors:any = {};
  private message:string;
  private authenticationOTP:boolean=false;
  public barLabel: string = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];

  @BlockUI() blockUI: NgBlockUI;

  constructor(private authenticationApiService:AuthenticationApiService, private activatedRoute:ActivatedRoute, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef,private router:Router) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((search: any) => {
      console.log("----search----", search);
      this.userCredentials['token']=search['params']['token'];
      this.authenticationOTP=JSON.parse(search['params']['totp']);
    });
  }

  public saveAndUpdatePassword(){
    if(this.userCredentials['password']==this.userCredentials['confirmedPassword']){
      this.resetPassword(this.userCredentials);
    }
  }

  public resetPassword(userCredentials){
    this.blockUserInterface();
    this.authenticationApiService.resetPassword(userCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        setTimeout(()=>{
          this.router.navigate(['/login']);
        }, 1000);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
        let navigationExtras: NavigationExtras = {
          queryParams: {
              "message": this.message+" To resend click reset button below.",
              "linkState":'reset-token-verification'
          }
        };
        this.router.navigate(['token-validation'], navigationExtras);
      });
  }

  /* It displays success Toaster.*/
  public successMessage(success){
    this.toastsManager.success(success.message);
  }

  /* It displays error Toaster.*/
  public errorMessage(error){
      let errorJSON=this.parseError(error._body);
      this.message=errorJSON.message;
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

  // public checkMaxLength(fieldName, maxLength){
  //   if(fieldName.value.length==maxLength){
  //       this.maxLengthExceeded[fieldName.name]=true;
  //   } else if(fieldName.value.length<maxLength){
  //       this.maxLengthExceeded[fieldName.name]=false;
  //   }
  // }

  /* max length validation */
  public checkMaxLength(length, data, messageId){
    if(data && data.length) {
      if(data.length >= length) {
        this.fieldErrors[messageId] = true;
      } else{
        this.fieldErrors[messageId] = false;
      }
    } else{
      this.fieldErrors[messageId] = false;
    }
  }
}
