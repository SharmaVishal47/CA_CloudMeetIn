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
import {AvailableDateTimeComponent} from './available-date-time/available-date-time.component';
import {NewEventComponent} from './Events/new-event/new-event.component';
import {CreateEventComponent} from './Events/create-event/create-event.component';
import {NewEventTeamComponent} from './Events/new-event-team/new-event-team.component';
import {HelpComponent} from './Help/help/help.component';
import {CalendarConnectionComponent} from './calendar/calendar-connection/calendar-connection.component';
import {ChangeCalendarComponent} from './calendar/change-calendar/change-calendar.component';

import {MainHeaderComponent} from './main-header/main-header.component';
import {ZoomIntegrationComponent} from './Integrations/zoom-integration/zoom-integration.component';
import {GTMIntegrationCodeComponent} from './Integrations/gtm-integration-code/gtm-integration-code.component';
import {ChangePasswordComponent} from './Auth/password/change-password/change-password.component';
import {ForgetPasswordComponent} from './Auth/password/forget-password/forget-password.component';
import {TryAgainForgetPasswordComponent} from './Auth/password/try-again-forget-password/try-again-forget-password.component';
import {ChangeLoginEmailComponent} from './AccountSetting/change-login-email/change-login-email.component';
import {RescheduleMeetingComponent} from './meetings/reschedule-meeting/reschedule-meeting.component';
import {CancelEventComponent} from './meetings/cancel-event/cancel-event.component';
import {ErrorComponent} from './error/error.component';
import {CalenderoptionByEmailComponent} from './Auth/calenderoption-by-email/calenderoption-by-email.component';
import {ConfirmEmailComponent} from './Auth/confirm-email/confirm-email.component';
import {SignUpByEmailComponent} from './Auth/sign-up-by-email/sign-up-by-email.component';
import {CalenderoptionComponent} from './Auth/calenderoption/calenderoption.component';
import {AdminLoginComponent} from './Admin/admin-login/admin-login.component';
import {AdminDashboardComponent} from './Admin/admin-dashboard/admin-dashboard.component';
import {AdminGuard} from './Admin/admin.guard';
import {TermConditionsComponent} from './Home/term-conditions/term-conditions.component';

const appRoutes: Routes = [
  /* Main Components*/
  {path: '', component: HomeComponent},
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: 'terms-conditions', component: TermConditionsComponent},
  {path: 'changePassword/:data', component: ChangePasswordComponent},
  {path: 'calenderOption/:data', component: CalenderoptionByEmailComponent},
  {path: 'verify/:email', component: ConfirmEmailComponent},
  {path: 'signUpByEmail', component: SignUpByEmailComponent},
  /* {path: 'dashboard/:email', component: DashboardComponent,canActivate: [AuthGuard]},*/
  {path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]},

  /*Calender option select page*/
  {path: 'calender/option', component: CalenderoptionComponent},

  {path: 'pofilesettings', component: AccountSettingComponent,canActivate: [AuthGuard]},
  {path: 'availableTime', component: AvailableDateTimeComponent,canActivate: [AuthGuard]},
  // {path: 'integrations/gotomeeting', component: GoTomeetingIntegrationComponent,canActivate: [AuthGuard]},
  {path: 'integrations', component: IntegrationsComponent,canActivate: [AuthGuard]},
  {path: 'integrations/gotomeeting/code', component: GTMIntegrationCodeComponent},
  {path: 'integrations/gotomeeting', component: GoTomeetingIntegrationComponent,canActivate: [AuthGuard]},
  {path: 'integrations/zoommeeting', component: ZoomIntegrationComponent},
  {path: 'eventTeam', component: NewEventTeamComponent},
  {path: 'help', component: HelpComponent, canActivate: [AuthGuard]},
  {path: 'connection', component: CalendarConnectionComponent, canActivate: [AuthGuard]},
  {path: 'changeCalendar', component: ChangeCalendarComponent, canActivate: [AuthGuard]},
  /*Event Function*/
  {path: 'eventMainPage', component: EventsMainPageComponent,canActivate: [AuthGuard]},
  {path: 'newEvent', component: NewEventComponent},
  {path: 'newEvent/create', component: CreateEventComponent,canActivate: [AuthGuard]},
  /* {path: 'newEvent/create', component: CreateEventComponent},*/
  /* {path: 'login', component: LoginComponent},*/
  {path: 'login', component: SignupComponent},
  {path: 'mainheader', component: MainHeaderComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  {path: 'tryAgain/:email', component: TryAgainForgetPasswordComponent},
  {path: 'changeEmail/:data',component: ChangeLoginEmailComponent},
  /* Sign Up settings components routing */
  {path: 'signup', component: SignupComponent},
  /*{path: 'signup/:email', component: SignupComponent},*/
  {path: 'settings', component: SettingsComponent},
  {path: 'calendar', component: CalendarEditComponent},
  {path: 'availability', component: AvailbilityComponent},
  {path: 'userRole', component: UserRoleComponentComponent},
  /* End Sign Up settings components routing */


  /*Meeting Reschedule*/
  {path: 'reschedule/:id', component: RescheduleMeetingComponent},

  {path: 'meeting', component: MettingComponent},
  {path: 'cancellations/:id', component: CancelEventComponent},
  {path: 'features', component: FeaturesComponent},
  {path: 'account', component: AccountComponent},
  {path: 'team', component: TeamComponent},
  {path: 'error', component: ErrorComponent},

  {path: 'confirmedMeeting', component: ConfirmedComponent},
  {path: ':userId/:selectTime/:schedulingPage', component: ScheduleEventComponent},
  {path: ':userId/:selectTime', component: MettingComponent},
  {path: ':userId', component: SchedulingPageComponent},

  /*  {path: ':userId/:selectTime/:selectDay', component: ScheduleDateComponent},*/

];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers : [AuthGuard, AdminGuard]
})

export class AppRoutingModule {}
