import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from "./../../services/authorization-api.service";
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-verification-document-mapping',
  templateUrl: './verification-document-mapping.component.html',
  styleUrls: ['./verification-document-mapping.component.css']
})
export class VerificationDocumentMappingComponent implements OnInit {

  private documentGroupMappingModal=false;
  private documentGroupMapping={};
  private documentGroupMappings=[];
  private documents=[];
  private documentIds=[];
  private countries=[];
  private userTypes=[];
  private totalDocumentGroupMappings:number=0;;
  private noOfDocumentGroupMappingsPerPage=10;
  private documentGroupMappingsCriteria={pageNo:1, pageSize:this.noOfDocumentGroupMappingsPerPage, count:-1};
  private documentCriteria={pageNo:0, pageSize:0, count:-1}
  
  
  private maxLengthExceeded=[];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("documentGroupMappingForm") documentGroupMappingForm:any; 
  
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
  }

  public openModal(){
    this.documentGroupMappingForm.reset();
    this.documentGroupMappingModal=true;
    for(let key in this.documentGroupMapping){
      this.documentGroupMapping[key]=undefined;
    }
    this.documentIds=[];
    this.getDocuments(this.documentCriteria);
  }

  public closeModal(){
    this.documentGroupMappingModal=false;
  }

  public editDocumentGroupMappingById(documentGroupMapping){
    this.documentGroupMappingModal=true;
    for(let key in documentGroupMapping){
      this.documentGroupMapping[key]=documentGroupMapping[key];
    }
    this.getDocuments(this.documentCriteria);
  }

  public saveAndUpdateDocumentGroupMapping(){
    if(!this.documentGroupMapping['roleId']){
      this.saveDocumentGroupMapping(this.documentGroupMapping);
    } else if(this.documentGroupMapping['roleId']){
      this.updateDocumentGroupMappingById(this.documentGroupMapping['roleId'], this.documentGroupMapping);
    }
  }

  public getdocumentGroupMappings(documentGroupMappingCriteria){
    this.blockUserInterface();    
    this.authorizationApiService.getRoles(documentGroupMappingCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentGroupMappings=success['data']['roles'];
        this.totalDocumentGroupMappings=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveDocumentGroupMapping(userRole){
    this.blockUserInterface();
    this.authorizationApiService.saveRole(userRole).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentGroupMappingModal=false;
        let roleId=success['data']['roleId'];
        this.successMessage(success);
        this.getdocumentGroupMappings(this.documentGroupMappingsCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.documentGroupMappingModal=false;
        this.errorMessage(error);
      });
  }

  public updateDocumentGroupMappingById(userRoleId, userRole){
    this.blockUserInterface();
    this.authorizationApiService.updateRoleById(userRoleId, userRole).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentGroupMappingModal=false;
        let roleId=userRole['roleId'];
        this.successMessage(success);
        this.getdocumentGroupMappings(this.documentGroupMappingsCriteria);
      }, 
      error=>{
        this.errorMessage(error);
      });
  }

  public getDocuments(activityCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getActivities(activityCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documents=success['data']['activites'];
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
	public reloadDocumentGroupMapping(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.documentGroupMappingsCriteria['pageNo']=pageNo;
		this.documentGroupMappingsCriteria['pageSize']=pageSize;
    // this.getdocumentGroupMappings(this.documentGroupMappingsCriteria);
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
