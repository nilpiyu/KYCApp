import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import{AuthorizationApiService} from './../../services/authorization-api.service';
import { Router, ActivatedRoute , Params } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocalStorageService } from '../../services/local-storage.service';
import { DomSanitizer } from '@angular/platform-browser'
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-authorisedocument',
  templateUrl: './authorisedocument.component.html',
  styleUrls: ['./authorisedocument.component.css'],
  providers:[AuthorizationApiService]
})
export class AuthorisedocumentComponent implements OnInit {
  private requestData=[];
  private sharedData ={pageNo:1, pageSize:100};
  private requestedDocumentImage;
  private viewRequestedDocumentImageModal=false;
  private totalUserDocuments;
  private noOfUserDocumentsPerPage=10;
  private authoriseDocumentCriteria={pageNo:1, pageSize:this.noOfUserDocumentsPerPage, count:-1};
  private documentViewPaymentModal:boolean=false;
  private paymentCredentials:object={};
  private belTokenConversion:number=0;
  private viewDocumentFee:number;
  private userCountries:any=[];

  @BlockUI() blockUI: NgBlockUI;
  

  constructor(private router: Router, private activatedRoute: ActivatedRoute,private toastsManager:ToastsManager, public viewContainerRef: ViewContainerRef,private authorizationApiService:AuthorizationApiService, private localStorageService:LocalStorageService, private domSanitizer:DomSanitizer) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.belTokenConversion=this.localStorageService.belTokenConversion;
  }

  ngOnInit() {
    this.getDocumentSharingRequesterRequest(this.authoriseDocumentCriteria);
  }

  public openDocumentViewPaymentModal(){
    this.getCountriesByUser();
    this.documentViewPaymentModal=true;
  }

  public  closeDocumentViewPaymentModal(){
    this.documentViewPaymentModal=false;
  }


  public openViewUploadedDocumentModal(){
    this.viewRequestedDocumentImageModal=true;        
  }

  public closeViewUploadedDocumentModal(){
    this.viewRequestedDocumentImageModal=false;        
  }

  public getDocumentSharingRequesterRequest(authoriseDocumentCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentSharingRequesterRequest(authoriseDocumentCriteria).subscribe(
      success => {
        this.requestData=[];
        let requestData = success['data']['requests'];
        this.totalUserDocuments=success['data']['pagination']['count'];
        for(let index in requestData){
          let uploadedDate=requestData[index]['updatedAt'];
          requestData[index]['updatedAt']=new Date(uploadedDate).toLocaleString();
          this.requestData.push(
                                  {
                                    "documentSharingId":requestData[index]["documentSharingId"],
                                    "hashDigest":requestData[index]["hashDigest"],
                                    "countryName":requestData[index]['kycdoc']['country']['countryName'],
                                    "countryCode":requestData[index]['kycdoc']['country']['countryCode'],
                                    "email":requestData[index]['user']['email'],
                                    "documentType":requestData[index]['kycdoc']['kycDocumentType']['documentType'],
                                    "documentName":requestData[index]['kycdoc']['kycDocumentMeta']['documentName'],
                                    "updatedAt":requestData[index]['updatedAt'],
                                    "status":requestData[index]['status'],
                                    "userStatus":requestData[index]['kycdoc']['status'],
                                    "paymentStatus":(requestData[index]['paymentTransaction'] && requestData[index]['paymentTransaction']['transactionStatus'])?requestData[index]['paymentTransaction']['transactionStatus']:undefined,
                                    "viewDocumentFee":JSON.parse(requestData[index]['kycdoc']['channelData'])['fee']
                                  }
          )
        }
        this.unblockUserInterface();
      },
      error => {
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public viewAuthorisedDocumentByUser(viewDocument){
    this.paymentCredentials={};        
    console.log("=========viewAuthorisedDocumentByUser==========", viewDocument);
    if(viewDocument && (!viewDocument['paymentStatus'] || viewDocument['paymentStatus']=="REJECTED")){
        this.viewDocumentFee=viewDocument['viewDocumentFee'];
        this.paymentCredentials['documentSharingId']=viewDocument['documentSharingId'];
        this.openDocumentViewPaymentModal();
    } else if(viewDocument && (viewDocument['paymentStatus']=='PENDING')){
        this.toastsManager.error("Payment is not confirmed yet.");
    } else if(viewDocument && (viewDocument['paymentStatus']=='CONFIRMED')){
        let requestedDocumentCredentials={
          "documentSharingId":viewDocument['documentSharingId'],
          "secretKey":this.localStorageService.getBKVSSecretKey()
        };
        this.getDocumentsAuthorisedByMerchant(requestedDocumentCredentials);
    }
  }

  public saveAndUpdateDocumentViewPayment(){
    this.documentViewPaymentModal=false;
    this.blockUserInterface();
    this.authorizationApiService.documentViewPayment(this.paymentCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getDocumentSharingRequesterRequest(this.authoriseDocumentCriteria);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getDocumentsAuthorisedByMerchant(requestedDocumentCredentials){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentsAuthorisedByMerchant(requestedDocumentCredentials).subscribe(
      success=>{
        // this.requestedDocumentImage=success['data']['encodedDocumentString'];
        this.requestedDocumentImage=this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+success['data']['encodedDocumentString']);
        this.unblockUserInterface();
	this.openViewUploadedDocumentModal();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getCountriesByUser(){
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

   /* It gets user on demand.*/
	public reloadUserDocuments(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.authoriseDocumentCriteria['pageNo']=pageNo;
		this.authoriseDocumentCriteria['pageSize']=pageSize;
    this.getDocumentSharingRequesterRequest(this.authoriseDocumentCriteria);
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

  public closeViewRequestedDocumentImageModal(){
    this.viewRequestedDocumentImageModal=false;
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
