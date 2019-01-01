import { Component, OnInit, ViewContainerRef,ViewChild } from '@angular/core';
import { AuthorizationApiService } from "./../../services/authorization-api.service";
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  private roleModal=false;
  private userRole={active:false};
  private roles=[];
  private activities=[];
  private activityIds=[];
  private totalRoles:number=0;;
  private noOfRolesPerPage=10;
  private roleDataCriteria={pageNo:1, pageSize:this.noOfRolesPerPage, count:-1};
  private activityCriteria={pageNo:0, pageSize:0, count:-1}
  
  
  private maxLengthExceeded=[];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("roleForm") roleForm:any; 
  
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getRoles(this.roleDataCriteria);
  }

  public openModal(){
    this.roleForm.reset();
    this.roleModal=true;
    for(let key in this.userRole){
      this.userRole[key]=undefined;
    }
    this.activityIds=[];
    this.getActivities(this.activityCriteria);
  }

  public closeModal(){
    this.roleModal=false;
  }

  public editRoleById(userRole){
    this.roleModal=true;
    for(let key in userRole){
      this.userRole[key]=userRole[key];
    }
    this.getActivities(this.activityCriteria);
    this.getAssignedActivitiesByRoleId(userRole['roleId']);
  }

  public saveAndUpdateRole(){
    if(!this.userRole['roleId']){
      this.saveRole(this.userRole);
    } else if(this.userRole['roleId']){
      this.updateRoleById(this.userRole['roleId'], this.userRole);
    }
  }

  public assignActivitiesByRoleId(roleId){
    let roleActivityIds={"activityIdArray":this.activityIds, "roleId":roleId};
    this.saveAssignedActivitiesByRoleId(roleActivityIds);
  }

  public getRoles(userSearchCriteria){
    this.blockUserInterface();    
    this.authorizationApiService.getRoles(userSearchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.roles=success['data']['roles'];
        this.totalRoles=success['data']['pagination']['count'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveRole(userRole){
    this.blockUserInterface();
    this.authorizationApiService.saveRole(userRole).subscribe(
      success=>{
        this.unblockUserInterface();
        this.roleModal=false;
        let roleId=success['data']['roleId'];
        this.successMessage(success);
        this.assignActivitiesByRoleId(roleId);
        this.getRoles(this.roleDataCriteria);
      }, 
      error=>{
        this.unblockUserInterface();
        this.roleModal=false;
        this.errorMessage(error);
      });
  }

  public updateRoleById(userRoleId, userRole){
    this.blockUserInterface();
    this.authorizationApiService.updateRoleById(userRoleId, userRole).subscribe(
      success=>{
        this.unblockUserInterface();
        this.roleModal=false;
        let roleId=userRole['roleId'];
        this.successMessage(success);
        this.assignActivitiesByRoleId(roleId);
        this.getRoles(this.roleDataCriteria);
      }, 
      error=>{
        this.errorMessage(error);
      });
  }

  public getActivities(activityCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getActivities(activityCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        this.activities=success['data']['activites'];
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getAssignedActivitiesByRoleId(roleId:string){
    this.blockUserInterface();
    this.authorizationApiService.getAssignedActivitiesByRoleId(roleId).subscribe(
      success=>{
        this.unblockUserInterface();
        this.activityIds=[];
        let roleActivities=success['data'];
        for(let index in roleActivities){
          this.activityIds.push(roleActivities[index]['activityId']);
        }
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public saveAssignedActivitiesByRoleId(roleActivityIds){
    this.blockUserInterface();
    this.authorizationApiService.assignActivitiesByRoleId(roleActivityIds).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
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
	public reloadRoles(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.roleDataCriteria['pageNo']=pageNo;
		this.roleDataCriteria['pageSize']=pageSize;
    this.getRoles(this.roleDataCriteria);
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
