import { Component, OnInit } from '@angular/core';
import { AuthenticationApiService } from './../../services/authentication-api.service';
import { LocalStorageService } from './../../services/local-storage.service';
import {BKVSVerificationComponent} from './../bkvs-verification.component';
@Component({
  selector: 'app-bkvs-verification-header',
  templateUrl: './bkvs-verification-header.component.html',
  styleUrls: ['./bkvs-verification-header.component.css']
})
export class BkvsVerificationHeaderComponent implements OnInit {

  private menus;
  private userName;
  private profileImagePath = undefined;
  private redirectUrl: string;
  constructor(private localStorageService: LocalStorageService,
     private authenticationApiService: AuthenticationApiService,
     private bKVSVerificationComponent: BKVSVerificationComponent) {
  }

  ngOnInit() {
    this.getUserProfile();
    this.redirectUrl = this.bKVSVerificationComponent.prepareRedirectUrlFromLocalStorage({error : true, 
      errormessage : 'User Terminated The Request'});
   }

  public getUserProfile() {
  this.userName = this.localStorageService.getUserName();
  this.profileImagePath = this.localStorageService.getUserProfileImage();
  }

  public goBackToRedirectUrl() {
  this.localStorageService.clearLocalStorage();
  window.location.href = this.redirectUrl;
  }

}
