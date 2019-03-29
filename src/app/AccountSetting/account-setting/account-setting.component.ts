import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {MessagedialogComponent} from '../../messagedialog/messagedialog.component';
import {HttpClient} from '@angular/common/http';
import {AccountSettingsService} from './account-settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  validateForm: FormGroup;
  changePasswordForm: FormGroup;
  changeEmailForm: FormGroup;
  myLinkForm: FormGroup;
  profileForm: FormGroup;
  imagePreview: any;
  timeZone;
  upload: boolean = true;
  email;
  loginEmail;
  showConfirmEmail;
  starPass;
  loginPassword;
  private userId;
  imageSource = 'http://html.themedemo.co/awa/img/USER.png';
  private image;
  date_range = false;
  visibleEmail = false;
  changeEmail;
  cnfEmail;
  constructor(private router:Router, private accountService: AccountSettingsService, private fb: FormBuilder, private dialog: MatDialog, private httpClient: HttpClient, private authService: AuthServiceLocal) {
  }

  ngOnInit() {
    this.accountService.confirmEmail.subscribe((check)=>{
      console.log("check=========",check);
      this.showConfirmEmail = check;
    });
    this.changePasswordForm = this.fb.group({
      password: [null, [Validators.required]],
      createPassword: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]]
    });

    this.changeEmailForm = this.fb.group({
      password: [null, [Validators.required]],
      email: [null, [Validators.required]]
    });
    this.userId = this.authService.getUserId();
    this.email = this.authService.getUserEmaild();
    console.log('USERID----------------->>>>>>', this.userId);
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      language: [null, [Validators.required]],
      dateFormat: [null, [Validators.required]],
      timeFormat: [null, [Validators.required]],
      country: [null, [Validators.required]],
      welcome: [null, [Validators.required]]
    });
    this.myLinkForm = new FormGroup({
      userID: new FormControl(null, [Validators.required])
    });
    this.profileForm = new FormGroup({
      'file': new FormControl(null, [Validators.required]),
      'image': new FormControl(null)
    });
    this.myLinkForm.patchValue({
      userID: this.userId
    });
    this.httpClient.post<{ message: string, data: [] }>('http://localhost:3000/userData/userData', {'userId': this.userId}).subscribe(
      res => {
        this.imageSource = res.data['0'].profilePic;
        if (this.imageSource == null) {
          this.imageSource = 'http://html.themedemo.co/awa/img/USER.png';
        }
        console.log('Image Source --->', this.imageSource);
        console.log('res===========', res);
        /* this.validateForm.get('country').patchValue(res.data['0'].country);
         this.validateForm.get('name').patchValue(res.data['0'].fullName);
         this.validateForm.get('welcome').patchValue(res.data['0'].welcomeMessage);
         this.validateForm.get('language').patchValue(res.data['0'].language);
         this.validateForm.get('dateFormat').patchValue(res.data['0'].dateFormat);
         this.validateForm.get('timeFormat').patchValue(res.data['0'].timeFormat);*/
        this.loginEmail = res.data['0'].email;
        this.loginPassword = res.data['0'].password;
        this.starPass = createStars(this.loginPassword.length);
        console.log('Login Email --> ', this.loginEmail);
        console.log('Login Password --> ', this.starPass);
        this.validateForm.patchValue({
          country: res.data['0'].country,
          name: res.data['0'].fullName,
          welcome: res.data['0'].welcomeMessage,
          language: res.data['0'].language,
          dateFormat: res.data['0'].dateFormat,
          timeFormat: res.data['0'].timeFormat,
        });

        this.timeZone = res.data['0'].timeZone;
      }, err => {
        console.log('Error=========', err.message);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = err;
        this.dialog.open(MessagedialogComponent, dialogConfig);
      });

    function createStars(n) {
      let stars = '';
      for (let i = 0; i < n; i++) {
        stars += '*';
      }
      return stars;
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.changePasswordForm.controls.createPassword.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  changeTimezone(timezone) {
    this.timeZone = timezone;
  }

  submitMyLinkForm() {
    let uid = this.myLinkForm.value;
    uid['id'] = this.userId;
    this.accountService.saveMyLink(uid);
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    let uid = this.validateForm.value;
    uid['userId'] = this.userId;
    uid['timeZone'] = this.timeZone;
    this.accountService.SaveProfileData(uid);
  }

  submitMyProfileForm() {
    console.log('Profile form--> ', this.profileForm.value);
    console.log('Image value--> ', this.image);
    let uid = this.profileForm.value;
    uid['id'] = this.userId;
    uid['image'] = this.image;
    const postData = new FormData();
    postData.append('userId', this.userId);
    postData.append('image', this.image);
    this.accountService.saveProfilePic(postData);
    this.upload = true;
  }

  onImagePicked(imageEvent: Event) {
    this.upload = false;
    console.log('Upload-->', this.upload);
    if ((imageEvent.target as HTMLInputElement).files && (imageEvent.target as HTMLInputElement).files[0]) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.imagePreview = (<FileReader>event.target).result;
        this.image = (imageEvent.target as HTMLInputElement).files[0];
      };
      reader.readAsDataURL((imageEvent.target as HTMLInputElement).files[0]);
    }
  }

  onDeleteAccount() {
    this.accountService.deletUserAccount(this.userId);
  }

  handleOk(): void {
    this.date_range = false;

  }

  handleCancel(): void {
    this.date_range = false;
  }

  onDateRange() {
    this.date_range = true;
  }

  handleChangePassword() {
    this.visibleEmail = true;
  }

  handleCancelChangePassword() {
    this.visibleEmail = false;
  }

  handleOkChangePassword() {

  }

/*  handleOkEmailStatus() {
    this.visibleEmail = false;
    this.showConfirmEmail = this.accountService.getEmailStatus();
    console.log('Email stautus--> ',this.showConfirmEmail);
  }*/

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.changePasswordForm.controls.checkPassword.updateValueAndValidity());
  }

  submitForm1(): void {
    for (const i in this.changePasswordForm.controls) {
      this.changePasswordForm.controls[i].markAsDirty();
      this.changePasswordForm.controls[i].updateValueAndValidity();
    }
    console.log('Password--> ', this.changePasswordForm.value);
    let changePassword = this.changePasswordForm.value;
    changePassword['userId'] = this.userId;
    this.accountService.updateAccountPassword(changePassword);
  }

  submitFormChangeEmail() {
    this.visibleEmail = false;
    for (const i in this.changeEmailForm.controls) {
      this.changeEmailForm.controls[i].markAsDirty();
      console.log('Change Login --> ', this.changeEmailForm.value);
     this.changeEmail = this.changeEmailForm.value;
     this.changeEmail['userId'] = this.userId;
     this.cnfEmail = this.changeEmailForm.value.email;
    }
    this.accountService.sendAccountEmail(this.changeEmail);

  }
  handleConfirmOk(){
    this.showConfirmEmail = false;
  }
}
