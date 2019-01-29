import { BrowserModule } from '@angular/platform-browser';
import {
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatNativeDateModule, MatTabsModule
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

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CalendareventComponent } from './calendar-event/calendarevent.component';
import { UserRoleComponentComponent } from './user-role-component/user-role-component.component';
import { SchedulingPageComponent } from './meetings/scheduling-page/scheduling-page.component';
import { ScheduleEventComponent } from './meetings/schedule-event/schedule-event.component';
import { MessagedialogComponent } from './messagedialog/messagedialog.component';
import { ScheduleDateComponent } from './meetings/schedule-date/schedule-date.component';
import { ConfirmedComponent } from './meetings/confirmed/confirmed.component';
import { IntegrationsComponent } from './Integrations/integrations/integrations.component';
import { GoTomeetingIntegrationComponent } from './Integrations/go-tomeeting-integration/go-tomeeting-integration.component';
import {TimezonePickerModule} from 'ng2-timezone-selector';
import { ShareYourLinkComponentComponent } from './share-your-link-component/share-your-link-component.component';
import { EventsMainPageComponent } from './Events/events-main-page/events-main-page.component';
import { AccountSettingComponent } from './AccountSetting/account-setting/account-setting.component';
import { MyLinkComponent } from './AccountSetting/my-link/my-link.component';
import { ProfilePictureComponentComponent } from './AccountSetting/profile-picture-component/profile-picture-component.component';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
     /* {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("Your-Facebook-app-id")
      },*/
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("501215968373-ng1mtd1fm5rcfl07cia5h97ltfherhk4.apps.googleusercontent.com")
      }
     /* {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
      },*/
    ]
);
  return config;
}
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    MettingComponent,
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
    SchedulingPageComponent,
    ScheduleEventComponent,
    MessagedialogComponent,
    ScheduleDateComponent,
    ConfirmedComponent,
    IntegrationsComponent,
    GoTomeetingIntegrationComponent,
    ShareYourLinkComponentComponent,
    EventsMainPageComponent,
    AccountSettingComponent,
    MyLinkComponent,
    ProfilePictureComponentComponent
  ],
  imports: [
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
    MatTabsModule
  ],
  providers: [
      {
        provide: AuthServiceConfig,
        useFactory: getAuthServiceConfigs
      },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [CalendarOptionComponent,CalendareventComponent,MessagedialogComponent, ShareYourLinkComponentComponent]
})

export class AppModule { }
