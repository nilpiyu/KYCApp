import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import {AuthorizationApiService} from '../../services/authorization-api.service';
import { Router, ActivatedRoute , Params } from '@angular/router';
import { LocalStorageService } from './../../services/local-storage.service'; 
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-requested-document',
  templateUrl: './requested-document.component.html',
  styleUrls: ['./requested-document.component.css'],
  providers:[AuthorizationApiService]
  
})
export class RequestedDocumentComponent implements OnInit {
  private userRequestDocuments=[];
  private userUpdateDocuments ={};
  private documentStatus;
  private totalRequestedDocuments:number=0;
  private noOfRequestedDocumentsPerPage=10;
  private requestedDocumentCriteria={pageNo:1, pageSize:this.noOfRequestedDocumentsPerPage, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public vcr: ViewContainerRef, private authorizationApiService:AuthorizationApiService, private localStorageService:LocalStorageService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getSharedDocumentList(this.requestedDocumentCriteria);
  }
  
  /*It gets the list of shared document*/
  public getSharedDocumentList(requestedDocumentCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getSharedDocument(requestedDocumentCriteria).subscribe(
      success =>{
        this.userRequestDocuments = [];
        let userRequestDocuments =success['data']['requests'];
        this.totalRequestedDocuments=success['data']['pagination']['count'];
        for(let index in userRequestDocuments){
          this.userRequestDocuments.push(
                                           {
                                             "countryName":userRequestDocuments[index]['kycdoc']['country']['countryName'],
                                             "documentType":userRequestDocuments[index]['kycdoc']['kycDocumentType']['documentType'],
                                             "documentName":userRequestDocuments[index]['kycdoc']['kycDocumentMeta']['documentName'],
                                             "requesterName":userRequestDocuments[index]['requester']['name'],
                                             "status":userRequestDocuments[index]['status'],
                                             "documentStatus":userRequestDocuments[index]['kycdoc']['documentStatus'],
                                             "documentSharingId":userRequestDocuments[index]['documentSharingId']
                                            }
          );
        }
        this.unblockUserInterface();
      },
      error =>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  /* This method is used to update the list of shared document*/
  public updateSharedDocuments(documentSharingId, documentStatus){
    let userUpdatedDocument={
                              "documentSharingId":documentSharingId, 
                              "status":documentStatus,
                              "secretKey":this.localStorageService.getBKVSSecretKey()
                            };
    this.blockUserInterface();
    this.authorizationApiService.updateRequestedDocumentStatus(userUpdatedDocument).subscribe(
      success => {
        for(let index in this.userRequestDocuments){
          if(this.userRequestDocuments[index]['documentSharingId']==documentSharingId){
            this.userRequestDocuments[index]['status']=documentStatus;
          }
        }
        this.userUpdateDocuments = success['data'];
        this.unblockUserInterface();
        this.successMessage(success);
      },
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
      });
    }
  
  /* It gets user on demand.*/
	public reloadRequestedDocuments(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.requestedDocumentCriteria['pageNo']=pageNo;
		this.requestedDocumentCriteria['pageSize']=pageSize;
    this.getSharedDocumentList(this.requestedDocumentCriteria);
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