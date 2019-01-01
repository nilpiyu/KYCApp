import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params , NavigationExtras} from '@angular/router';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import {environment} from '../../../environments/environment';
 import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'bkvs-verification-register',
  templateUrl: './bkvs-verification-register.component.html',
  styleUrls: ['./bkvs-verification-register.component.css']
})
export class BKVSVerificationRegisterComponent implements OnInit {

  private countries=[];
  private userRegistration={};
  private maxLengthExceeded=[];
  private captchaError = '';
  private isCapatcha:any = false;
  private captchaSiteKey;
  private email: string;
  private countryCode: string;
  private countryName: string;
  private redirectUrl: string;

  public barLabel: String = "Password strength:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public strengthLabels = ['(Useless)', '(Weak)', '(Normal)', '(Strong)', '(Great!)'];
  /* Decorators declaration section */
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('captcha') captcha:any;
  /* Instance variable declaration section.*/
	private fieldErrors:any = {};

  constructor(private authorizationApiService: AuthorizationApiService,
     private authenticationApiService: AuthenticationApiService,
     private router: Router,
     private viewContainerRef: ViewContainerRef,
     private toastsManager: ToastsManager,
     private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.captchaSiteKey = environment.captchaKey;
    //this.activatedRoute.queryParams.subscribe(params => {
      this.email = localStorage.getItem('email');
      this.userRegistration['email'] = this.email;
      this.countryCode = localStorage.getItem('countryCode');
      //this.redirectUrl = params['redirectUrl'];
      this.getCountries();
    //});
  }

  ngOnInit() {
  }

  public saveAndUpdateUserRegistration(){
    this.saveUser(this.userRegistration);
  }
  public saveUser(userRegistration) {
    this.blockUserInterface();
    userRegistration['countryCode'] = this.countryCode;
    userRegistration['countryId'] = -1;
    this.authenticationApiService.saveUser(userRegistration).subscribe(
      success => {
        this.unblockUserInterface();
        this.captcha.reset();
        localStorage.clear();
        this.router.navigate(['/registration-welcome']);
      },
      error => {
        this.captcha.reset();
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getCountries() {
    this.authorizationApiService.getCountries().subscribe(
      success => {
        const countries = success['data'];
        for ( let i = 0; i < countries.length; i++) {
          if (countries[i]['countryCode'] === this.countryCode) {
            this.countries.push(countries[i]);
          }
        }
        if ( this.countries.length === 0 ) {
          this.toastsManager.error('Requested country is not valid');
          let redirectUrl = '';
          const errorJson = {
            error : true,
            errormessage: 'country code ' + this.countryCode + ' is not valid.'
          };
          setTimeout(() => {
            if ( localStorage.getItem('type') === '1' ) {
              redirectUrl = this.prepareRedirectUrlFromLocalStorage(errorJson);
            } else {
              redirectUrl = this.prepareRedirectUrlFromLocalStorageForType2(errorJson);
            }
              this.localStorageService.clearLocalStorage();
              window.location.href = redirectUrl;
            } , 2000);
        } else {
          this.localStorageService.clearLocalStorage();
        }
      },
      error => {
        this.localStorageService.clearLocalStorage();
      });
  }


  public showResponse(event) {
		this.captchaError = '';
		this.isCapatcha = true;
  }
  
  public getCaptchaKey(){
    this.captchaSiteKey=environment.captchaKey;
  }

  public prepareRedirectUrlFromLocalStorage(otherData: any) {
    if ( localStorage.getItem('redirectUrl') == undefined ) {
      return undefined;
    }
  
    let params = {
       email: encodeURIComponent(localStorage.getItem('email')),
       redirectUrl : localStorage.getItem('redirectUrl'),
       countryCode : encodeURIComponent(localStorage.getItem('countryCode')),
       groupName   : encodeURIComponent(localStorage.getItem('groupName')),
       message     : encodeURIComponent(localStorage.getItem('message')),
       digest      : encodeURIComponent(localStorage.getItem('digest')),
       isPartial   : encodeURIComponent(localStorage.getItem('isPartial')),
       type   : encodeURIComponent(localStorage.getItem('type'))
     };
  
     if (localStorage.getItem('walletAddress') == 'null') {
   } else {
    params['walletAddress'] = localStorage.getItem('walletAddress');
   }
     let firstNoNEmptyFound = false;
      let QueryParams = '';
    for ( let key in params ) {
    if (params[key] != undefined && key != 'redirectUrl') {
          if (!firstNoNEmptyFound) {
               QueryParams += '?' + key + '=' + params[key];
               firstNoNEmptyFound = true;
          } else {
            QueryParams += '&' + key + '=' + params[key];
          }
     }
    }
    for ( let key in otherData ) {
      if (otherData[key] != undefined ) {
            if (!firstNoNEmptyFound) {
                 QueryParams += '?' + key + '=' + otherData[key];
                 firstNoNEmptyFound = true;
            } else {
              QueryParams += '&' + key + '=' + otherData[key];
            }
       }
      }
     return params['redirectUrl'] + QueryParams;
  }
  
  public prepareRedirectUrlFromLocalStorageForType2(otherData: any) {
    if ( localStorage.getItem('redirectUrl') == undefined ) {
      return undefined;
    }
  
    let params = {
       email: encodeURIComponent(localStorage.getItem('email')),
       redirectUrl : localStorage.getItem('redirectUrl'),
       countryCode : encodeURIComponent(localStorage.getItem('countryCode')),
       initiator   : encodeURIComponent(localStorage.getItem('initiator')),
       message     : encodeURIComponent(localStorage.getItem('message')),
       digest      : encodeURIComponent(localStorage.getItem('digest')),
       type   : encodeURIComponent(localStorage.getItem('type'))
     };
     let firstNoNEmptyFound = false;
      let QueryParams = '';
    for ( let key in params ) {
    if (params[key] != undefined && key != 'redirectUrl') {
          if (!firstNoNEmptyFound) {
               QueryParams += '?' + key + '=' + params[key];
               firstNoNEmptyFound = true;
          } else {
            QueryParams += '&' + key + '=' + params[key];
          }
     }
    }
    for ( let key in otherData ) {
      if (otherData[key] != undefined ) {
            if (!firstNoNEmptyFound) {
                 QueryParams += '?' + key + '=' + otherData[key];
                 firstNoNEmptyFound = true;
            } else {
              QueryParams += '&' + key + '=' + otherData[key];
            }
       }
      }
     return params['redirectUrl'] + QueryParams;
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
