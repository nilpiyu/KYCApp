import { Component, OnInit,ViewContainerRef, ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;

  private users=[];
  private noOfUsers:number=0;
  private noOfUsersPerPage=10;
  private userSearchCriteria={kycVerified:false, pageNo:1, pageSize:this.noOfUsersPerPage, count:-1};

  constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getUsers(this.userSearchCriteria);
  }

  public getUsers(userSearchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getUsers(userSearchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.users=success['data']['users'];
        this.noOfUsers=success['data']['pagination']['count'];
      }, 
      error=>{
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
	public reloadUsers(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.userSearchCriteria['pageNo']=pageNo;
		this.userSearchCriteria['pageSize']=pageSize;
		this.getUsers(this.userSearchCriteria);
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
