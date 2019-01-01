import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-social-networking-services',
  templateUrl: './social-networking-services.component.html',
  styleUrls: ['./social-networking-services.component.css']
})
export class SocialNetworkingServicesComponent implements OnInit {

  private socialService={logoImageFilePath:"assets/img/faces/face-0.jpg"};
  private maxLengthExceeded=[];
  private socialServiceModal=false;
  private socialServiceFormData:FormData;
  private registeredSocialServices=[];
  private logoImageFile:File;
  private totalSocialServices:number=0;
  private noOfSocialServicesPerPage=10;
  private socialNetworkCriteria={pageNo:1, pageSize:this.noOfSocialServicesPerPage, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("socialProfileImage") socialProfileImage:any;
  @ViewChild("socialServiceForm") socialServiceForm:any;

  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() { 
    this.getSocialServices(this.socialNetworkCriteria);
  }

  public openSocialServiceModal(){
    this.socialServiceForm.reset();
    this.socialServiceModal=true;
    for(let key in this.socialService){
      this.socialService[key]="";
    }
  }

  public closeSocialServiceModal(){
    this.socialServiceModal=false;
  }

  public editSocialService(socialService){
    for(let key in socialService){
      this.socialService[key]=socialService[key];
    }
    this.socialService['logoImageFilePath']=socialService['url'];
    this.socialService['logo']=socialService['url'];
    this.socialServiceModal=true;
  }

  public readSocialServiceLogo(event){
    let logoImageFile:File=event.target.files[0];
    this.socialService['logo']=logoImageFile;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.socialService['logoImageFilePath'] = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  public saveAndUpdateSocialService(){
    this.socialServiceModal=false;
    let socialServiceFormData:FormData=new FormData();
    for(let key in this.socialService){
      socialServiceFormData.append(key, this.socialService[key]);
    }
    if(!this.socialService['socialMetaId']){
      this.saveSocialService(socialServiceFormData);
    } else if(this.socialService['socialMetaId']){
      this.updateSocialServiceById(this.socialService['socialMetaId'], socialServiceFormData)
    }
    this.socialProfileImage.nativeElement.value="";
  }

  public saveSocialService(socialServiceFormData){
    this.blockUserInterface();
    this.authorizationApiService.saveSocialService(socialServiceFormData).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getSocialServices(this.socialNetworkCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public updateSocialServiceById(socialServiceId, socialServiceFormData){
    this.blockUserInterface();
    this.authorizationApiService.updateSocialService(socialServiceId, socialServiceFormData, this.socialService).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getSocialServices(this.socialNetworkCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getSocialServices(socialNetworkCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getSocialServices(socialNetworkCriteria).subscribe(
      success=>{
        this.registeredSocialServices=success['data']['socialProfileMetas'];
        this.totalSocialServices=success['data']['pagination']['count'];
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public checkMaxLength(fieldName, maxLength){
    if(fieldName.value.length==maxLength){
        this.maxLengthExceeded[fieldName.name]=true;
    } else if(fieldName.value.length<maxLength){
        this.maxLengthExceeded[fieldName.name]=false;
    }
  }

  /* It gets user on demand.*/
	public reloadSocialServices(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.socialNetworkCriteria['pageNo']=pageNo;
		this.socialNetworkCriteria['pageSize']=pageSize;
		this.getSocialServices(this.socialNetworkCriteria);
     }

    public cellColor(car) {
        return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
    };

    /* special params */
    translations = <DataTableTranslations>{
        indexColumn: 'Index column',
        expandColumn: 'Expand column',
        selectColumn: 'Select column',
        paginationLimit: 'Max results',
        paginationRange: 'Result range'
    };


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
