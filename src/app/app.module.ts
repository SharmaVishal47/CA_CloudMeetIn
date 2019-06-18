import { BrowserModule } from '@angular/platform-browser';
import {
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule, MatGridListModule,
  MatIconModule,
  MatMenuModule,
  MatNativeDateModule, MatOptionModule, MatRadioModule, MatSelectModule, MatTabsModule
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material'
import { AppComponent } from './app.component';
import { HeaderComponent } from './Home/header/header.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import {MatButtonModule, MatCardModule, MatToolbarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './Home/home/home.component';
import {
  AuthServiceConfig,
  GoogleLoginProvider,
  SocialLoginModule
} from 'angular-6-social-login';
import {NgModule} from '@angular/core';
import { MettingComponent } from './meetings/metting/metting.component';
import { FeaturesComponent } from './Home/features/features.component';
import { AccountComponent } from './Account/account/account.component';
import { SettingsComponent } from './intro/settings/settings.component';
import { TeamComponent } from './Home/team/team.component';
import { CalendarEditComponent } from './calendar/calendar-edit/calendar-edit.component';
import { AvailbilityComponent } from './calendar/availbility/availbility.component';
import { DashboardComponent } from './Account/dashboard/dashboard.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { CalendarOptionComponent } from './calendar-option/calendar-option.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { CalendareventComponent } from './calendar-event/calendarevent.component';
import { UserRoleComponentComponent } from './user-role-component/user-role-component.component';
import { SchedulingPageComponent } from './meetings/main-meeting/scheduling-page/scheduling-page.component';
import { ScheduleEventComponent } from './meetings/main-meeting/schedule-event/schedule-event.component';
import { MessagedialogComponent } from './messagedialog/messagedialog.component';
import { ScheduleDateComponent } from './meetings/schedule-date/schedule-date.component';
import { ConfirmedComponent } from './meetings/confirmed/confirmed.component';
import { IntegrationsComponent } from './Integrations/integrations/integrations.component';
import { GoTomeetingIntegrationComponent } from './Integrations/go-tomeeting-integration/go-tomeeting-integration.component';
import {TimezonePickerModule} from 'ng2-timezone-selector';
import { ShareYourLinkComponentComponent } from './share-your-link-component/share-your-link-component.component';
import { EventsMainPageComponent } from './Events/events-main-page/events-main-page.component';
import { AccountSettingComponent } from './AccountSetting/account-setting/account-setting.component';
import {DatePipe} from '@angular/common';
import { AvailableDateTimeComponent } from './available-date-time/available-date-time.component';
import { NewEventComponent } from './Events/new-event/new-event.component';
import { MbscModule } from '../lib/mobiscroll/js/mobiscroll.angular.min.js';
import { CreateEventComponent } from './Events/create-event/create-event.component';
import { NewEventTeamComponent } from './Events/new-event-team/new-event-team.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { QuillEditorModule } from 'ngx-quill-editor';
import {
  en_US,
  NgZorroAntdModule,
  NZ_I18N,
  NzCardModule,
  NzDatePickerModule,
  NzSliderModule,
  NzToolTipComponent,
  NzToolTipModule
} from 'ng-zorro-antd';
import { HelpComponent } from './Help/help/help.component';
import { DialogcancelmessageComponent } from './Account/dialogcancelmessage/dialogcancelmessage.component';
import { CalendarConnectionComponent } from './calendar/calendar-connection/calendar-connection.component';
import { ChangeCalendarComponent } from './calendar/change-calendar/change-calendar.component';
import { IconModule } from '@ant-design/icons-angular';
import { ForgetPasswordComponent } from './Auth/password/forget-password/forget-password.component';
import { TryAgainForgetPasswordComponent } from './Auth/password/try-again-forget-password/try-again-forget-password.component';
import { ChangePasswordComponent } from './Auth/password/change-password/change-password.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ZoomIntegrationComponent } from './Integrations/zoom-integration/zoom-integration.component';
import { GTMIntegrationCodeComponent } from './Integrations/gtm-integration-code/gtm-integration-code.component';

import { ChangeLoginEmailComponent } from './AccountSetting/change-login-email/change-login-email.component';
import { CancelEventComponent } from './meetings/cancel-event/cancel-event.component';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {NgxUiLoaderDemoService} from './meetings/ngx-ui-loader-demo.service';

import { RescheduleMeetingComponent } from './meetings/reschedule-meeting/reschedule-meeting.component';
import { RescheduleEventComponent } from './meetings/reschedule-event/reschedule-event.component';
import {ClipboardModule} from 'ngx-clipboard';
import { ErrorComponent } from './error/error.component';
import {DialogChangeAccountPasswordComponent} from './AccountSetting/dialog-change-account-password/dialog-change-account-password.component';
import { FooterComponent } from './Home/footer/footer.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import { SignUpByEmailComponent } from './Auth/sign-up-by-email/sign-up-by-email.component';
import { CalenderoptionByEmailComponent } from './Auth/calenderoption-by-email/calenderoption-by-email.component';
import { ConfirmEmailComponent } from './Auth/confirm-email/confirm-email.component';
import { CalenderoptionComponent } from './Auth/calenderoption/calenderoption.component';
import {AdminLoginComponent, FormatTimePipe} from './Admin/admin-login/admin-login.component';
import {NgxCaptchaModule} from 'ngx-captcha';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { TermConditionsComponent } from './Home/term-conditions/term-conditions.component';
import { ValidInputDirective } from './Directive/valid-input.directive';
import {AuthInterceptor} from './Admin/auth.interceptor';


export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("812688497337-bnvqsplr9iv5ki7s733gde19bhnar61p.apps.googleusercontent.com") /*For Dev*/
        /*provider: new GoogleLoginProvider("430164070437-mha3f9ivplko6ue547ihmbvag4fksvcf.apps.googleusercontent.com")*/ /*For CloudMeetin*/
      }
    ]
);
  return config;
}
// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
   /* MettingComponent,*/
    FeaturesComponent,
    AccountComponent,
    SettingsComponent,
    TeamComponent,
    CalendarEditComponent,
    AvailbilityComponent,
    DashboardComponent,
    CalendarOptionComponent,
    CalendareventComponent,
    UserRoleComponentComponent,
    /*SchedulingPageComponent,
    ScheduleEventComponent,*/
    MessagedialogComponent,
    ScheduleDateComponent,
   /* ConfirmedComponent,*/
    IntegrationsComponent,
    GoTomeetingIntegrationComponent,
    ShareYourLinkComponentComponent,
    EventsMainPageComponent,
    AccountSettingComponent,
    AvailableDateTimeComponent,
    NewEventComponent,
    CreateEventComponent,
    NewEventTeamComponent,
    HelpComponent,
    DialogcancelmessageComponent,
    CalendarConnectionComponent,
    ChangeCalendarComponent,
    ForgetPasswordComponent,
    TryAgainForgetPasswordComponent,
    ChangePasswordComponent,
    MainHeaderComponent,
    ZoomIntegrationComponent,
    GTMIntegrationCodeComponent,
    ChangeLoginEmailComponent,
    /*CancelEventComponent,
    RescheduleMeetingComponent,*/
    RescheduleEventComponent,
    ErrorComponent,
    DialogChangeAccountPasswordComponent,
    FooterComponent,
    SignUpByEmailComponent,
    CalenderoptionByEmailComponent,
    ConfirmEmailComponent,
    CalenderoptionComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    TermConditionsComponent,
    ValidInputDirective,
    FormatTimePipe

  ],
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SocialLoginModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TimezonePickerModule,
    MatTabsModule,
    MbscModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    ColorPickerModule,
    NgZorroAntdModule,
   /* NzDatePickerModule,*/
    IconModule,
    ClipboardModule,
    NgxUiLoaderModule,
    QuillEditorModule,
    ImageCropperModule,
    NgxCaptchaModule

  ],
  providers: [
      {
        provide: AuthServiceConfig,
        useFactory: getAuthServiceConfigs
      },
    { provide: NZ_I18N, useValue: en_US },
    MatDatepickerModule,
    DatePipe,
    NgxUiLoaderDemoService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
    entryComponents: [
      CalendarOptionComponent,
      CalendareventComponent,
      MessagedialogComponent,
      ShareYourLinkComponentComponent,
      DialogcancelmessageComponent
    ]
})

export class AppModule { }
