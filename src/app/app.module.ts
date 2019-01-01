import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule} from '@swimlane/ngx-charts';
import { AppComponent } from './app.component';
import { AngularMultiSelectModule} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { HeaderComponent } from './header/header.component';
import { ActivitiesComponent } from './authorisation/activities/activities.component';
import { AuthorisedocumentComponent } from './authorisation/authorisedocument/authorisedocument.component';
import { ChangepasswordComponent } from './authentication/changepassword/changepassword.component';
import { AdminDashboardComponent } from './authorisation/admin-dashboard/admin-dashboard.component';
import { DialogComponent } from './dialogs/dialog/dialog.component';
import { FooterComponent } from './footer/footer.component';
import { KycdocumentmetaComponent } from './authorisation/kycdocumentmeta/kycdocumentmeta.component';
import { KycdocumenttypeComponent } from './authorisation/kycdocumenttype/kycdocumenttype.component';
import { KycformfieldComponent } from './authorisation/kycformfield/kycformfield.component';
import { KycformfieldmetaComponent } from './authorisation/kycformfieldmeta/kycformfieldmeta.component';
import { KycuserdocumentComponent } from './authorisation/kycuserdocument/kycuserdocument.component';
import { ProfileComponent } from './authorisation/profile/profile.component';
import { RoleComponent } from './authorisation/role/role.component';
import { UserdocumentComponent } from './authorisation/userdocument/userdocument.component';
import { UsersComponent } from './authorisation/users/users.component';
import { VerificationagenciesComponent } from './authorisation/verificationagencies/verificationagencies.component';
import { VerificationrequestComponent } from './authorisation/verificationrequest/verificationrequest.component';
import { ViewdocumentComponent } from './authorisation/viewdocument/viewdocument.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { BaseChartComponent } from './charts/base-chart/base-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './authorisation/home/home.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ThankyouForRegistrationComponent } from './authentication/thankyou-for-registration/thankyou-for-registration.component';
import { ConfirmationOfEmailComponent } from './authentication/confirmation-of-email/confirmation-of-email.component';
import { UserDashboardComponent } from './authorisation/user-dashboard/user-dashboard.component';
import { ApplicationsComponent } from './authorisation/blockchain/applications/applications.component';
import { SidechainComponent } from './authorisation/blockchain/sidechain/sidechain.component';
import { ForgingComponent } from './authorisation/blockchain/forging/forging.component';
import { DelegatesComponent } from './authorisation/blockchain/delegates/delegates.component';
import { MyvotesComponent } from './authorisation/blockchain/myvotes/myvotes.component';
import { AuthenticationApiService } from './services/authentication-api.service';
import { AuthorizationApiService } from './services/authorization-api.service';
import { LocalStorageService } from './services/local-storage.service';
import { RequestOptionsService } from './services/request-options.service';
import { SessionExpireService } from './services/session-expire.service';
import { MerchantDashboardComponent } from './authorisation/merchant-dashboard/merchant-dashboard.component';
import { RequestedDocumentComponent } from './authorisation/requested-document/requested-document.component';
import { SignOutComponent } from './authentication/sign-out/sign-out.component';
import { ForgetPasswordComponent } from './authentication/forget-password/forget-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { MessageToasterComponent } from './message-toaster/message-toaster.component';
import { ConfirmationOfResetComponent } from './authentication/confirmation-of-reset/confirmation-of-reset.component';
import { BlockUIModule } from 'ng-block-ui';
import { KycDocGroupComponent } from './authorisation/kyc-doc-group/kyc-doc-group.component';
import { KycDocGroupMappingComponent } from './authorisation/kyc-doc-group-mapping/kyc-doc-group-mapping.component';
import { BlocksComponent } from './authorisation/blockchain/blocks/blocks.component';
import { SocialNetworkingServicesComponent } from './authorisation/social-networking-services/social-networking-services.component';
import { Ng2DataTableModule } from './data-table';
import { CaptchaModule } from 'primeng/captcha';
import { DataTableModule } from 'primeng/primeng';
import { QRCodeModule } from 'angular2-qrcode';
import { TokenValidationComponent } from './authentication/token-validation/token-validation.component';
import { BKVSVerificationComponent } from './bkvs-verification/bkvs-verification.component';
import { BKVSVerificationLoginComponent } from './bkvs-verification/bkvs-verification-login/bkvs-verification-login.component';
import { BKVSVerificationRegisterComponent } from './bkvs-verification/bkvs-verification-register/bkvs-verification-register.component';
import { BKVSVerificationGrantAccessComponent } from './bkvs-verification/bkvs-verification-grantaccess/bkvs-verification-grantaccess.component';
import { BKVSVerificationErrorComponent } from './bkvs-verification/bkvs-verification-error/bkvs-verification-error.component';
import { BkvsVerificationHeaderComponent } from './bkvs-verification/bkvs-verification-header/bkvs-verification-header.component';
import { ClipboardModule } from 'ng2-clipboard';
import { TransactionsComponent } from './authorisation/blockchain/transactions/transactions.component';
import { WhiteLabelWalletComponent } from './authorisation/white-label-wallet/white-label-wallet.component';
import { UserWalletComponent } from './authorisation/blockchain/user-wallet/user-wallet.component';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityComponent } from './authorisation/security/security.component';
import { SubOrganizationComponent } from './authorisation/sub-organization/sub-organization.component';
import { AuthorisedPersonnelComponent } from './authorisation/authorised-personnel/authorised-personnel.component';
import { VerificationDocumentMappingComponent } from './authorisation/verification-document-mapping/verification-document-mapping.component';
import { VerificationRelationshipMappingComponent } from './authorisation/verification-relationship-mapping/verification-relationship-mapping.component';
import { UserKycComponent } from './authorisation/user-kyc/user-kyc.component';
import { AssetDialogComponent } from './dialogs/assetdialog/assetdialog.component'; // added by priyanka for belbook 
import { NumberToWordsPipe } from './number-to-words.pipe'; // added by priyanka for belbook 
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ActivitiesComponent,
    AuthorisedocumentComponent,
    ChangepasswordComponent,
    AdminDashboardComponent,
    DialogComponent,
    FooterComponent,
    KycdocumentmetaComponent,
    KycdocumenttypeComponent,
    KycformfieldComponent,
    KycformfieldmetaComponent,
    KycuserdocumentComponent,
    ProfileComponent,
    RoleComponent,
    UserdocumentComponent,
    UsersComponent,
    VerificationagenciesComponent,
    VerificationrequestComponent,
    ViewdocumentComponent,
    BarChartComponent,
    BaseChartComponent,
    PieChartComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ThankyouForRegistrationComponent,
    ConfirmationOfEmailComponent,
    UserDashboardComponent,
    ApplicationsComponent,
    SidechainComponent,
    ForgingComponent,
    DelegatesComponent,
    MyvotesComponent,
    MerchantDashboardComponent,
    RequestedDocumentComponent,
    SignOutComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    MessageToasterComponent,
    ConfirmationOfResetComponent,
    KycDocGroupComponent,
    KycDocGroupMappingComponent,
    BlocksComponent,
    SocialNetworkingServicesComponent,
    TokenValidationComponent,
    BKVSVerificationComponent,
    BKVSVerificationLoginComponent,
    BKVSVerificationRegisterComponent,
    BKVSVerificationGrantAccessComponent,
    BKVSVerificationErrorComponent,
    BkvsVerificationHeaderComponent,
    TransactionsComponent,
    WhiteLabelWalletComponent,
    UserWalletComponent,
    SecurityComponent,
    SubOrganizationComponent,
    AuthorisedPersonnelComponent,
    VerificationDocumentMappingComponent,
    VerificationRelationshipMappingComponent,
    UserKycComponent,
    AssetDialogComponent ,// added by priyanka for belbook
    NumberToWordsPipe // added by priyanka for belbook
],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule, 
    AngularMultiSelectModule, 
    BrowserAnimationsModule, 
    FormsModule, 
    NgxChartsModule, 
    BlockUIModule, 
    ToastModule.forRoot(),
    Ng2DataTableModule,
    CaptchaModule,
    QRCodeModule,
    DataTableModule,
    ClipboardModule,
    PasswordStrengthBarModule,
    RouterModule.forRoot([
      { 
        path: '', 
        children: [
          {path: '', redirectTo: '/login', pathMatch: 'full' },      
          {path: 'admin-dashboard', component: AdminDashboardComponent },
          {path: 'userdocumentrequest', component: UserdocumentComponent},
          {path: 'viewdocument', component: ViewdocumentComponent},
          {path: 'authorisedocument', component: AuthorisedocumentComponent},
          {path: 'verificationagencies', component: VerificationagenciesComponent},
          {path: 'verificationrequest', component: VerificationrequestComponent},
          {path: 'kycdocumenttype', component: KycdocumenttypeComponent},
          {path: 'kycuserdocument', component: KycuserdocumentComponent},
          {path: 'kycdocumentmeta', component: KycdocumentmetaComponent},
          {path: 'kycformfield', component: KycformfieldComponent},
          {path: 'kycformfieldmeta', component: KycformfieldmetaComponent},
          {path: 'role', component: RoleComponent},
          {path: 'users', component: UsersComponent},
          {path: 'activities', component: ActivitiesComponent},
          {path: 'profile', component: ProfileComponent},
          {path: 'dashboard', component: UserDashboardComponent},
          {path: 'applications', component: ApplicationsComponent},
          {path: 'sidechain', component: SidechainComponent},
          {path: 'forging', component: ForgingComponent},
          {path: 'delegates', component: DelegatesComponent},
          {path: 'myvotes', component: MyvotesComponent},
          {path: 'merchant-dashboard', component: MerchantDashboardComponent },
          {path: 'requesteddocument', component: RequestedDocumentComponent },
          {path: 'documentgroup', component: KycDocGroupComponent },
          {path: 'documentgroupmapping', component: KycDocGroupMappingComponent },
          {path: 'blocks', component: BlocksComponent },
          {path: 'socialnetworkingservices', component: SocialNetworkingServicesComponent },
          {path: 'transactions', component: TransactionsComponent },
          {path: 'white-label-wallet', component: WhiteLabelWalletComponent },
          {path: 'user-wallet', component: UserWalletComponent },
          {path: 'security', component: SecurityComponent},
          {path: 'sub-organisation', component:SubOrganizationComponent},
          {path: 'authorised-personnel', component:AuthorisedPersonnelComponent},
          {path: 'verification-document-mapping', component:VerificationDocumentMappingComponent},
          {path: 'verifier-relationship-mapping', component:VerificationRelationshipMappingComponent},
          {path: 'user-kyc', component:UserKycComponent},
         ],
        component: HomeComponent
      },
      {path: 'changepassword', component: ChangepasswordComponent },
      { path: 'login', component: LoginComponent },
      { path: 'sign-out', component: SignOutComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'registration-welcome', component: ThankyouForRegistrationComponent },
      { path: 'emailverify', component: ConfirmationOfEmailComponent },
      { path: 'forgot', component: ResetPasswordComponent },
      { path: 'confirmation-of-reset', component: ConfirmationOfResetComponent },
      { path: 'token-validation', component: TokenValidationComponent },
      { path: 'bkvs-verification',component : BKVSVerificationComponent},
      { path: 'bkvs-verification-login',component : BKVSVerificationLoginComponent},
      { path: 'bkvs-verification-register',component : BKVSVerificationRegisterComponent},
      { path: 'bkvs-verification-grantaccess',component : BKVSVerificationGrantAccessComponent},
      { path: 'bkvs-verification-error',component : BKVSVerificationErrorComponent}
    ], { useHash: true}),
  ],
  providers: [
                { 
                  provide: HTTP_INTERCEPTORS, 
                  useClass: SessionExpireService,
                  multi:true 
                },
                AuthenticationApiService, 
                AuthorizationApiService,
                LocalStorageService, 
                RequestOptionsService
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }

