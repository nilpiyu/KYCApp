import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  private searchCriteria={"startDate":"2015-01-01", "endDate":"2018-03-19"};
  constructor(private authorizationApiService:AuthorizationApiService, private toastsManager:ToastsManager) {
    let currentDate=new Date();
    this.getEndDate(currentDate);
    this.getUserPercentageByCountry(this.searchCriteria);
  }

  ngOnInit() {
   }

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('pieChart') pieChart;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public pieChartLabels:string[] = ["a", "b", "c", "d", "e", "f"];
  public pieChartData:number[] = [10];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }

  // public getEndDate(currentDate){
  //   let endDate=new Date(currentDate);
  //   let endYear=endDate.getUTCFullYear();
  //   let endMonth=endDate.getUTCMonth()+1;
  //   let endDay=endDate.getUTCDate();
  //   this.searchCriteria['endDate']=endYear+"-"+endMonth+"-"+endDay;
  //   if(endMonth<10){
  //     this.searchCriteria['endDate']=endYear+"-0"+endMonth+"-"+endDay;
  //   }
  //   if(endDay<10){
  //     this.searchCriteria['endDate']=endYear+"-"+endMonth+"-0"+endDay;
  //   }
  //   if(endMonth<10 && endDay<10){
  //     this.searchCriteria['endDate']=endYear+"-0"+endMonth+"-0"+endDay;
  //   }
  // }

  public getEndDate(currentDate){
    let endDate=new Date(currentDate);
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

  public getUserPercentageByCountry(searchCriteria){
    this.blockUserInterface();
    this.authorizationApiService.getUserPercentageByCountry(searchCriteria).subscribe(
      success=>{
        let data=success['data'];
        let pieChartLabels1=[];
        let pieChartData1=[];
        for(let index in data){
            pieChartLabels1.push(data[index]['countryName']);
            pieChartData1.push(data[index]['percentage']+parseInt(index)*10);
        } 

        // this.pieChartLabels=pieChartLabels1;
        // this.pieChartData=pieChartData1;
        // this.pieChart.config.data=pieChartData1;
        this.unblockUserInterface();
      }, 
      error=>{
        this.unblockUserInterface();
        this.errorMessage(error);
      });
  }
  
  /* It blocks UI. */
  public blockUserInterface(){
    this.blockUI.start("Wait...");
  }

  /* It unblocks UI.*/
  public unblockUserInterface(){
    this.blockUI.stop();
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
}
