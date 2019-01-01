import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { LocalStorageService } from './../services/local-storage.service';
import { AuthenticationApiService } from './../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'bkvs-verification',
  templateUrl : './bkvs-verification.component.html',
  styleUrls: ['./bkvs-verification.component.css'],
  providers:[]
})
export class BKVSVerificationComponent implements OnInit {

  /* Instance variable declaration section.*/
  private userLoginData = {};
  private fieldErrors: any = {};
  private email = '';
  private isError = false;
  private redirectUrl: string;
	/* Decorator declaration section.*/
   @BlockUI() blockUI: NgBlockUI;

	/* Method declaration section.*/
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private authenticationApiService: AuthenticationApiService,
    private localStorageService: LocalStorageService,
    private toastsManager: ToastsManager) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

ngOnInit() {

this.blockUserInterface();
        this.storeQueryParamsData();
        if ( !this.isError) {
          console.log(' query param correct');
        this.isUserExist(this.email);
        } else {
          console.log('error while storing query param');
          const navigationExtras: NavigationExtras = { queryParams: {redirectUrl : this.redirectUrl ,
            errormessage: 'Invalid Social KYC Verfication Request.'} };
            this.router.navigate(['bkvs-verification-error'], navigationExtras);
        }
this.unblockUserInterface();
    }
    public blockUserInterface() {
      this.blockUI.start('Wait...');
    }
      /* It unblocks UI.*/
      public unblockUserInterface() {
      this.blockUI.stop();
    }

  isUserExist(email) {


    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(localStorage.getItem('email'))) {
      this.redirectUrl = this.prepareRedirectUrlFromLocalStorage({error: true,
        errormessage: 'Email id is not of valid format.'});
        const navigationExtras: NavigationExtras = { queryParams: {redirectUrl : this.redirectUrl ,
          errormessage: 'Invalid Social KYC Verfication Request.'} };
       this.router.navigate(['bkvs-verification-error'], navigationExtras);
    } else if (localStorage.getItem('email').length > 250 ) {
      this.redirectUrl = this.prepareRedirectUrlFromLocalStorage({error: true,
        errormessage: 'Email id exceed maximum allowed length 250.'});
        const navigationExtras: NavigationExtras = { queryParams: {redirectUrl : this.redirectUrl ,
          errormessage: 'Invalid Social KYC Verfication Request.'} };
       this.router.navigate(['bkvs-verification-error'], navigationExtras);
    } else {
console.log('inside else case '+localStorage.getItem('email'));
  this.authenticationApiService.isUserExist(email).subscribe(
      success => {
        console.log('success case ');
        this.router.navigate (['bkvs-verification-login']);
      }, error => {
        let errorJSON = this.parseError(error._body);

        console.log('error status' + errorJSON.status);
        if ( error != null && errorJSON.status === 'NOT_FOUND') {
          const navigationExtras: NavigationExtras = { queryParams: {email : localStorage.getItem('email'),
          countryCode: localStorage.getItem('countryCode') } };
         // localStorage.clear();
          this.router.navigate (['bkvs-verification-register']);
        } else {
          console.log("inside error .component routing case");
        this.redirectUrl = this.prepareRedirectUrlFromLocalStorage({error: true,
          errormessage: 'Current request can not be proccessed ,please contact admin'});
        this.toastsManager.error('Current request can not be proccessed ,please contact admin');
        const navigationExtras: NavigationExtras = { queryParams: {redirectUrl : this.redirectUrl ,
          errormessage: 'Invalid Social KYC Verfication Request.'} };
       this.router.navigate(['bkvs-verification-error'], navigationExtras);
        this.isError = true;
      }
      }
  );
}
  }


allQueryParamsExist(params) {
const reg = new RegExp('true|false');

if (params['type'] == undefined ||  !(/^1$|^2|^3$/.test(params['type']))) {
  return false;
}

//^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$
//250

if (params['type'] == '1' || params['type'] == '3') {
if ( params['email'] == undefined) {
  return false;
} else if ( params['countryCode'] == undefined) {
  return false;
} else if (params['groupName'] == undefined) {
  return false;
} else if (params['message'] == undefined) {
  return false;
} else if (params['digest'] == undefined) {
  return false;
} else if (params['redirectUrl'] == undefined) {
  return false;
} else if (  params['type'] == '1' && (params['isPartial'] == undefined ||  !(/^true$|^false$/.test(params['isPartial'])))) {
  return false;
}
return true;
} else {
  if ( params['email'] == undefined) {
    return false;
  } else if ( params['countryCode'] == undefined) {
    return false;
  } else if (params['message'] == undefined) {
    return false;
  } else if (params['digest'] == undefined) {
    return false;
  } else if (params['redirectUrl'] == undefined) {
    return false;
  } else if (params['initiator'] == undefined) {
return false;
  }
  return true;
}

}

