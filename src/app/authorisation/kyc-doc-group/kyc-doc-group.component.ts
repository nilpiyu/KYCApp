import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from "./../../services/authorization-api.service";
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-kyc-doc-group',
  templateUrl: './kyc-doc-group.component.html',
  styleUrls: ['./kyc-doc-group.component.css']
})
export class KycDocGroupComponent implements OnInit {
  private docGroupModal=false;
  private kycDocData={};
  private docGroups=[];
  private docGroupData={};
  private docGroupCredentials=[];
  private documentType={};
  private maxLengthExceeded=[];
  private totalDocGroups;
  private noOfDocGroupsPerPage=10;
  private documentGroupCriteria={pageNo:1, pageSize:this.noOfDocGroupsPerPage, count:-1};
  
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("groupNameForm") groupNameForm:any;
  
 constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
  this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {   
    this.getDocGroup(this.documentGroupCriteria);
  }

  public openModal(){
    this.groupNameForm.reset();
    this.docGroupModal=true;
    for(let key in this.kycDocData){
      this.kycDocData[key]="";
    }
  }

  public closeModal(){
    this.docGroupModal=false;
  }

  public saveAndUpdateGroup(){
    this.docGroupModal=false;
    if(!this.kycDocData['kycDocGroupId']){
      this.saveGroupName(this.kycDocData);
    } else if (this.kycDocData['kycDocGroupId']){
      this.updateRoleById(this.kycDocData);
    }
  }
  

  public editDocById(documentGroup){
    this.docGroupModal=true;
    for(let key in documentGroup){
      this.kycDocData[key]=documentGroup[key];
    }
  }

  public saveGroupName(kycDocData){
    this.blockUserInterface();
    this.authorizationApiService.saveKycDocGroup(kycDocData).subscribe(
      success =>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getDocGroup(this.documentGroupCriteria);
      },
      error =>{
          this.unblockUserInterface();
          this.errorMessage(error)
;      }); 
  }

  public getDocGroup(documentGroupCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocGroup(documentGroupCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.docGroups=success['data']['kycDocGroups'];
        this.docGroupCredentials=success['data']['kycDocGroups'];
        this.totalDocGroups=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  } 

  public updateRoleById(docGroupCredentials){
    this.blockUserInterface();
    this.authorizationApiService.updateDocGroup(docGroupCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getDocGroup(this.documentGroupCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      }
    );
  }
  /*It checks the max. length*/
  public checkMaxLength(fieldName, maxLength){
    if(fieldName.value.length==maxLength){
        this.maxLengthExceeded[fieldName.name]=true;
    } else if(fieldName.value.length<maxLength){
        this.maxLengthExceeded[fieldName.name]=false;
    }
}

  /* It gets user on demand.*/
	public reloadDocGroups(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.documentGroupCriteria['pageNo']=pageNo;
		this.documentGroupCriteria['pageSize']=pageSize;
    this.getDocGroup(this.documentGroupCriteria);
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
