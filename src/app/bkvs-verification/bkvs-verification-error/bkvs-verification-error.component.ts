import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { SignOutComponent } from './../../authentication/sign-out/sign-out.component';

@Component({
  selector: 'bkvs-verification-error',
  templateUrl: './bkvs-verification-error.component.html',
  styleUrls: ['./bkvs-verification-error.component.css'],
  providers:[SignOutComponent]
})
export class BKVSVerificationErrorComponent implements OnInit {

  private message: string;
  private redirectUrl: string;
  /* Instance variable declaration section.*/

/* Method declaration section.*/


constructor(private router: Router,
  private activatedRoute: ActivatedRoute,
  private viewContainerRef: ViewContainerRef,
  private authenticationApiService: AuthenticationApiService,
  private localStorageService: LocalStorageService,
  private toastsManager: ToastsManager,
  private signOutComponent: SignOutComponent) {
  this.toastsManager.setRootViewContainerRef(viewContainerRef);

  this.activatedRoute.queryParams.subscribe(params => {
    this.message = params['message'];
    this.redirectUrl = params['redirectUrl'];
});
}

ngOnInit() {}

  redirectOfMerchantUrl() {
    let redirectUrl = null;
    this.activatedRoute.queryParams.subscribe(params => {
      redirectUrl = params;
      if ( redirectUrl != null || redirectUrl != undefined ) {
        window.location.href = redirectUrl;
      }

  });
}

public  goBack() {
  window.location.href = this.redirectUrl;
}


  isGoBackButtonShow() {
    if (this.redirectUrl == null || this.redirectUrl == undefined || this.redirectUrl == 'null' || this.redirectUrl == 'undefined' ){
      return false;
    }
    return true;
  }

}