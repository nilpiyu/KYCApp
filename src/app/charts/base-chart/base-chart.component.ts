import { Component, OnInit } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service'

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.css']
})
export class BaseChartComponent implements OnInit {

  private verifiedAndUnverifiedSearchCriteria={"startDate":"2017-01-01", "endDate":"2018-03-18"};
  
  constructor(private authorizationApiService:AuthorizationApiService) {
    let currentDate=new Date();
    this.getEndDate(currentDate);
    this.getVerifiedAndUnverifiedUserCount();
  }

  ngOnInit() {
  }

  public getEndDate(currentDate){
    let endDate=new Date(currentDate);
    // endDate.setDate(endDate.getDate()-1);
    let endYear=endDate.getUTCFullYear();
    let endMonth=endDate.getUTCMonth()+1;
    let endDay=endDate.getUTCDate();
    this.verifiedAndUnverifiedSearchCriteria['endDate']=endYear+"-"+endMonth+"-"+endDay;
    if(endMonth<10){
      this.verifiedAndUnverifiedSearchCriteria['endDate']=endYear+"-0"+endMonth+"-"+endDay;
    }
    if(endDay<10){
      this.verifiedAndUnverifiedSearchCriteria['endDate']=endYear+"-"+endMonth+"-0"+endDay;
    }
    if(endMonth<10 && endDay<10){
      this.verifiedAndUnverifiedSearchCriteria['endDate']=endYear+"-0"+endMonth+"-0"+endDay;
    }
  }

  public doughnutChartLabels:string[] = ['KYC Unverified', 'KYC Verified'];
  public doughnutChartData:number[] = [120, 110];
  public doughnutChartType:string = 'doughnut';
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }

  public getVerifiedAndUnverifiedUserCount(){
    this.authorizationApiService.getVerifiedAndUnverifiedUserCount(this.verifiedAndUnverifiedSearchCriteria).subscribe(
      success=>{
        let verifiedAndUnverifiedUser=success['data'];
        this.doughnutChartData=[verifiedAndUnverifiedUser['kycUnverified'], verifiedAndUnverifiedUser['kycVerified']];
      }, 
      error=>{
      });
  }
}
