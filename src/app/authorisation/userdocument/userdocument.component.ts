import { Component, OnInit,ViewChild,ViewContainerRef } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import { Router, ActivatedRoute , Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-userdocument',
  templateUrl: './userdocument.component.html',
  styleUrls: ['./userdocument.component.css'],
  providers:[AuthorizationApiService,]
  
})
export class UserdocumentComponent implements OnInit {
  private countries=[];
  private userDocuments;
  private userRegisteredEmailId;
  private kycDocIds=[];
  private numberOfPage=5;
  private userId;
  private documentStatus;
  private disabledSaveUserRequestedDocument=true;
  private userRequestedDocuments=[];
  private totalUserRequestedDocument:number=0;
  private documentGroupMappings=[];
  private userRequestedDocumentPerPage=10;
  private documentGroupMappingSearchCriteria={pageNo:0, pageSize:0, count:-1};
  private userRequestedDocumentSearchCriteria={pageNo:1, pageSize:this.userRequestedDocumentPerPage, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private toastsManager:ToastsManager, public viewContainerRef: ViewContainerRef,private authorizationApiService:AuthorizationApiService) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }
  
  ngOnInit() {         
    this.getDocGroupMapping(this.documentGroupMappingSearchCriteria);
  }

  /*This method gets the listing of document group mapping*/
  public getDocGroupMapping(documentRequestCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getKycDocGroupMapping(documentRequestCriteria).subscribe(
      success =>{
        this.unblockUserInterface();
        this.userRequestedDocuments = [];
        this.documentGroupMappings=success['data']['kycDocGroupMappings'];
      },
      error =>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  
  public getUserDocumentByUserEmailAndGroup(){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentByEmailAndGroup(this.userRequestedDocumentSearchCriteria).subscribe(
    success=>{
        this.unblockUserInterface();
        this.userId=success['data']['userId'];
        this.totalUserRequestedDocument=success['data']['kycDocs'].length;
        let userRequestedDocuments=success['data']['kycDocs'];
        this.userRequestedDocuments=[];
        for(let kycDocumentIndex in userRequestedDocuments){
          this.userRequestedDocuments.push({
            "countryName":userRequestedDocuments[kycDocumentIndex]['country']['countryName'],
            "documentType":userRequestedDocuments[kycDocumentIndex]['kycDocumentType']['documentType'],
            "documentName":userRequestedDocuments[kycDocumentIndex]['kycDocumentMeta']['documentName'],
            "kycDocId":userRequestedDocuments[kycDocumentIndex]['kycDocId']
          });
        }
        console.log("--userDocumentsRequest----", this.userRequestedDocuments, "userDocumentsRequest", userRequestedDocuments);
    }, error=>{
      this.unblockUserInterface();
      this.userRequestedDocuments=[];
      // this.userRequestedDocumentSearchCriteria={};
      this.errorMessage(error);
    });
  }

  /*This method is used to sending document sharing request by request to user*/
  public saveUserRequestedDocument(){
    this.blockUserInterface();
    let requestedDocuments={"kycDocIds":this.kycDocIds,"userId":this.userId};
      this.authorizationApiService.submitUserRequestedDocument(requestedDocuments).subscribe(
        success=>{
          this.kycDocIds=[];
          this.getUserDocumentByUserEmailAndGroup();
          this.unblockUserInterface();
          this.successMessage(success);
        }, 
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        }
      );
  }

  public saveDocumentByEmailAndGroup(){
    this.saveUserRequestedDocument();
  }

  /*This method reads the user id and kycdocument id*/
  public requestedDocument(userDocument){
    let kycDocId=userDocument['kycDocId'];
    let userId=userDocument['userId'];
    let documentStatus=userDocument['documentStatus'];
    let kycDocIdIndex=this.kycDocIds.indexOf(kycDocId);
    if(documentStatus){
      if(kycDocIdIndex==-1){
        this.kycDocIds.push(kycDocId); 
      }
    } else {
      if(kycDocIdIndex>-1){
        this.kycDocIds.splice(kycDocIdIndex, 1); 
      }
    }
    this.disabledSaveUserRequestedDocument=(this.kycDocIds.length)?false:true;
  }

   /* It gets user on demand.*/
	public reloadUserRequestedDocument(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.userRequestedDocumentSearchCriteria['pageNo']=pageNo;
    this.userRequestedDocumentSearchCriteria['pageSize']=pageSize;
    if(this.userRequestedDocumentSearchCriteria['kycDocGroupId'] && this.userRequestedDocumentSearchCriteria['recieverEmail']){
     this.getUserDocumentByUserEmailAndGroup();
    }
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
