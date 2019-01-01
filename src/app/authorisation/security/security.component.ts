import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { Router, ActivatedRoute , Params, NavigationEnd } from '@angular/router';
import {QRCodeComponent} from 'angular2-qrcode';
import { error } from 'protractor';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ThankyouForRegistrationComponent } from '../../authentication/thankyou-for-registration/thankyou-for-registration.component';
import { ClipboardService } from 'ng2-clipboard/ng2-clipboard';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  public authenticatorEnableModal=false;
  private authenticatorSecret={};
  private Secret={}
  private authenticatorOTP={};
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild("otpForm") otpForm:any; 

  constructor(private router:Router, private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private clipboard: ClipboardService) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  copyToClipboard = () => { 
    this.clipboard.copy(this.Secret['gAuthSecret']); 
  }

  ngOnInit() {
  }

  public openAuthenticatorEnableModal(){
    this.otpForm.reset();
    this.authenticatorEnableModal=true;
    this.getAuthenticatorSecret();
  }

  public closeAuthenticatorEnableModal(){
    this.authenticatorEnableModal=false;
  }

  public getAuthenticatorSecret(){
    this.blockUserInterface();
    this.authorizationApiService.getAuthenticatorSecret().subscribe(
      success =>{
        this.unblockUserInterface();
        this.Secret = success['data'];
      },
      error =>{
        this.unblockUserInterface();
        this.errorMessage(error);
      }
    )
  }

  public saveAuthenticatorSecret(authenticatorOTP){
    this.blockUserInterface();
    this.authorizationApiService.saveAuthenticatorSecret(this.authenticatorOTP).subscribe(
      sucess =>{
        this.unblockUserInterface();
        this.successMessage(sucess);
        this.authenticatorEnableModal=false;
      },
      error =>{
        this.unblockUserInterface();
        this.authenticatorEnableModal=false;
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
    console.log("---errorString---", errorString);
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
