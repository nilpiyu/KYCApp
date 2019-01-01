import { Component, OnInit, ViewContainerRef,ViewChild} from '@angular/core';
import { AuthorizationApiService } from './../../services/authorization-api.service'; 
import { MessageToasterComponent } from './../../message-toaster/message-toaster.component'; 
import { ToastsManager } from 'ng2-toastr/src/toast-manager';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTable, DataTableTranslations, DataTableResource } from './../../data-table';

@Component({
  selector: 'app-sub-organization',
  templateUrl: './sub-organization.component.html',
  styleUrls: ['./sub-organization.component.css']
})
export class SubOrganizationComponent implements OnInit {

  private subOrganisationModal:boolean=false;

  constructor() { 
  }

  ngOnInit() {
  }

  public openModal(){
    this.subOrganisationModal=true;
  }

  public closeModal(){
    this.subOrganisationModal=false;
  }

}
