import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { MessageToasterComponent } from './../../message-toaster/message-toaster.component'; 
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-kycdocumenttype',
  templateUrl: './kycdocumenttype.component.html',
  styleUrls: ['./kycdocumenttype.component.css'],
  providers:[MessageToasterComponent]
})
export class KycdocumenttypeComponent implements OnInit {
 
    private documentType={};
    private dropdownList = [];
    private selectedItems = [];
    private dropdownSettings = {};
    private kycDocumentType=false;
    private documentTypes=[];
    private selectedDocumentType={};
    private maxLengthExceeded=[];
    private totalDocumentTypes:number=0;
    private noOfDocumentTypesPerPage=10;
    private LimitdocumentType=10
    private documentTypeCriteria={pageNo:1, pageSize:this.noOfDocumentTypesPerPage, count:-1};
    private documentTypeCount=0;

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild(DataTable) userTable;
    @ViewChild("documentTypeForm") documentTypeForm:any;
    
    constructor(private authorizationApiService:AuthorizationApiService, private messageToasterComponent:MessageToasterComponent, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
        this.toastsManager.setRootViewContainerRef(viewContainerRef);
    }
    
    ngOnInit(){
        this.getDocumentTypes(this.documentTypeCriteria);
    }

    public openModal(){
        this.documentTypeForm.reset();
        this.kycDocumentType=true;
        for(let key in this.documentType){
            this.documentType[key]="";
        }
    }

    public closeModal(){
        this.kycDocumentType=false;
    }

    public saveAndUpdateDocumentType(){
        if(!this.documentType['kycDocumentTypeId']){
            this.saveDocumentType(this.documentType);
        } else if(this.documentType['kycDocumentTypeId']){
            this.updateDocumentTypeById(this.documentType['kycDocumentTypeId'], this.documentType);
        }
    }

    public editDocumentTypeId(documentType){
        this.kycDocumentType=true;
        for(let key in documentType){
            this.maxLengthExceeded[key]=false;
            this.documentType[key]=documentType[key];
        }
    }

    public getDocumentTypes(documentTypeCriteria){
        this.blockUserInterface();
        this.authorizationApiService.getDocumentTypes(documentTypeCriteria).subscribe(
            success=>{
                this.unblockUserInterface();
                this.documentTypes=success['data']['kycDocumentTypes'];  
                this.totalDocumentTypes=success['data']['pagination']['count'];
            }, 
            error=>{
                this.unblockUserInterface();
            });
    }

    public saveDocumentType(documentType){
        this.blockUserInterface();
        this.authorizationApiService.saveDocumentType(documentType).subscribe(
            success=>{
                this.unblockUserInterface();
                this.closeModal();
                this.successMessage(success);
                this.getDocumentTypes(this.documentTypeCriteria);
            }, 
            error=>{
                this.unblockUserInterface();
                this.closeModal();
                this.errorMessage(error);
            });
    }

    public updateDocumentTypeById(documentTypeId, documentType){
        this.blockUserInterface();
        this.authorizationApiService.updateDocumentTypeById(documentTypeId, documentType).subscribe(
            success=>{
                this.unblockUserInterface();
                this.closeModal();
                this.successMessage(success);
                this.getDocumentTypes(this.documentTypeCriteria);
            }, 
            error=>{
                this.unblockUserInterface();
                this.closeModal();
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
	public reloadDocumentTypes(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.documentTypeCriteria['pageNo']=pageNo;
		this.documentTypeCriteria['pageSize']=pageSize;
		this.getDocumentTypes(this.documentTypeCriteria);
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
        console.log("---errorString---", errorString);
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
