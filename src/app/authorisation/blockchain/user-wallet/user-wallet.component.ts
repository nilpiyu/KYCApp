import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthorizationApiService } from './../../../services/authorization-api.service';
import { LocalStorageService } from './../../../services/local-storage.service';
import { DataTable, DataTableTranslations, DataTableResource } from './../../../data-table';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent implements OnInit {

  private userWallets=[];
  private limit=10;
  private userWalletCount:number=this.limit;
  private userWalletPerPage:number=this.limit;
  private userWallet:object={"pageNo":1, "pageSize":this.limit, "count":-1};
  private loginAdminWalletCredentials:object={};
  private loginAdminWalletModal:boolean=false;
  private adminWalletAddress:string;
  private secondSecretStatus:boolean;
  private isLoggedIn:boolean=false;

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild("secretForm") secretForm:any;

  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private localStorageService:LocalStorageService) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    this.loginAdminWalletCredentials['countryCode']=this.localStorageService.getCountryCode();
    this.userWallets=[];
  }

  ngOnInit() {
  }

  public openLoginAdminWalletModal(){
    this.secretForm.reset();
    this.loginAdminWalletCredentials['secret']=undefined;
    this.loginAdminWalletModal=true;
  }

  public closeLoginAdminWalletModal(){
    this.loginAdminWalletModal=false;
  }

  public loginAdminWallet(){
    let walletKey=this.localStorageService.getCountryCode();
    let adminWallet=this.localStorageService.getUserWalletByCountry(walletKey);
    console.log();
    if(adminWallet){
      this.loginAdminWalletCredentials['secret']=adminWallet['account']['secret'];
      this.loginAdminWalletBySecret();
    } else if(!adminWallet){
      this.openLoginAdminWalletModal();
    }
  }

  public loginAdminWalletBySecret(){
    this.authorizationApiService.getWalletLogin(this.loginAdminWalletCredentials).subscribe(
      success=>{
        console.log("----loginAdminWallet success-----", success);
        if(success && success['data']){
          this.isLoggedIn=true;
          this.closeLoginAdminWalletModal();
          let data=JSON.parse(success['data']['data']);
          if(data['account']){
            this.adminWalletAddress=data['account']['address'];
            data['account']['secret']=this.loginAdminWalletCredentials['secret'];
            let walletKey=this.localStorageService.getCountryCode();
            this.localStorageService.setUserWalletByCountry(walletKey, data);
            // this.secondSecretStatus=!data['account']['secondSignature'];
            this.getUserWallet(this.userWallet);
          }  
        }  
      },
      error=>{
        console.log("----loginAdminWallet error-----", error);
      });
  }

  public getUserWallet(userWallet:object){
    this.blockUserInterface();
    this.authorizationApiService.getUserWallet(userWallet).subscribe(
      success=>{
        this.unblockUserInterface();
        console.log("---success in getUserWallet---", success);
        let data=[];
        if(success && success['data']){
          data=success['data'];
        }
        if(data['pagination'] && data['pagination']['count']){
          this.userWalletCount=data['pagination']['count'];        
        }
        if(data['wallets']){
          this.userWallets=data['wallets'];     
        }
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public disableUserWalletBlockchainStatus(userWallet){
    console.log("=====disableUserWalletBlockchainStatus====", userWallet);
    let userWalletDisableCredentials={
                                        "currency":"BEL",
                                        "secret":this.loginAdminWalletCredentials['secret'],
                                        "senderCountryCode":this.localStorageService.getCountryCode(),
                                        "recepientCountryCode":userWallet['recepientCountryCode'],
                                        "recipientId":userWallet['address'],
                                        "status":0
                                     };
    this.blockUserInterface();
    this.authorizationApiService.disableUserWalletBlockchainStatus(userWalletDisableCredentials).subscribe(
      success=>{
        this.unblockUserInterface();
        this.successMessage(success);
        this.getUserWallet(this.userWallet);
      },
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      }
    );
  }

  /* It gets user on demand.*/
	public reloadUserWallet(params) {
		let pageOffset=params['offset'];
		let pageSize=params['limit'];
		let pageNo=(pageOffset/pageSize)+1;
		this.userWallet['pageNo']=pageNo;
    this.userWallet['pageSize']=pageSize;
    if(this.isLoggedIn){
      this.getUserWallet(this.userWallet);
    }
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
