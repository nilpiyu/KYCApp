import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params , NavigationExtras} from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { SignOutComponent } from './../../authentication/sign-out/sign-out.component';
import {environment} from '../../../environments/environment'
import {BKVSVerificationComponent} from './../bkvs-verification.component';

@Component({
  selector: 'bkvs-verification-login',
  templateUrl: './bkvs-verification-login.component.html',
  styleUrls: ['./bkvs-verification-login.component.css'],
  providers:[SignOutComponent,BKVSVerificationComponent]
})
export class BKVSVerificationLoginComponent implements OnInit {

  /* Instance variable declaration section.*/
	private userLoginData = {};
  private fieldErrors:any = {};
  private secretModal=false;
  private secretLoginData={};
  private maxLengthExceeded=[];
  private captchaError = '';
  private isCapatcha:any = false;
  private captchaSiteKey;
 private email: string;
 private authenticationStates:any[];
 private authenticationOTP: boolean = false;
 private authenticationStatus : string;
 private otpMessage:string;

	/* Decorator declaration section.*/
	@ViewChild('logInForm') logInForm:any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('captcha') captcha:any;
  @ViewChild('secretKeyForm') secretKeyForm:any;

	/* Method declaration section.*/
	constructor(
    private bKVSVerificationComponent: BKVSVerificationComponent,private router: Router, private activatedRoute: ActivatedRoute,  private viewContainerRef:ViewContainerRef, private authenticationApiService:AuthenticationApiService, private localStorageService:LocalStorageService,private toastsManager:ToastsManager, private signOutComponent:SignOutComponent){
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.captchaSiteKey = environment.captchaKey;

  }

	ngOnInit() {
    this.blockUserInterface();
    if ( !this.bKVSVerificationComponent.allQueryParamsExistInsideLocalStorage()) {
      console.log('inside right case ');
      const redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true});
      const navigationExtras: NavigationExtras = { queryParams: {redirectUrl : redirectUrl ,
        errormessage: 'Invalid Social KYC Verfication Request.'} };
     this.localStorageService.clearLocalStorage();
     this.unblockUserInterface();
     this.router.navigate(['bkvs-verification-error'], navigationExtras);
    } else {
      console.log('inside right case ');
      this.userLoginData['email'] = localStorage.getItem('email');
      this.email= this.userLoginData['email'];
    this.unblockUserInterface();
  }
  }
  public openModal(){
    this.secretModal=true;
    this.secretLoginData['secret']="";
  }
 
	/* It gets logged user In */

  public userLogin() {
		this.blockUserInterface();
		this.authenticationApiService.userLogin(this.userLoginData).subscribe(
success => {
        this.isCapatcha = false;
        this.captcha.reset();
        let userLoginData=success['data'];
        this.authenticationStatus=userLoginData["authenticationStatus"];
        let authenticationOTP=this.checkEnabledGoogle2FA(this.authenticationStatus);
        if(authenticationOTP){
          this.authenticationOTP=true;
          this.openModal();              
          return ;
        }
        if(this.authenticationStatus=="TOKEN_GENRATED"){
          this.openModal();
          this.setUserProfile(userLoginData);
        }
        if ( this.authenticationStatus === 'TOKEN_GENERATED_OTP') {
          this.setUserProfile(userLoginData);
          this.userSecretLogin();
        }
        this.unblockUserInterface();
			},
			error => {
        this.captcha.reset();
        this.isCapatcha = false;
				this.unblockUserInterface();
        this.errorMessage(error);
				this.userLoginData = {"email":localStorage.getItem("email")};
			});
  }

  public checkEnabledGoogle2FA(authenticationStatus){
    if(authenticationStatus=="GAUTH_REQUIRED" || authenticationStatus=="INVALID_OTP"){
      this.userLoginData['totp']="";  
      if(authenticationStatus=="GAUTH_REQUIRED"){
        this.otpMessage="";
      }
      if(authenticationStatus=="INVALID_OTP"){        
        this.otpMessage="OTP is invalid";
        this.errorMessage({"_body":JSON.stringify({"message":this.otpMessage})});
      }
      return true;
    }
    return false;
  }
  public getMenus(){
    this.blockUserInterface();
		this.authenticationApiService.getMenus().subscribe(success=>{
      let userRoleName=this.localStorageService.getUserRole();
      let menus=JSON.parse(success['data'])[userRoleName];
      this.localStorageService.setUserMenus(menus);
      //this.calculateMenusStates(menus);
      this.unblockUserInterface();
      //this.dashboard=menus[0]['state'];
		}, error=>{
			this.unblockUserInterface();
			this.errorMessage(error);
		});
  }

  public setUserLoginData(userLoginData:object){
    this.localStorageService.setUserLastLoggedInTime(userLoginData['lastLogin']);
    this.localStorageService.setUserEmailId(userLoginData['email']);
    this.localStorageService.setUserRole(userLoginData['rolename'].toLowerCase());
    this.localStorageService.setUserId(userLoginData['uid']);
    this.localStorageService.setToken(userLoginData['token']);
    this.localStorageService.setUserProfileImage(userLoginData['profileImagePath']);
  }
  public setUserProfile(userLoginData){
    this. setUserLoginData(userLoginData)
    this.getMenus();
//    this.userDashboardComponent.getUserProfileById(userLoginData['uid']);  
  }
  
  /*It gets user secret key*/
  public userSecretLogin(){
    this.secretModal=false;
    this.blockUserInterface();
    this.authenticationApiService.secretKeyLogin(this.secretLoginData).subscribe(
      success =>{
        let secretLoginData=success['data'];
        let token=JSON.parse(secretLoginData);
        this.localStorageService.setBKVSToken(token['token']);
        this.localStorageService.setBKVSSecretKey(token['secret']);
        this.unblockUserInterface();
        this.router.navigate (['bkvs-verification-grantaccess']);
        this.successMessage(success);
      },
      error => {

        console.log("----error----", error, "-----authenticationOTP----", this.authenticationOTP);
        this.unblockUserInterface();
        this.isCapatcha = false;
        // this.userLoginData={};
        this.secretLoginData['secret']=undefined;
        // this.signOutComponent.userSignOut();
        this.errorMessage(error);

      }
    )
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
    }
    else{
      this.fieldErrors[messageId] = false;
    }
  }

  public showResponse(event) {
		this.captchaError = '';
		this.isCapatcha = true;
  }

}