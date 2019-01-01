import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-kycformfieldmeta',
  templateUrl: './kycformfieldmeta.component.html',
  styleUrls: ['./kycformfieldmeta.component.css']
})
export class KycformfieldmetaComponent implements OnInit {

  private formFieldMetaModal=false;
  private formFieldCustomPattern;
  private formFieldMeta={otherpattern:{}};
  private userDocuments=[];
  private formFields=[];
  private formFieldPatterns=[];
  private formFieldTypes=[];
  private formFieldRequireds=[{required:true}, {required:false}];
  private formFieldsMeta=[];
  private maxLengthExceeded=[];
  private totalFormFieldsMeta:number=0;
  private noOfFormFieldsMetaPerPage=10;
  private formFieldMetaQueryParams={pageNo:1, pageSize:this.noOfFormFieldsMetaPerPage, count:-1};
  private userDocumentQueryParams={pageNo:0, pageSize:0, count:-1};
  private formFieldPatternQueryParams={pageNo:0, pageSize:0, count:-1};
  private formFieldQueryParams={pageNo:0, pageSize:0, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild("formFieldMetaForm") formFieldMetaForm:any;
  
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {   
    this.getFormFieldsMeta(this.formFieldMetaQueryParams);
  }

  public openModal(){
    this.formFieldMetaModal=true;
    this.resetFieldsMetaData();
    this.getUserDocuments();
    this.getFormFields();
    this.getFormFieldTypes();
    this.getFormFieldPatterns();
  }

  public closeModal(){
    this.formFieldMetaModal=false;
    this.formFieldMetaForm.reset();    
  }

  public resetFieldsMetaData(){
    this.formFieldMeta={otherpattern:{}};
    if(this.formFieldCustomPattern){
      this.formFieldCustomPattern=false;
    }
    console.log("---formFieldMeta---", this.formFieldMeta);
  }

  public selectFormFieldCustomPattern(){
    this.formFieldMeta['otherpattern']={};
    if(this.formFieldCustomPattern){
      delete this.formFieldMeta['patternid'];
    }
  }

  public saveAndUpdateFormFieldMeta(){
    let formFieldMeta={};
    for(let key in this.formFieldMeta){
      formFieldMeta[key]=this.formFieldMeta[key];
    }
    if(formFieldMeta['patternid']){
      delete formFieldMeta['otherpattern'];
    } else if(!formFieldMeta['patternid']){
      delete formFieldMeta['patternid'];
    }
    if(!formFieldMeta['formmetaid']){
      this.saveFormFieldMeta({payload:[formFieldMeta]});
    } else if(formFieldMeta['formmetaid']){
      this.updateFormFieldMetaById(formFieldMeta['formmetaid'], formFieldMeta)
    }
    this.formFieldMetaForm.reset();        
  }
  
  public editFormFieldMetaById(formFieldMeta){
    this.getUserDocuments();
    this.getFormFields();
    this.getFormFieldTypes();
    this.getFormFieldPatterns();
    for(let key in formFieldMeta){
      if(key=="patternid" && !formFieldMeta[key]){
        this.formFieldCustomPattern=true;
        formFieldMeta[key]=undefined;
      } else if(key=="patternid" && formFieldMeta[key]){
        this.formFieldCustomPattern=false;
      }
      if(key=="javapattern" || key=="jspattern"){
        this.formFieldMeta['otherpattern']=this.formFieldMeta['otherpattern'] || {};
        this.formFieldMeta['otherpattern'][key]=formFieldMeta[key];
      } else {
        this.formFieldMeta[key]=formFieldMeta[key];
      }
    }
    console.log("---this.formFieldMeta in edit---", this.formFieldMeta);
    for(let key in this.formFieldMeta){
      console.log("----this.formFieldMeta[key] in edit----", this.formFieldMeta[key], "--type--", typeof this.formFieldMeta[key]);
    }
    this.formFieldMetaModal=true;
  }

  public deleteFormFieldMetaDataById(formFieldMetaId){
    this.blockUserInterface();
    this.authorizationApiService.deleteFormFieldMetaById(formFieldMetaId).subscribe(success=>{
      this.unblockUserInterface();
      this.getFormFieldsMeta(this.formFieldMetaQueryParams);
      this.successMessage(success);
    }, error=>{
      this.unblockUserInterface();
      this.errorMessage(error);
    });
  }

  public readSelectedFormFieldPattern(){
   let patternId=this.formFieldMeta['patternid'];
   for(let index in this.formFieldPatterns){
     if(this.formFieldPatterns[index]['patternid']==patternId){
       this.formFieldMeta['otherpattern']['jspattern']=this.formFieldPatterns[index]['jspattern'];
       this.formFieldMeta['otherpattern']['javapattern']=this.formFieldPatterns[index]['javapattern'];
       this.formFieldMeta['messagetodisplay']=this.formFieldPatterns[index]['messagetodisplay'];
     }
   }
  }

  public getFormFieldsMeta(totalNoOfUsersSearchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getFormFieldsMeta(totalNoOfUsersSearchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldsMeta=success['data']['kycdocformmetas'];
        this.totalFormFieldsMeta=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveFormFieldMeta(formFieldMeta){
    this.blockUserInterface();
    this.authorizationApiService.saveFormFieldMeta(formFieldMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldMetaModal=false;
        this.successMessage(success);
        this.getFormFieldsMeta(this.formFieldMetaQueryParams);
      }, 
      error=>{
        this.unblockUserInterface();
        this.formFieldMetaModal=false;
        this.errorMessage(error);
      });
  }

  public updateFormFieldMetaById(formFieldMetaId, formFieldMeta){
    this.blockUserInterface();
    this.authorizationApiService.updateFormFieldMetaById(formFieldMetaId, formFieldMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldMetaModal=false;
        this.successMessage(success);
        this.getFormFieldsMeta(this.formFieldMetaQueryParams);
      }, 
      error=>{
        this.errorMessage(error);
      });
  }

  public getUserDocuments(){
    this.blockUserInterface();
    this.authorizationApiService.getUserDocuments(this.userDocumentQueryParams).subscribe(
      success=>{
        this.unblockUserInterface();
        this.userDocuments=success['data']['kycDocs'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public getFormFields(){
    this.blockUserInterface();
    this.authorizationApiService.getFormFields(this.formFieldQueryParams).subscribe(
      success=>{
        this.formFields=success['data']['formfileds'];
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error)
      });
  }

  public getFormFieldTypes(){
    this.blockUserInterface();
    this.authorizationApiService.getFormFieldTypes().subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldTypes=success['data'];
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getFormFieldPatterns(){
    this.blockUserInterface();
    this.authorizationApiService.getFormFieldPatterns(this.formFieldPatternQueryParams).subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldPatterns=success['data'];
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

  public reloadFormFieldsMeta(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.formFieldMetaQueryParams['pageNo']=pageNo;
		this.formFieldMetaQueryParams['pageSize']=pageSize;
		this.getFormFieldsMeta(this.formFieldMetaQueryParams);
  }
}
