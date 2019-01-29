import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './Auth/login/login.component';
import {SignupComponent} from './Auth/signup/signup.component';
import {HomeComponent} from './Home/home/home.component';
import {MettingComponent} from './meetings/metting/metting.component';
import {FeaturesComponent} from './Home/features/features.component';
import {AccountComponent} from './Account/account/account.component';
import {SettingsComponent} from './intro/settings/settings.component';
import {TeamComponent} from './Home/team/team.component';
import {CalendarEditComponent} from './calendar/calendar-edit/calendar-edit.component';
import {AvailbilityComponent} from './calendar/availbility/availbility.component';
import {DashboardComponent} from './Account/dashboard/dashboard.component';
import {UserRoleComponentComponent} from './user-role-component/user-role-component.component';
import {SchedulingPageComponent} from './meetings/scheduling-page/scheduling-page.component';
import {ScheduleEventComponent} from './meetings/schedule-event/schedule-event.component';
import {ScheduleDateComponent} from './meetings/schedule-date/schedule-date.component';
import {ConfirmedComponent} from './meetings/confirmed/confirmed.component';
import {IntegrationsComponent} from './Integrations/integrations/integrations.component';
import {GoTomeetingIntegrationComponent} from './Integrations/go-tomeeting-integration/go-tomeeting-integration.component';
import {AuthGuard} from './Auth/auth.guard';
import {EventsMainPageComponent} from './Events/events-main-page/events-main-page.component';
import {AccountSettingComponent} from './AccountSetting/account-setting/account-setting.component';
import {MyLinkComponent} from './AccountSetting/my-link/my-link.component';
import {ProfilePictureComponentComponent} from './AccountSetting/profile-picture-component/profile-picture-component.component';



const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'settings', component: AccountSettingComponent},
  {path: 'myLink', component: MyLinkComponent},
  {path: 'picture', component: ProfilePictureComponentComponent},
  /*{path: 'eventMainPage', component: EventsMainPageComponent,canActivate: [AuthGuard]},*/
  {path: 'eventMainPage', component: EventsMainPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'integrations/gotomeeting', component: GoTomeetingIntegrationComponent},
  {path: 'integrations', component: IntegrationsComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup/:email', component: SignupComponent},
  {path: 'meeting', component: MettingComponent},
  {path: 'features', component: FeaturesComponent},
  {path: 'account', component: AccountComponent},
  {path: 'settings/:email', component: SettingsComponent},
  {path: 'team', component: TeamComponent},
  {path: 'calendar/:email', component: CalendarEditComponent},
  {path: 'availability/:email', component: AvailbilityComponent},
  {path: 'userRole/:email', component: UserRoleComponentComponent},
  {path: 'dashboard/:email', component: DashboardComponent},
  /*{path: 'selectTime', component: ScheduleDateComponent},*/
 /* {path: 'schedulingPage', component: ScheduleEventComponent},*/
  {path: 'confirmedMeeting', component: ConfirmedComponent},
  {path: ':userId', component: SchedulingPageComponent},
  {path: ':userId/:selectTime', component: MettingComponent},
  {path: ':userId/:selectTime/:selectDay', component: ScheduleDateComponent},
  {path: ':userId/:selectTime/:selectDay/:schedulingPage', component: ScheduleEventComponent},

];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers : [AuthGuard]
})

export class AppRoutingModule {}