allQueryParamsExistInsideLocalStorage() {

  if (localStorage.getItem('type') == undefined ||  !(/^1$|^2|^3$/.test(localStorage.getItem('type')) ) ) {
    return false;
  }

  if (localStorage.getItem('type') == '1'){

  if ( localStorage.getItem('message') !== undefined &&
       localStorage.getItem('message') !== null &&
       localStorage.getItem('digest') !== undefined &&
       localStorage.getItem('digest') !== null &&
       localStorage.getItem('countryCode') !== undefined &&
       localStorage.getItem('countryCode') !== null &&
       localStorage.getItem('groupName') !== undefined &&
       localStorage.getItem('groupName') !== null &&
       localStorage.getItem('walletAddress') !== undefined &&
       localStorage.getItem('walletAddress') !== null &&
       localStorage.getItem('email') !== undefined &&
       localStorage.getItem('email') !== null &&
       localStorage.getItem('redirectUrl') !== undefined &&
       localStorage.getItem('redirectUrl') !== null &&
       localStorage.getItem('isOnlyKYCRequest') !== undefined &&
       localStorage.getItem('isOnlyKYCRequest') !== null &&
       localStorage.getItem('isPartial') !== undefined &&
       localStorage.getItem('isPartial') !== null) {
       return true;
       } else {
         return false;
       }
      } else if (localStorage.getItem('type') == '3'){
        if ( localStorage.getItem('message') !== undefined &&
        localStorage.getItem('message') !== null &&
        localStorage.getItem('digest') !== undefined &&
        localStorage.getItem('digest') !== null &&
        localStorage.getItem('countryCode') !== undefined &&
        localStorage.getItem('countryCode') !== null &&
        localStorage.getItem('groupName') !== undefined &&
        localStorage.getItem('groupName') !== null &&
        localStorage.getItem('walletAddress') !== undefined &&
        localStorage.getItem('walletAddress') !== null &&
        localStorage.getItem('email') !== undefined &&
        localStorage.getItem('email') !== null &&
        localStorage.getItem('redirectUrl') !== undefined &&
        localStorage.getItem('redirectUrl') !== null) {
        return true;
        } else {
          return false;
        }
      } else {
        if ( localStorage.getItem('message') !== undefined &&
        localStorage.getItem('message') !== null &&
        localStorage.getItem('digest') !== undefined &&
        localStorage.getItem('digest') !== null &&
        localStorage.getItem('countryCode') !== undefined &&
        localStorage.getItem('countryCode') !== null &&
        localStorage.getItem('walletAddress') !== undefined &&
        localStorage.getItem('walletAddress') !== null &&
        localStorage.getItem('email') !== undefined &&
        localStorage.getItem('email') !== null &&
        localStorage.getItem('redirectUrl') !== undefined &&
        localStorage.getItem('redirectUrl') !== null &&
        localStorage.getItem('initiator') !== undefined &&
        localStorage.getItem('initiator') !== null) {
        return true;
        } else {
          return false;
        }

      }
  }

