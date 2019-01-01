import { Component, OnInit,ViewContainerRef,ViewChild } from '@angular/core';
import{AuthorizationApiService} from './../../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../../data-table';

@Component({
  selector: 'app-delegates',
  templateUrl: './delegates.component.html',
  styleUrls: ['./delegates.component.css'],
  providers:[AuthorizationApiService]
})
export class DelegatesComponent implements OnInit {

  public delegates=[];
  public standDelegates=[];
  private limit=10;  
  private paginationData={limit:this.limit, offset:0, orderBy:"rank:asc"};  
  private countDelegates=0;
  private countStandByDelegates=0;  
  private limitDelegates=this.limit;
  private standByDelegatesPaginationCredentials = {limit:this.limit, offset:101,orderBy:"rank:asc"};
  private limitStandByDelegates=this.limit;
  private standByDelegates=[];
  private maxDelegates=101;
  private delegatePaginationCredentials={limit:10, offset:0, orderBy:"rank:asc"}
  
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;

  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);  
  }

  ngOnInit() {
    this.getAllDelegateList(this.delegatePaginationCredentials);
    this.getStandByDelegates(this.standByDelegatesPaginationCredentials);
  }

  /*This method gets the list of all delegates*/
  public getAllDelegateList(paginationData) {
    this.limitDelegates = this.limit;
    this.blockUserInterface();
    this.authorizationApiService.getDelegates(paginationData).subscribe(
    success => {  
      this.limitDelegates = this.limit;
      let delegates=JSON.parse(success['data']);
      this.delegates = delegates['delegates'];
      this.countDelegates = delegates['totalCount'];
      if(this.countDelegates>this.maxDelegates){
        this.countDelegates=this.maxDelegates;
      }
      this.getStandByDelegates(this.standByDelegatesPaginationCredentials);        
      this.unblockUserInterface();      
    },
    error => {
      this.unblockUserInterface();
    });
  }    

  /*This method gets the list of all standby delegates*/
  public getStandByDelegates(standByDelegatesPaginationCredentials){
    this.blockUserInterface();
    this.authorizationApiService.getDelegates(standByDelegatesPaginationCredentials).subscribe(
      success => {
        this.unblockUserInterface();
        this.limitStandByDelegates = this.limit;
        this.standByDelegates = JSON.parse(success['data'])['delegates'];
        this.countStandByDelegates=JSON.parse(success['data'])['totalCount']-this.maxDelegates;
        if(this.countStandByDelegates<this.limitStandByDelegates){
          this.limitStandByDelegates=this.countStandByDelegates;
        }
      },
      error => {
        this.unblockUserInterface();
      }
    )
  }

  /* It gets user on demand.*/
  public reloadDelegates(params) {
    // this.paginationData['offset']=params['offset'];
    // this.paginationData['limit']=params['limit'];
    this.delegatePaginationCredentials['offset']=params['offset'];
    this.delegatePaginationCredentials['limit']=params['limit'];
    let exceededOffset=params['offset']+params['limit'];
    if(params['offset']<101){
      this.limitDelegates=this.limit;
    }
    if(exceededOffset>this.maxDelegates){
      this.delegatePaginationCredentials['limit']=this.maxDelegates-params['offset'];
    }
    this.getAllDelegateList(this.delegatePaginationCredentials);
  }

  /*It works on the reload functionality of standby delegates*/
  public reloadStandByDelegates(params){
    this.standByDelegatesPaginationCredentials['offset']=this.maxDelegates+params['offset'];
    this.standByDelegatesPaginationCredentials['limit']=params['limit'];
    this.getStandByDelegates(this.standByDelegatesPaginationCredentials);
  }

  public resetDataTableLimit(limit){
    this.limitDelegates=limit;
    this.limitStandByDelegates=limit;
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
