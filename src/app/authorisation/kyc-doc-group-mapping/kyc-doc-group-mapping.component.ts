import { Component, OnInit,ViewChild,ViewContainerRef } from '@angular/core';
import { AuthorizationApiService } from "./../../services/authorization-api.service";
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-kyc-doc-group-mapping',
  templateUrl: './kyc-doc-group-mapping.component.html',
  styleUrls: ['./kyc-doc-group-mapping.component.css'],
  providers:[AuthorizationApiService]
})
export class KycDocGroupMappingComponent implements OnInit {
  private countries=[];
  private docGroups=[];
  private countriesCredentials={};
  private groups=[];
  private kycDocuments =[];
  private docGroupCredentials={};
  private documentGroupMapping:any={kycDocIds:[], countryId:-1};
  private kycDocIds=[];
  private documentGroupMappingModal = false;
  private documentGroupMappings=[];
  private maxLengthExceeded=[];
  private editableKYCDocIds=[];
  private addDocumentGroupMapping;
  private totalDocGroupMappings:number=0;
  private noOfDocGroupsMappingPerPage=10;
  private documentGroupMappingCriteria={pageNo:1, pageSize:this.noOfDocGroupsMappingPerPage, count:-1};
  private countryPaginationDataCriteria={pageNo:0, pageSize:0, count:-1};
  private mappingDataCriteria={pageNo:0, pageSize:0, count:-1};
  private countryIdCredentials={};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("documentGroupMappingSearchForm") documentGroupMappingSearchForm:any;
  @ViewChild("documentGroupMappingForm") documentGroupMappingForm:any;
  
    constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
      this.toastsManager.setRootViewContainerRef(viewContainerRef);
    }

    ngOnInit() {     
      this.getDocumentGroupMapping(this.documentGroupMappingCriteria);
    }
    
    public openGroupMappingModal(){
      this.addDocumentGroupMapping=true;
      this.documentGroupMappingModal=true;
      this.kycDocuments=[];
      this.kycDocIds=[];
      this.editableKYCDocIds=[];
      this.getCountries();
      this.getGroups(this.mappingDataCriteria);
      for(let key in this.documentGroupMapping){
        this.documentGroupMapping[key]=undefined;
      }
    }

    public closeGroupMappingModal(){
      this.documentGroupMappingSearchForm.reset();
      this.documentGroupMappingForm.reset();
      this.documentGroupMappingModal=false;
    }

    /*This method search the group by country*/
    public getKycDocumentByCountry(){
      let countryCode=this.documentGroupMapping['countryCode'];
      this.countryPaginationDataCriteria['countryCode']=countryCode;
      this.countryPaginationDataCriteria['countryId']=-1;
      this.blockUserInterface();
      this.authorizationApiService.getKycDocsCountry(this.countryPaginationDataCriteria).subscribe(
        success =>{
          this.unblockUserInterface();
          this.kycDocuments = success['data']['kycDocArray'];
          for(let editableKYCDocIdIndex in this.editableKYCDocIds){
            for(let kycDocIndex in this.kycDocuments){
              if(this.kycDocuments[kycDocIndex]['kycDocId']==this.editableKYCDocIds[editableKYCDocIdIndex]){
                this.kycDocuments[kycDocIndex]['status']="true";
              }
            }
          }
        },
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    public readSelectedDocumentIds(index, status){
      let kycDocId = this.kycDocuments[index]['kycDocId'];
      if(status.value){
        if(this.kycDocIds.indexOf(status.value)<0){
          this.kycDocIds[this.kycDocIds.length]=kycDocId;
        }
      } else if(!status.value){
          let kycDocIndex=this.kycDocIds.indexOf(kycDocId);
          if(kycDocIndex>=0){
            this.kycDocIds.splice(kycDocIndex, 1);
          }
      }
    }

    public saveAndUpdateDocumentMapping(){
      this.documentGroupMapping['kycDocIds']=this.kycDocIds;
      this.documentGroupMapping['countryId']=-1;
      let documentGroupId=this.documentGroupMapping['kycDocGroupId'];
      if(this.addDocumentGroupMapping){
        this.saveDocumentGroupMapping(this.documentGroupMapping);
       } else if(!this.addDocumentGroupMapping){
        this.updateDocumentGroupMapping(this.documentGroupMapping);
      }
      this.documentGroupMappingSearchForm.reset();
      this.documentGroupMappingForm.reset();
    }

    /*This method is used by html to edit*/
    public editDocumentGroupMapping(documentGroupMapping, kycDocumentIndex){
      let countryName=documentGroupMapping['kycDocs'][kycDocumentIndex]['country']['countryName'];
      this.addDocumentGroupMapping=false;
      this.documentGroupMappingModal=true;
      this.kycDocuments=[];
      this.editableKYCDocIds=[];
      this.getCountries();
      this.getGroups(this.mappingDataCriteria);
      // let documentGroupMapping=this.documentGroupMappings[documentGroupMappingIndex];
      for(let documentGroupMappingKey in documentGroupMapping ){
        this.maxLengthExceeded[documentGroupMappingKey]=false;
        if(documentGroupMappingKey=='kycDocs'){
          for(let kycDocIndex in documentGroupMapping['kycDocs']){
            if(documentGroupMapping['kycDocs'][kycDocIndex]['country']['countryName']==countryName){
              this.editableKYCDocIds[this.editableKYCDocIds.length]=documentGroupMapping['kycDocs'][kycDocIndex]['kycDocId'];
            }
          }
          if(documentGroupMapping['kycDocs'].length){
            this.documentGroupMapping['countryCode']=documentGroupMapping['kycDocs'][kycDocumentIndex]['country']['countryCode'];
          }
        } else {
          this.documentGroupMapping[documentGroupMappingKey]=documentGroupMapping[documentGroupMappingKey];
        }
      }
      this.getKycDocumentByCountry();
      this.kycDocIds=this.editableKYCDocIds;
    }

    /*This method gives the group name*/
    public getGroups(mappingDataCriteria){
      this.blockUserInterface();
        this.authorizationApiService.getDocGroupName(mappingDataCriteria).subscribe(
          success=>{
            this.groups=success['data']['kycDocGroups'];
            this.unblockUserInterface();
          },
          error=>{
            this.unblockUserInterface();
            this.errorMessage(error);
          });
    }

    /*This method gives the countries*/
    public getCountries(){
      this.blockUserInterface();
      this.authorizationApiService.getCountry().subscribe(
        success=>{
          this.countries=success['data'];
          this.unblockUserInterface();
        },
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    /*This method gets the listing of document group mapping*/
    public getDocumentGroupMapping(documentGroupMappingCriteria){
      this.blockUserInterface();
      this.authorizationApiService.getKycDocGroupMapping(documentGroupMappingCriteria).subscribe(
        success =>{
          this.documentGroupMappings=success['data']['kycDocGroupMappings'];
          this.totalDocGroupMappings=success['data']['pagination']['count'];          
          this.unblockUserInterface();
        },
        error =>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }
  
    /*This method created the document group mapping*/
    public saveDocumentGroupMapping(documentGroupMapping){
      this.documentGroupMappingModal=false;
      this.blockUserInterface();
      this.authorizationApiService.createKycDocGroupMapping(documentGroupMapping).subscribe(
        success=>{
          this.unblockUserInterface();
          this.successMessage(success);
          this.getDocumentGroupMapping(this.documentGroupMappingCriteria);
        },
        error=>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
    }

    /*This method updates the document group mapping*/
    public updateDocumentGroupMapping(documentGroupMapping){
      this.blockUserInterface();
      this.authorizationApiService.updateDocGroupMapping(documentGroupMapping).subscribe(
        success =>{
          this.documentGroupMappingModal=false;
          this.unblockUserInterface();
          this.successMessage(success);
          this.getDocumentGroupMapping(this.documentGroupMappingCriteria);
        },
        error =>{
          this.unblockUserInterface();
          this.errorMessage(error);
        });
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

    /* It gets user on demand.*/
	public reloadDocGroupMapping(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.documentGroupMappingCriteria['pageNo']=pageNo;
		this.documentGroupMappingCriteria['pageSize']=pageSize;
		this.getDocumentGroupMapping(this.documentGroupMappingCriteria);
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
}
