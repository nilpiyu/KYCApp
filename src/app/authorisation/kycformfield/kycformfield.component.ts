import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { MessageToasterComponent } from './../../message-toaster/message-toaster.component'; 
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';


@Component({
  selector: 'app-kycformfield',
  templateUrl: './kycformfield.component.html',
  styleUrls: ['./kycformfield.component.css'],
  providers:[MessageToasterComponent]
})
export class KycformfieldComponent implements OnInit {

  private formFieldModal=false;
  private formField={};
  private formFields=[];
  private maxLengthExceeded=[];
  private totalFormFields:number=0;
  private noOfFormFieldsPerPage=10;
  private formFieldCriteria={pageNo:1, pageSize:this.noOfFormFieldsPerPage, count:-1};

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("formFieldForm") formFieldForm:any;
  
  constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private messageToasterComponent:MessageToasterComponent, private viewContainerRef:ViewContainerRef) { 
  }

  ngOnInit() {
    this.getFormFields(this.formFieldCriteria);
  }

  public openModal(){
    this.formFieldForm.reset();
    this.formFieldModal=true;
    for(let key in this.formField){
      this.formField[key]=undefined;
    }
  }

  public closeModal(){
    this.formFieldModal=false;
  }

  public saveAndUpdateFormField(){
    if(!this.formField['fid']){
      this.saveFormField(this.formField);
    } else if(this.formField['fid']){
      this.updateFormField(this.formField['fid'], this.formField);
    }
  }

  public editFormField(formField){
    this.formFieldModal=true;
    for(let key in formField){
      this.maxLengthExceeded[key]=false;
      this.formField[key]=formField[key];
    }
  }

  public getFormFields(formFieldCriteria){
    this.blockUserInterface()
    this.authorizationApiService.getFormFields(formFieldCriteria).subscribe(
      success=>{
        this.unblockUserInterface()
        this.formFields=success['data']['formfileds'];
        this.totalFormFields=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface()
      });
  }

  public saveFormField(formField){
    this.blockUserInterface()
    this.authorizationApiService.saveFormField(formField).subscribe(
      success=>{
        this.unblockUserInterface()
        this.formFieldModal=false;
        this.messageToasterComponent.successMessage(success);
        this.getFormFields(this.formFieldCriteria);
      }, 
      error=>{
        this.unblockUserInterface()
        this.formFieldModal=false;
        this.messageToasterComponent.errorMessage(error);
      });
  }

  public updateFormField(formFieldId, formField){
    this.blockUserInterface();
    this.authorizationApiService.updateFormFieldById(formFieldId, formField).subscribe(
      success=>{
        this.unblockUserInterface();
        this.formFieldModal=false;
        this.messageToasterComponent.successMessage(success);
        this.getFormFields(this.formFieldCriteria);
      }, 
      error=>{
        this.unblockUserInterface()
        this.messageToasterComponent.errorMessage(error);
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
	public reloadFormFields(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.formFieldCriteria['pageNo']=pageNo;
		this.formFieldCriteria['pageSize']=pageSize;
		this.getFormFields(this.formFieldCriteria);
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
