import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private countries=[];
  private userRegistration:any={"countryId":-1};
  private maxLengthExceeded=[];
  private captchaError = '';
  private isCapatcha:any = false;
  private captchaSiteKey;
  public barLabel: string = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];

  /* Decorators declaration section */
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('captcha') captcha:any;

  /* Instance variable declaration section.*/
	private fieldErrors:any = {};

  constructor(private authorizationApiService:AuthorizationApiService, private authenticationApiService:AuthenticationApiService, private router:Router,private viewContainerRef:ViewContainerRef,private toastsManager:ToastsManager) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.captchaSiteKey=environment.captchaKey;
  }

  ngOnInit() {
    this.getCountries();
  }

  public saveAndUpdateUserRegistration(){
    this.saveUser(this.userRegistration);
  }
  
  public saveUser(userRegistration){
    this.blockUserInterface();
    this.authenticationApiService.saveUser(userRegistration).subscribe(
      success=>{
        this.unblockUserInterface();
        this.captcha.reset();
        this.successMessage(success);
        setTimeout(()=>{
          this.router.navigate(['/registration-welcome']);
        }, 1000);
      }, 
      error=>{
        this.captcha.reset();
        this.unblockUserInterface();
        this.errorMessage(error);
        this.userRegistration={"countryId":-1};
      });
  }

  public getCountries(){
    this.blockUserInterface();
    this.authorizationApiService.getCountries().subscribe(
      success=>{
        this.unblockUserInterface();
        this.countries=success['data'];
      }, 
      error=>{
        this.unblockUserInterface();
      });
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
    }
    else{
      this.fieldErrors[messageId] = false;
    }
  }

  public showResponse(event) {
		this.captchaError = '';
		this.isCapatcha = true;
  }
  
  public getCaptchaKey(){
    this.captchaSiteKey=environment.captchaKey;
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
