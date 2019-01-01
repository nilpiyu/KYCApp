import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import{LocalStorageService} from './../../services/local-storage.service';
import { Router, ActivatedRoute , Params, NavigationEnd } from '@angular/router';
import{AuthenticationApiService} from './../../services/authentication-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private loginDateAndTime;
  private socialMediaModal=false;
  private profileMetaDataCriteria ={pageNo:0,pageSize:0,count:-1}
  private userDocumentsRequestedByMerchantPaginationData={pageNo:0, pageSize:0, count:-1};
  private loginIPAddress;
  private userCountries =[];
  private isEdited = false;  
  private socialMediaPublicURLs=[];
  private profileImagePath="assets/img/profile-pic.jpg";
  private userProfileData = {address:{}, country:{}, profileImagePath:this.profileImagePath};
  private registeredSocialServices;
  private registeredSocialServicesURLs=[];
  private userRequestedDocuments=[];
  private maxLengthExceeded=[];

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild('documentImage') documentImage:any;
  @ViewChild('userProfileImage') userProfileImage:any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public vcr: ViewContainerRef, private localStorageService:LocalStorageService,private authenticationApiService:AuthenticationApiService, private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private domSanitizer:DomSanitizer) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
   }

  ngOnInit() {
    this.getUserProfile();
  }

  public OpenSocialMediaModal(){
    this.socialMediaModal=true;
    this.getSocialServices(this.profileMetaDataCriteria);
  }

  public closeSocialMediaModal(){
    this.socialMediaModal=false;
  }

  public getUserProfile(){
    let userId = this.localStorageService.getUserId(); 
    this.getUserProfileById(userId);
    this.getLastLoginDateAndTime();
    this.getUserKycStatus();
    this.getSocialServicesURLs();
    this.getUserDocumentsRequestedByMerchant(this.userDocumentsRequestedByMerchantPaginationData);
  }

  public getLastLoginDateAndTime(){
    let currentDate = new Date();
    let loginDateAndTime=this.localStorageService.getUserLastLoggedInTime();
    let login=loginDateAndTime.split("from");
    this.loginDateAndTime=new Date(login[0]).toLocaleString() || 'NA';
    this.loginIPAddress=login[1];
  }

  /*It gets kyc status of users*/
  public getUserKycStatus(){
    this.blockUserInterface();
    this.authorizationApiService.getKycStatus().subscribe(
      success =>{
        this.userCountries = success['data'];
        this.unblockUserInterface();
      },
      error =>{ 
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  /* It gets user profile data for editing.*/
  public editUserProfile() {
    this.isEdited= true;
    let userId=this.localStorageService.getUserId();
    this.getUserProfileById(userId);
  }

  /* update user profile by Id called from html.*/
  public updateUserProfile(updateUserProfileForm) {
    let userId = this.localStorageService.getUserId();
    this.updateUserProfileById(userId);
  }

  /* update user profile by Id.*/
  public updateUserProfileById(userId){
    console.log("====this.userProfileData in updateUserProfileById===", this.userProfileData);
    this.blockUserInterface();
    this.authorizationApiService.editUserProfile(userId, this.userProfileData).subscribe(
      success => {
        this.unblockUserInterface();
        this.isEdited = false;
        this.successMessage(success);
      },
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  /* It gets user profile data by Id.*/
  public getUserProfileById(userId) {
    this.blockUserInterface();
    this.authorizationApiService.getUserProfile(userId).subscribe(
      success => {
        this.unblockUserInterface();
        this.userProfileData = success['data'];
        let userProfile = success['data']['address'];
        if(!userProfile.phone && !userProfile.pincode && !userProfile.addressLine1 && !userProfile.city && !userProfile.state){
          this.isEdited = true;
        }
        this.localStorageService.setCountryCode(this.userProfileData['country']['countryCode']);
        this.localStorageService.setUserName(this.userProfileData['name']);
        if(this.userProfileData && this.userProfileData['profileImagePath']){
          this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);
        } else{
          this.userProfileData['profileImagePath']=this.profileImagePath;
          this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);           
        }
        // this.headerComponent.getUserProfile();
        this.userProfileData.address = this.userProfileData.address || {};
        this.router.navigate([this.router.url]);
      },
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveAndUpdateSocialMediaPublicURLs(){
    this.socialMediaModal=false;
    this.socialMediaPublicURLs=[];
    for(let registeredSocialService of this.registeredSocialServices){
      if(registeredSocialService['publicUrl']){
        this.socialMediaPublicURLs[this.socialMediaPublicURLs.length]={"socialMetaId":registeredSocialService['socialMetaId']+"", "publicUrl":registeredSocialService['publicUrl']};
      }
    }
    let socialMediaPublicURLs={"payload":this.socialMediaPublicURLs};
    this.saveSocialMediaPublicURLs(socialMediaPublicURLs);
  }

  public saveSocialMediaPublicURLs(socialMediaPublicURLs){
    this.blockUserInterface();
    this.authorizationApiService.saveSocialMediaPublicURLs(socialMediaPublicURLs).subscribe(
      success=>{
        this.unblockUserInterface();
        this.getSocialServicesURLs();
        this.successMessage(success);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getSocialServices(profileMetaData){
    this.blockUserInterface();
    this.authorizationApiService.getSocialServices(profileMetaData).subscribe(
      success=>{
        this.registeredSocialServices=success['data']['socialProfileMetas'];
        console.log('service profile data on user dashboard-----',this.registeredSocialServices)
        this.getSocialServicesURLs();
        this.socialServiceDataManipilation();
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public socialServiceDataManipilation(){
    for(let registeredSocialServicesURLIndex in this.registeredSocialServicesURLs){
      for(let registeredSocialServiceIndex in this.registeredSocialServices){
        if(this.registeredSocialServicesURLs[registeredSocialServicesURLIndex]['socialMetaId']==this.registeredSocialServices[registeredSocialServiceIndex]['socialMetaId']){
          this.registeredSocialServices[registeredSocialServiceIndex]['publicUrl']=this.registeredSocialServicesURLs[registeredSocialServicesURLIndex]['value'];
        }
      }
    }
  }

  public getSocialServicesURLs(){
    this.blockUserInterface();
    this.authorizationApiService.getSocialServicesURLs().subscribe(
      success=>{
        this.registeredSocialServicesURLs=success['data'];
        console.log('register service url',this.registeredSocialServicesURLs);
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveProfileImage(event){
    let profileImagePath={"file":event.target.files[0]};
    let profileImageFile: File = event.target.files[0];
    let profileImageFormData: FormData = new FormData();
    profileImageFormData.append('file', profileImageFile);
    this.uploadProfileImage(profileImageFormData);
  }

  public uploadProfileImage(profileImageFormData){
    this.blockUserInterface();
    this.authorizationApiService.uploadProfileImage(profileImageFormData).subscribe(
      success=>{
        this.userProfileData['profileImagePath']=success['data']['profile'];
        this.localStorageService.setUserProfileImage(this.userProfileData['profileImagePath']);
        this.authorizationApiService.profileImage.emit(this.userProfileData['profileImagePath']);        
        this.unblockUserInterface();
        this.successMessage(success);
        this.userProfileImage.nativeElement.value="";
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
        this.userProfileImage.nativeElement.value="";
      });
  } 

  public getUserDocumentsRequestedByMerchant(userDocumentsRequestedByMerchantPaginationData){
    this.blockUserInterface();
    this.authorizationApiService.getUserDocumentsRequestedByMerchant(userDocumentsRequestedByMerchantPaginationData).subscribe(
      success=>{
        this.userRequestedDocuments=success['data']['requests'];
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
      });
  }

   /* It checks maximum length for input field.*/
   public checkMaxLength(fieldName, maxLength){
    console.log("--userProfileData---", this.userProfileData);
    if(fieldName.value.length==maxLength){
        this.maxLengthExceeded[fieldName.name]=true;
    } else if(fieldName.value.length<maxLength){
        this.maxLengthExceeded[fieldName.name]=false;
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
