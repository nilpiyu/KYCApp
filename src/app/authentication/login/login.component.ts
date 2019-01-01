import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { SignOutComponent } from './../sign-out/sign-out.component';
import { UserDashboardComponent } from './../../authorisation/user-dashboard/user-dashboard.component' 
import {environment} from '../../../environments/environment'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[SignOutComponent, UserDashboardComponent]
})
export class LoginComponent implements OnInit {

  /* Instance variable declaration section.*/
	private userLoginData = {};
  private fieldErrors:any = {};
  private secretModal=false;
  private secretLoginData={};
  private dashboard;
  private maxLengthExceeded=[];
  private captchaError = '';
  private isCapatcha:any = false;
  private captchaSiteKey;
  private authenticationStates:any[];
  private authenticationOTP:boolean=false;
  private authenticationStatus:string;
  private otpMessage:string;

	/* Decorator declaration section.*/
	@ViewChild('logInForm') logInForm:any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('captcha') captcha:any;
  @ViewChild("secretKeyForm") secretKeyForm:any;

	/* Method declaration section.*/
	constructor(private router: Router, private activatedRoute: ActivatedRoute,  private viewContainerRef:ViewContainerRef, private authenticationApiService:AuthenticationApiService, private localStorageService:LocalStorageService,private toastsManager:ToastsManager, private signOutComponent:SignOutComponent, private userDashboardComponent:UserDashboardComponent){
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
   // this.captchaSiteKey=environment.captchaKey;
    this.authenticationStates=["/", "/login", "/sign-out", "/register", "/forget-password", "/registration-welcome", "/emailverify", "/forgot", "/confirmation-of-reset", "/changepassword", "/token-validation", "/profile", "/security"];        
  }

	ngOnInit() {
  }
  
  public openModal(){
    // this.secretKeyForm.reset();
    this.secretModal=true;
  }
 
	/* It gets logged user In */
	public userLogin() {
		this.blockUserInterface();
		this.authenticationApiService.userLogin(this.userLoginData).subscribe(
			success => {       
        this.isCapatcha = false;
       // this.captcha.reset();                
        let userLoginData=success['data'];
        this.authenticationStatus=userLoginData["authenticationStatus"];
        let authenticationOTP=this.checkEnabledGoogle2FA(this.authenticationStatus);
        if(authenticationOTP){
          this.authenticationOTP=true;
          this.localStorageService.setGoogle2FAStatus(this.authenticationOTP);
          this.openModal();              
          return ;
        }
        if(this.authenticationStatus=="TOKEN_GENRATED"){
          this.openModal();
          this.setUserProfile(userLoginData);
        }
        if(this.authenticationStatus=="TOKEN_GENERATED_OTP"){
          this.setUserProfile(userLoginData);
          this.userSecretLogin();
        }   
        this.unblockUserInterface();        
			},
			error => {
       // this.captcha.reset();
        this.isCapatcha = false;
				this.unblockUserInterface();
        this.errorMessage(error);
				this.userLoginData = {};
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

  public setUserProfile(userLoginData){
    this. setUserLoginData(userLoginData)
    this.getMenus();
    this.userDashboardComponent.getUserProfileById(userLoginData['uid']);  
  }
  
  public setUserLoginData(userLoginData:object){
    this.localStorageService.setUserLastLoggedInTime(userLoginData['lastLogin']);
    this.localStorageService.setUserEmailId(userLoginData['email']);
    this.localStorageService.setUserRole(userLoginData['rolename'].toLowerCase());
    this.localStorageService.setUserId(userLoginData['uid']);
    this.localStorageService.setToken(userLoginData['token']);
  }

	/* It gets menus for loggen in user.*/
	public getMenus(){
    this.blockUserInterface();
		this.authenticationApiService.getMenus().subscribe(success=>{
      let userRoleName=this.localStorageService.getUserRole();
      let menus=JSON.parse(success['data'])[userRoleName];
      this.localStorageService.setUserMenus(menus);
      this.calculateMenusStates(menus);
      this.unblockUserInterface();
      this.dashboard=menus[0]['state'];
		}, error=>{
			this.unblockUserInterface();
			this.errorMessage(error);
		});
  }

  public calculateMenusStates(userMenus){
    let menusStates=this.authenticationStates;    
    for(let menusIndex in userMenus){
      if(userMenus[menusIndex] && userMenus[menusIndex]['state']){
        menusStates.push("/"+userMenus[menusIndex]['state']);
      }
      let children=userMenus[menusIndex]['children'];
      if(children){
        for(let childIndex in children){
          if(children[childIndex] && children[childIndex]['state']){
            menusStates.push("/"+children[childIndex]['state']);
          }
        }
      }
    }
    this.localStorageService.setStates("states", JSON.stringify(menusStates));
  }
  
  /*It gets user secret key*/
  public userSecretLogin(){
    this.blockUserInterface();
    this.authenticationApiService.secretKeyLogin(this.secretLoginData).subscribe(
      success =>{
        this.secretModal=false;            
        this.authenticationOTP=false;
        this.secretKeyForm.reset();
        if(this.userLoginData['totp']){
          delete this.userLoginData['totp'];
        }
        let secretLoginData=success['data'];
        let token=JSON.parse(secretLoginData);
        this.localStorageService.setBKVSToken(token['token']);
        this.localStorageService.setBKVSSecretKey(token['secret']);
        this.unblockUserInterface();
        this.router.navigate ([this.dashboard]);
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

  public closeSecretKeyLoginModal(){
    this.secretKeyForm.reset();
    delete this.userLoginData['totp'];
    this.secretLoginData['secret']=undefined;
    this.secretModal=false;
    this.isCapatcha = false;
    this.unblockUserInterface();
  }

  public showResponse(event) {
	//	this.captchaError = '';
		this.isCapatcha = true;
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
}