public prepareRedirectUrl(params, otherData: any) {
  if ( params['redirectUrl'] == undefined) {
     this.redirectUrl = undefined;
     return;
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
  this.redirectUrl = decodeURIComponent(params['redirectUrl']) + QueryParams;
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

public isValidSocialKycRequest() {

  if (localStorage.getItem('type') == undefined ||  !(/^1$|^2|^3$/.test(localStorage.getItem('type')) ) ) {
    return false;
  }

  if (localStorage.getItem('type') == '1'){

  if ( localStorage.getItem('message') !== undefined &&
       localStorage.getItem('message') !== null &&
       localStorage.getItem('digest') !== undefined &&
       localStorage.getItem('digest') !== null &&
       localStorage.getItem('countryCode') !== undefined &&
       localStorage.getItem('countryCode') !== null &&
       localStorage.getItem('groupName') !== undefined &&
       localStorage.getItem('groupName') !== null &&
       localStorage.getItem('walletAddress') !== undefined &&
       localStorage.getItem('walletAddress') !== null &&
       localStorage.getItem('email') !== undefined &&
       localStorage.getItem('email') !== null &&
       localStorage.getItem('redirectUrl') !== undefined &&
       localStorage.getItem('redirectUrl') !== null &&
       localStorage.getItem('token') !== undefined &&
       localStorage.getItem('token') !== null &&
       localStorage.getItem('isOnlyKYCRequest') !== undefined &&
       localStorage.getItem('isOnlyKYCRequest') !== null &&
       localStorage.getItem('isPartial') !== undefined &&
       localStorage.getItem('isPartial') !== null) {
       return true;
       } else {
         return false;
       }
      }  else if (localStorage.getItem('type') == '3'){

        if ( localStorage.getItem('message') !== undefined &&
             localStorage.getItem('message') !== null &&
             localStorage.getItem('digest') !== undefined &&
             localStorage.getItem('digest') !== null &&
             localStorage.getItem('countryCode') !== undefined &&
             localStorage.getItem('countryCode') !== null &&
             localStorage.getItem('groupName') !== undefined &&
             localStorage.getItem('groupName') !== null &&
             localStorage.getItem('walletAddress') !== undefined &&
             localStorage.getItem('walletAddress') !== null &&
             localStorage.getItem('email') !== undefined &&
             localStorage.getItem('email') !== null &&
             localStorage.getItem('redirectUrl') !== undefined &&
             localStorage.getItem('redirectUrl') !== null &&
             localStorage.getItem('token') !== undefined &&
             localStorage.getItem('token') !== null) {
             return true;
             } else {
               return false;
             }
            } else {
        if ( localStorage.getItem('message') !== undefined &&
        localStorage.getItem('message') !== null &&
        localStorage.getItem('digest') !== undefined &&
        localStorage.getItem('digest') !== null &&
        localStorage.getItem('countryCode') !== undefined &&
        localStorage.getItem('countryCode') !== null &&
        localStorage.getItem('walletAddress') !== undefined &&
        localStorage.getItem('walletAddress') !== null &&
        localStorage.getItem('email') !== undefined &&
        localStorage.getItem('email') !== null &&
        localStorage.getItem('redirectUrl') !== undefined &&
        localStorage.getItem('redirectUrl') !== null &&
        localStorage.getItem('token') !== undefined &&
        localStorage.getItem('token') !== null &&
        localStorage.getItem('initiator') !== undefined &&
        localStorage.getItem('initiator') !== null) {
        return true;
        } else {
          return false;
        }

      }
       //isOnlyKYCRequest
  }

storeQueryParamsData() {


  this.activatedRoute.queryParams.subscribe(params => {
    let isParamsExist = false;

   isParamsExist = this.allQueryParamsExist(params);
   if (!isParamsExist) {
     this.isError = true;
     this.prepareRedirectUrl(params, {error: true});
     return;
   }
   localStorage.setItem('type', params['type']);
   if ( params['type'] == '1' || params['type'] == '3') {
    localStorage.setItem('groupName', decodeURIComponent(params['groupName']));
    if (params['type'] == '1'){
    localStorage.setItem('isPartial' , decodeURIComponent(params['isPartial']));
    localStorage.setItem('isOnlyKYCRequest' , decodeURIComponent(params['isOnlyKYCRequest']));
    }
   } else {
     localStorage.setItem('initiator', decodeURIComponent(params['initiator']));
   }
   localStorage.setItem('message', decodeURIComponent(params['message']));
   localStorage.setItem('digest', decodeURIComponent(params['digest']));
   localStorage.setItem('countryCode', decodeURIComponent(params['countryCode']));
   if ((params['walletAddress']) == undefined || (params['walletAddress']) == null) {
   localStorage.setItem('walletAddress', null);
   } else {
     localStorage.setItem('walletAddress', decodeURIComponent(params['walletAddress']));
   }
   localStorage.setItem('email', decodeURIComponent(params['email']));
   localStorage.setItem('redirectUrl', decodeURIComponent(params['redirectUrl']));
   this.email = decodeURIComponent(params['email']);
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

}