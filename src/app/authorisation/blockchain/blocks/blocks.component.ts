import { Component, OnInit, ViewContainerRef} from '@angular/core';
import {AuthorizationApiService} from '../../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocalStorageService } from './../../../services/local-storage.service'

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
  providers:[AuthorizationApiService]
})
export class BlocksComponent implements OnInit {

  private blocks = [];
  private limit =10;  
  private blockData = {limit:this.limit, offset:1, orderBy:"timestamp"};
  private countBlocks:number=0;
  private limitBlocks=this.limit
  private producedBlocks=[];
  private votesCastedToDelegate=[];
  private blockTransaction=[];
  private blockCredentials={};
  private blockTransactionModal= false;
  private countBlockTransactions=0;
  private limitBlockTransaction=this.limit
  private blockTransactionCredentials={limit:this.limit, offset:0, orderBy:"t_timestamp"};

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef, private localStorageService:LocalStorageService) {

  }

  ngOnInit() {
    this.getAllBlocks(this.blockData);
  }

  /*This method works on modal close*/
  public closeBlockTransactionModal(){
    this.blockTransactionModal=false;
  }

  /*This methods is used to get the listing of all blocks*/
  public getAllBlocks(blockData){
    this.blockUserInterface();
    this.authorizationApiService.getAllBlocks(blockData).subscribe(
      success => {
        this.unblockUserInterface();
        this.blocks = success['data']['blocks'];
        this.countBlocks=success['data']['count'];
        for(let blockIndex in this.blocks){
          this.blocks[blockIndex]['totalAmount'] = this.blocks[blockIndex]['totalAmount']/this.localStorageService.belTokenConversion;
          this.blocks[blockIndex]['totalFee'] = this.blocks[blockIndex]['totalFee']/this.localStorageService.belTokenConversion;
          this.blocks[blockIndex]['reward'] = this.blocks[blockIndex]['reward']/this.localStorageService.belTokenConversion;
          this.blocks[blockIndex]['date']=this.getDateByTimestamp(this.blocks[blockIndex]['timestamp']);
        }
      },
      error => {
        this.unblockUserInterface();
      }
    )
  }

  /*This method is used to reload the block*/
  public reloadBlocks(params){
    // let startIndex=params['offset'];
    // let endIndex=startIndex+params['limit'];
    this.blockData['offset']=params['offset'];
    this.blockData['limit']=params['limit'];
    this.getAllBlocks(this.blockData)
  }
  
  /*It reads the block' id. */
  public readBlockId(blockId){
    this.blockTransactionCredentials['blockId']=blockId;
    this.blockTransactionCredentials['limit']=this.limit;
    this.blockTransactionModal=true;
    this.authorizationApiService.getBlockTransactionById(this.blockTransactionCredentials).subscribe(
      success=>{
        this.blockTransaction=success['data']['transactions'];
        for(let transactionIndex in this.blockTransaction){
            this.blockTransaction[transactionIndex]['amount']=this.blockTransaction[transactionIndex]['amount']/this.localStorageService.belTokenConversion;
            this.blockTransaction[transactionIndex]['fee']=this.blockTransaction[transactionIndex]['fee']/this.localStorageService.belTokenConversion;
            this.blockTransaction[transactionIndex]['date']=this.getDateByTimestamp(this.blockTransaction[transactionIndex]['timestamp']);
        }
          this.countBlockTransactions=success['data']['count'];
          if(this.countBlockTransactions<this.limitBlockTransaction){
            this.limitBlockTransaction=this.countBlockTransactions+1;
          }
      },
      error=>{

      }
    )
  }

  public reloadBlockTransactions(params){
    this.blockTransactionCredentials['offset']=params['offset'];
    this.blockTransactionCredentials['limit']=params['limit'];
    if(this.blockTransactionCredentials['offset']!=0){
      this.readBlockId(this.blockTransactionCredentials);    
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

  /*This method works on converting timestamp into date format*/
  public getDateByTimestamp(timestamp) { 
  let utcDate = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0)); 
  let blockChainTimestamp = utcDate.getTime()/1000; 
  let requiredDate = new Date((timestamp + blockChainTimestamp) * 1000); 
  let month = requiredDate.getMonth() + 1; 
  let day = requiredDate.getDate(); 
  let h = requiredDate.getHours(); 
  let m = requiredDate.getMinutes(); 
  let s = requiredDate.getSeconds(); 
  let year=requiredDate.getFullYear();
  return  day+ "/" + month + "/" + year + " " + h + ":" + m + ":" + s; }

}
