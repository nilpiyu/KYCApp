import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AuthorizationApiService } from './../../services/authorization-api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  private verifiedAndUnverifiedSearchCriteria={"startYear":"2016", "endYear":"2018"};
  
  constructor(private authorizationApiService:AuthorizationApiService) {
    let currentDate=new Date();
    this.getEndDate(currentDate);
    this.getVerifiedAndUnverifiedUserCountByYear();
  }

  ngOnInit() {
    
  }

  public getEndDate(currentDate){
    let endDate=new Date(currentDate);
    // endDate.setDate(endDate.getDate()-1);
    let endYear=endDate.getUTCFullYear();
    this.verifiedAndUnverifiedSearchCriteria['endYear']=endYear+"";
  }

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
    
  };
  public barChartLabels:string[] = [];//['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  public getVerifiedAndUnverifiedUserCountByYear(){
    this.authorizationApiService.getVerifiedAndUnverifiedUserCountByYear(this.verifiedAndUnverifiedSearchCriteria).subscribe(
      success=>{
        let barChartData=success['data'];
        let verifiedData=[];
        let unverifiedData=[];
        for(let index in barChartData){
          this.barChartLabels.push(barChartData[index]['year']);
          verifiedData.push(barChartData[index]['kycVerified']);
          unverifiedData.push(barChartData[index]['kycUnverified']);
        }
        this.barChartData=[{data:unverifiedData, label: 'KYC Unverified'}, {data:verifiedData, label: 'KYC Verified'}];
      }, 
      error=>{

      });
  }
}
