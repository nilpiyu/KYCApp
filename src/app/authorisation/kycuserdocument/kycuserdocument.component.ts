import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from "./../../services/authorization-api.service";
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-kycuserdocument',
  templateUrl: './kycuserdocument.component.html',
  styleUrls: ['./kycuserdocument.component.css']
})
export class KycuserdocumentComponent implements OnInit {

  private kycUserDocument=false;
  private documentMetas=[];
  private documentTypes=[];
  private countries=[];
  private userDocument={};
  private userDocuments=[];
  private totalUserDocuments:number=0;
  private noOfUserDocumentsPerPage=10;
  private documentChannels=[];
  private userDocumentCriteria={pageNo:1, pageSize:this.noOfUserDocumentsPerPage, count:-1};
  private userDocumentTypeCriteria={pageNo:0, pageSize:0, count:-1};
  private userDocumentMetaCriteria={pageNo:0, pageSize:0, count:-1};
  private userDocumentChannelCriteria={pageNo:0, pageSize:0, count:-1};
  private refreshChannelDataModal:boolean=false;
  private documentChannelName={};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("userDocumentForm") userDocumentForm:any;
  
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getUserDocuments(this.userDocumentCriteria);
  }

  public openRefreshChannelDataModal(){
    this.refreshChannelDataModal=true;
  }

  public closeRefreshChannelDataModal(){
    this.refreshChannelDataModal=false;
  }

  public openModal(){
    this.resetUserDocument();
    this.getCountries();
    this.getDocumentMetas(this.userDocumentMetaCriteria);
    this.getDocumentTypes(this.userDocumentTypeCriteria);
    this.getDocumentChannels(this.userDocumentChannelCriteria);
    this.kycUserDocument=true;
  }

  public closeModal(){
    this.userDocumentForm.reset();        
    this.kycUserDocument=false;
  }

  public resetUserDocument(){
    for(let key in this.userDocument){
      this.userDocument[key]=undefined;
    }
    this.userDocument['isMandatory']=false;
    this.userDocument['canExpired']=false;
  }

  public saveAndUpdateUserDocument(){
    this.kycUserDocument=false;
    if(!this.userDocument['kycDocId']){
      this.saveUserDocument(this.userDocument);
    } else if(this.userDocument['kycDocId']){
      this.updateUserDocument(this.userDocument['kycUserDocumentId'], this.userDocument);
    }
    this.userDocumentForm.reset();    
  }

  public editUserDocument(userDocument){
    this.kycUserDocument=true;
    this.getCountries();
    this.getDocumentMetas(this.userDocumentMetaCriteria);
    this.getDocumentTypes(this.userDocumentTypeCriteria);
    this.getDocumentChannels(this.userDocumentChannelCriteria);
    for(let key in userDocument){
      this.userDocument[key]=userDocument[key];
    }
  }

  public getCountries(){
    this.blockUserInterface();
    this.authorizationApiService.getCountries().subscribe(
      success=>{
        this.unblockUserInterface();
        this.countries=success['data'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getDocumentMetas(documentMetaCriteria){
    this.blockUserInterface()
    this.authorizationApiService.getDocumentMetas(documentMetaCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentMetas=success['data']['kycdocumentMetas'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public getDocumentTypes(documentMetaCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentTypes(documentMetaCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentTypes=success['data']['kycDocumentTypes'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public getDocumentChannels(documentMetaCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentChannels(documentMetaCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentChannels=JSON.parse(success['data'])['data'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public getUserDocuments(documentMetaCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getUserDocuments(documentMetaCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.userDocuments = [];
        let userDocuments =success['data']['kycDocs'];
        this.totalUserDocuments=success['data']['pagination']['count'];        
        for(let index in userDocuments){
          this.userDocuments.push(
                                  {
                                    "countryName":userDocuments[index]['country']['countryName'],
                                    "countryCode":userDocuments[index]['country']['countryCode'],
                                    "documentType":userDocuments[index]['kycDocumentType']['documentType'],
                                    "kycDocumentMetaId":userDocuments[index]['kycDocumentMeta']['kycDocumentMetaId'],
                                    "documentName":userDocuments[index]['kycDocumentMeta']['documentName'],
                                    "kycDocumentTypeId":userDocuments[index]['kycDocumentType']['kycDocumentTypeId'],
                                    "kycDocId":userDocuments[index]['kycDocId'],
                                    "isMandatory":userDocuments[index]['isMandatory'],
                                    "channelName":userDocuments[index]['channelName']
                                  });
        }
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveUserDocument(userDocument){
    this.blockUserInterface();
    this.authorizationApiService.saveUserDocument(userDocument).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getUserDocuments(this.userDocumentCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public updateUserDocument(userDocumentId, userDocument){
    this.blockUserInterface();
    this.authorizationApiService.updateUserDocument(userDocumentId, userDocument).subscribe(
      success=>{
        this.unblockUserInterface();
        this.kycUserDocument=false;
        this.successMessage(success);
        this.getUserDocuments(this.userDocumentCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public editDocumentChannel(userDocument){
    this.getDocumentChannels(this.userDocumentChannelCriteria);    
    console.log("---------userDocument--------", userDocument);
    this.documentChannelName['kycdocId']=userDocument['kycDocId'];
    this.documentChannelName['channelName']=userDocument['channelName'];
    this.openRefreshChannelDataModal();
  }

  public saveAndUpdateDocumentChannel(){
    this.closeRefreshChannelDataModal();
    this.blockUserInterface();
    this.authorizationApiService.updateDocumentChannel(this.documentChannelName).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getUserDocuments(this.userDocumentCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  /* It gets user on demand.*/
	public reloadUserDocuments(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.userDocumentCriteria['pageNo']=pageNo;
		this.userDocumentCriteria['pageSize']=pageSize;
		this.getUserDocuments(this.userDocumentCriteria);
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
