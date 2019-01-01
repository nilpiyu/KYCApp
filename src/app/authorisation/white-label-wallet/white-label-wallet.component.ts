import { Component, OnInit,ViewContainerRef,ViewChild} from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-white-label-wallet',
  templateUrl: './white-label-wallet.component.html',
  styleUrls: ['./white-label-wallet.component.css']
})
export class WhiteLabelWalletComponent implements OnInit {

  private whiteLabelModal=false;
  private whiteLabelMeta={}
  private whiteLabelMetas=[];
  private noOfWalletsPerPage=10;
  private noOfWallets:number=0;
  private walletDataCriteria={pageNo:1, pageSize:this.noOfWalletsPerPage, count:-1, isInactiveRequired:true};

  private maxLengthExceeded=[];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DataTable) userTable;
  @ViewChild("whiteLabelWalletForm") whiteLabelWalletForm:any;

  constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getWhiteLabelWallet(this.walletDataCriteria);
  }

  public openWhiteLabelModal(){
    this.whiteLabelWalletForm.reset();
    this.whiteLabelModal=true;
    for(let key in this.whiteLabelMeta){
      this.whiteLabelMeta[key]=undefined;
    }
  }

  public closeModal(){
    this.whiteLabelModal=false;
  }

  public editWhiteWalletById(whiteLabelMeta){
    this.whiteLabelModal=true;
    for(let key in whiteLabelMeta){
      if(key=="active"){
        this.whiteLabelMeta['isActive']=whiteLabelMeta[key];
      } else {
        this.whiteLabelMeta[key]=whiteLabelMeta[key];
      }
    }
  }

  public saveWhiteLabelWallet(whiteLabelMeta){
    this.blockUserInterface();
    this.authorizationApiService.saveWhiteLabelWallet(whiteLabelMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.whiteLabelModal=false;
        let walletWhiteLabelId = success['data']['walletWhiteLabelId']
        this.successMessage(success);
        this.getWhiteLabelWallet(this.walletDataCriteria);
      },
      error=>{
        this.unblockUserInterface();
        this.whiteLabelModal=false;
        this.errorMessage(error);
      });
  }


  public getWhiteLabelWallet(whiteLabelData){
    this.blockUserInterface();
    this.authorizationApiService.getWhiteLabelWallet(whiteLabelData).subscribe(
      success=>{
        this.unblockUserInterface();
        this.whiteLabelMetas=success['data']['socialProfileMetas'];
        this.noOfWallets=success['data']['pagination']['count'];
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public updateWhiteLabelWallet(walletWhiteLabelId,whiteLabelMeta){
    this.authorizationApiService.updateWhiteLabelById(walletWhiteLabelId,whiteLabelMeta).subscribe(
      success=>{
        this.unblockUserInterface();
        this.whiteLabelModal=false;
        let walletWhiteLabelId = whiteLabelMeta['walletWhiteLabelId'];
        this.successMessage(success);
        this.getWhiteLabelWallet(this.walletDataCriteria);
      },
      error=>{
        this.errorMessage(error);
        this.whiteLabelModal=false;
      });
  }

  public saveAndUpdateWallet(){
    if(!this.whiteLabelMeta['walletWhiteLabelId']){
      this.saveWhiteLabelWallet(this.whiteLabelMeta);
    } else if(this.whiteLabelMeta['walletWhiteLabelId']){
      this.updateWhiteLabelWallet(this.whiteLabelMeta['walletWhiteLabelId'],this.whiteLabelMeta);
    }
  }

  public checkMaxLength(fieldName, maxLength){
    if(fieldName.value.length==maxLength){
        this.maxLengthExceeded[fieldName.name]=true;
    } else if(fieldName.value.length<maxLength){
        this.maxLengthExceeded[fieldName.name]=false;
    }
  }

  /* It gets user on demand.*/
	public reloadWallets(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.walletDataCriteria['pageNo']=pageNo;
		this.walletDataCriteria['pageSize']=pageSize;
    this.getWhiteLabelWallet(this.walletDataCriteria);
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
