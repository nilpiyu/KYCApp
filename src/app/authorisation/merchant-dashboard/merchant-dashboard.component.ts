import { Component, OnInit,ViewContainerRef } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import{LocalStorageService} from './../../services/local-storage.service';
import { Router, ActivatedRoute , Params } from '@angular/router';
import {LoginComponent} from '../../authentication/login/login.component';
import{AuthenticationApiService} from './../../services/authentication-api.service';

@Component({
  selector: 'app-merchant-dashboard',
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.css'],
  providers:[AuthorizationApiService,LocalStorageService,AuthenticationApiService,LoginComponent]
  
})
export class MerchantDashboardComponent implements OnInit {
  private loginDateAndTime;
  private userCountries =[];
  private userProfileData = {address:{}, country:{}};
  private isEdited = false;  
  private maxLengthExceeded=[];
  
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public vcr: ViewContainerRef, private loginComponent:LoginComponent, private localStorageService:LocalStorageService,private authenticationApiService:AuthenticationApiService, private authorizationApiService:AuthorizationApiService) { }

  ngOnInit() {
    let userId = this.localStorageService.getUserId();     
    this.lastLoginDateAndTime();
    this.getUserKycStatus();
    this.getUserProfileById(userId);
    
  }

  /*This method gives the last login and time*/
  lastLoginDateAndTime(){
    let currentDate = new Date();
    this.loginDateAndTime=this.localStorageService.getUserLastLoggedInTime();
  }

  /*It gets kyc status of users*/
  public getUserKycStatus(){
    this.authorizationApiService.getKycStatus().subscribe(
      success =>{
        this.userCountries = success['data'];
      },
      error =>{

      },
    )
  }

  /* update user profile by Id called from html.*/
  public updateUserProfile(updateUserProfileForm) {
    let userId = this.localStorageService.getUserId();
    this.updateUserProfileById(userId);
  }
  
  /* It gets user profile data for editing.*/
  public editUserProfile() {
    this.isEdited= true;
    let userId=this.localStorageService.getUserId();
    this.getUserProfileById(userId);
  }
  
  /* update user profile by Id.*/
  public updateUserProfileById(userId){
    this.authorizationApiService.editUserProfile(userId,this.userProfileData).subscribe(
      success => {
        this.isEdited = false;
      },
      error => {
      }
    )
  }
  
  /* It gets user profile data by Id.*/
  public getUserProfileById(userId) {
    this.authorizationApiService.getUserProfile(userId).subscribe(
      success => {
        this.userProfileData = success['data'];
        this.userProfileData.address = this.userProfileData.address  || {};
      },
      error => {
      }
    )
  }

  /* It checks maximum length for input field.*/
  public checkMaxLength(fieldName, maxLength){
    if(fieldName.value.length==maxLength){
        this.maxLengthExceeded[fieldName.name]=true;
    } else if(fieldName.value.length<maxLength){
        this.maxLengthExceeded[fieldName.name]=false;
    }
  }
}
