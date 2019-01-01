import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './../services/local-storage.service';
import { SignOutComponent } from './../authentication/sign-out/sign-out.component';
import { AuthenticationApiService } from './../services/authentication-api.service';
import {AuthorizationApiService} from './../services/authorization-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[SignOutComponent]
})
export class HeaderComponent implements OnInit {

  private menus;
  private userName;
  private profileImagePath:string;
  private notifications=[];
  private notificationLimit={limit:10};
  private notification={};
  private notificationId;
  private totalNoOfNotification={pageNo:0, pageSize:0, count:-1};
  constructor(private localStorageService:LocalStorageService, private signOutComponent:SignOutComponent, private authenticationApiService:AuthenticationApiService, private authorizationApiService:AuthorizationApiService) { 
    this.getUserProfile();
    this.authorizationApiService.profileImage.subscribe(profileImage=>{
      this.profileImagePath=profileImage;
    });
  }

  ngOnInit() {
    this.menus=JSON.parse(this.localStorageService.getUserMenus());
    for(let index in this.menus){
    }
    this.getUserNotification();
  }

  public getUserProfile(){
    this.userName=this.localStorageService.getUserName();
    this.profileImagePath=this.localStorageService.getUserProfileImage();
  }

  public userSignOut(){
    this.signOutComponent.userSignOut();;
  }

  public getUserNotification(){
    this.authorizationApiService.getUserNotification(this.totalNoOfNotification).subscribe(
      success=>{
        this.notifications=success['data']['notifications'];
        // if(!this.notifications.length){
        //   this.notifications=[];
        //   this.notifications[this.notifications.length]={"message":"No Notification Exists."}
        // }
        // for(let notificationsIndex in this.notifications ){
        //   this.notifications[notificationsIndex]['notifications']['message'] = this.notifications[notificationsIndex]['notifications']['message']
        // }
      }, 
      error=>{
      });
  }

  // public saveAndUpdateNotification(){
  //   if(!this.notification['notificationId']){
  //   } else if(this.notification['notificationId']){
  //     this.updateUserNotification();
  //   }
  // }

  public editUserNotification(updateNotification){
    this.authorizationApiService.updateUserNotification(updateNotification).subscribe(
      success=>{
        this.getUserNotification();
      },
      error=>{
      }
    )
  }

  private readNotificationIdByIndex(notification){
    // this.notificationId = this.notifications[notificationIndex]['notificationId'];
    let readMarkNotification = {'isRead':true, 'notificationId':notification['notificationId']}
    this.editUserNotification(readMarkNotification);
  }

}
