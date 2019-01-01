import { Component, OnInit,ViewContainerRef } from '@angular/core';
import {single, multi, userPercentageCountryWise} from '../data';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  
  single: any[];
  multi: any[];
  userPercentageCountryWise:any[];
  view: any[] = [330, 200];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'User(s)';
  showYAxisLabel = true;
  yAxisLabel = 'Country';
  private userChart={};
  private walletGraph={};

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public doughnutChartWalletLabels:string[] = ['Inactive Wallet', 'Active Wallet'];
  public doughnutChartWalletData:number[] = [120, 110];
  public doughnutChartType:string = 'doughnut';
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }

  private searchCriteria={"startDate":"2016-01-01", "endDate":"2018-03-18"};
  
  constructor(private authorizationApiService:AuthorizationApiService,private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) { 
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
    let currentDate=new Date();
    this.getEndDate(currentDate);
    this.getVerifiedAndUnverifiedUserCountByCountry(this.searchCriteria); 
    this.getWalletChartData();
    this.getUserCount();
  }

  public getWalletChartData(){
    this.authorizationApiService.getWalletCount().subscribe(
      success=>{
        this.walletGraph=success['data'];
        this.doughnutChartWalletData=[this.walletGraph['inactive'], this.walletGraph['active']];
      }, 
      error=>{

      });
  }

  public getEndDate(currentDate){
    let endDate=new Date(currentDate);
    // endDate.setDate(endDate.getDate()-1);
    let endYear=endDate.getUTCFullYear();
    let endMonth=endDate.getUTCMonth()+1;
    let endDay=endDate.getUTCDate();
    this.searchCriteria['endDate']=endYear+"-"+endMonth+"-"+endDay;
    if(endMonth<10){
      this.searchCriteria['endDate']=endYear+"-0"+endMonth+"-"+endDay;
    }
    if(endDay<10){
      this.searchCriteria['endDate']=endYear+"-"+endMonth+"-0"+endDay;
    }
    if(endMonth<10 && endDay<10){
      this.searchCriteria['endDate']=endYear+"-0"+endMonth+"-0"+endDay;
    }
  }

  onSelect(event) {
  }

  ngOnInit() {
    Object.assign(this, {single, multi});
  }

  public getVerifiedAndUnverifiedUserCountByCountry(searchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getVerifiedAndUnverifiedUserCountByCountry(searchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        let data=success['data'];
        let totalUsers=0;
        let multi=[];
        for(let index in data){
          totalUsers=totalUsers+parseInt(data[index]['kycVerified'])+parseInt(data[index]['kycUnverified']);
          multi.push({
            "name": data[index]['countryName'],
            "series": [
              {
                "name": "KYC Verified",
                "value": parseInt(data[index]['kycVerified'])
              },
              {
                "name": "KYC Unverified",
                "value": parseInt(data[index]['kycUnverified'])
              }
            ]
          });
        }
        let userPercentageCountryWise=[];
        for(let index in data){
          let users= parseInt(data[index]['kycVerified'])+parseInt(data[index]['kycUnverified']);
          userPercentageCountryWise.push({
            "name": data[index]['countryName'],
            "value":(users/totalUsers)*100
          });
        }
        Object.assign(this, {multi, userPercentageCountryWise});
        this.getUserPercentageByCountry(this.searchCriteria, multi, userPercentageCountryWise)
      }, 
      error=>{
        this.errorMessage(error);
      });
  }

  public getUserPercentageByCountry(searchCriteria, multi, userPercentageCountryWise){
    this.blockUserInterface();
    this.authorizationApiService.getUserPercentageByCountry(searchCriteria).subscribe(
      success=>{
        this.unblockUserInterface();
        // this.successMessage(success);
        let data=success['data'];
        let single=[];
        for(let index in data){
          single.push({
            "name": data[index]['countryName'],
            "value": data[index]['percentage']
          });
        }
        Object.assign(this, {single, multi, userPercentageCountryWise}); 
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }

  public getUserCount(){
    this.blockUserInterface();
    this.authorizationApiService.getUserCount().subscribe(
      success=>{
        this.unblockUserInterface();
        // this.successMessage(success);
        this.userChart=success['data'];
        this.userChart['inactiveUsers']=this.userChart['total']-this.userChart['active_user'];
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
}
