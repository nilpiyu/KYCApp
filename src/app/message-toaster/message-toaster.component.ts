import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'app-message-toaster',
  templateUrl: './message-toaster.component.html',
  styleUrls: ['./message-toaster.component.css'],
})
export class MessageToasterComponent implements OnInit {

  constructor(private toastsManager:ToastsManager, private viewContainerRef:ViewContainerRef) {
    this.toastsManager.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
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
