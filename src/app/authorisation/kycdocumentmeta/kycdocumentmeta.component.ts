import { Component, OnInit, ViewContainerRef,ViewChild} from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service'; 
import { MessageToasterComponent } from './../../message-toaster/message-toaster.component'; 
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';



@Component({
  selector: 'app-kycdocumentmeta',
  templateUrl: './kycdocumentmeta.component.html',
  styleUrls: ['./kycdocumentmeta.component.css'],
  providers:[MessageToasterComponent]
})
export class KycdocumentmetaComponent implements OnInit {

  private kycDocumentMeta;
  private documentMeta={};
  private documentMetas=[];
  private maxLengthExceeded=[];
  private totalDocumentMetas:number=0;
  private noOfDocumentMetasPerPage=10;
  private documentMetaCriteria={pageNo:1, pageSize:this.noOfDocumentMetasPerPage, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("documentMetaForm") documentMetaForm:any;
  
  constructor(private authorizationApiService:AuthorizationApiService, private messageToasterComponent:MessageToasterComponent, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getDocumentMetas(this.documentMetaCriteria);
  }

  public openModal(){
    this.documentMetaForm.reset();
    this.kycDocumentMeta=true;
    for(let key in this.documentMeta){
      this.documentMeta[key]="";
    }
  }

  public closeModal(){
    this.kycDocumentMeta=false;
  }

  public saveAndUpdateDocumentMeta(){
    this.kycDocumentMeta=false;
    if(!this.documentMeta['kycDocumentMetaId']){
      this.saveDocumentMeta(this.documentMeta);
    } else if(this.documentMeta['kycDocumentMetaId']){
      this.updateDocumentMetaById(this.documentMeta['kycDocumentMetaId'], this.documentMeta);
    }
  }

  public editDocumentMeta(documentMeta){
    this.kycDocumentMeta=true;
    for(let key in documentMeta){
      this.maxLengthExceeded[key]=false;
      this.documentMeta[key]=documentMeta[key];
    }
  }

  public getDocumentMetas(documentMetaCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getDocumentMetas(documentMetaCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.documentMetas=success['data']['kycdocumentMetas'];
        this.totalDocumentMetas=success['data']['pagination']['count'];
      },
      error=>{
        this.unblockUserInterface();
      });
  }

  public saveDocumentMeta(documentMeta){
    this.blockUserInterface();
    this.authorizationApiService.saveDocumentMeta(documentMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getDocumentMetas(this.documentMetaCriteria);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public updateDocumentMetaById(documentMetaId, documentMeta){
    this.blockUserInterface();
    this.authorizationApiService.updateDocumentMetaById(documentMetaId, documentMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getDocumentMetas(this.documentMetaCriteria);
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
	public reloadDocumentMetas(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.documentMetaCriteria['pageNo']=pageNo;
		this.documentMetaCriteria['pageSize']=pageSize;
		this.getDocumentMetas(this.documentMetaCriteria);
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
