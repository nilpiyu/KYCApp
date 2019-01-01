import { Component, OnInit,ViewContainerRef, ViewChild} from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service'
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  
  
  private activities=[];
  private noOfUsers;
  private noOfUsersPerPage=10;
  private totalNoOfActivitiesCriteria={pageNo:0, pageSize:0, count:-1};
  private getActivitiesCriteria={kycVerified:false, pageNo:1, pageSize:this.noOfUsersPerPage, count:0};
  constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getTotalNoOfUsers(this.totalNoOfActivitiesCriteria);    
    this.getActivities(this.getActivitiesCriteria);
  }

  public getTotalNoOfUsers(totalNoOfActivitiesCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getActivities(totalNoOfActivitiesCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.noOfUsers=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getActivities(userSearchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getActivities(userSearchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        // this.successMessage(success);
        this.activities=success['data']['activites'];
        this.getTotalNoOfUsers(this.totalNoOfActivitiesCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  
  /* It gets user on demand.*/
	public reloadUsers(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.getActivitiesCriteria['pageNo']=pageNo;
		this.getActivitiesCriteria['pageSize']=pageSize;
		this.getActivities(this.getActivitiesCriteria);
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
