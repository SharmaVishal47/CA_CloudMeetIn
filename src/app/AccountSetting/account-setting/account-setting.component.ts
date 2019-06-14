import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceLocal} from '../../Auth/auth.service';
import {MatDialog} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {AccountSettingsService} from './account-settings.service';
import {Router} from '@angular/router';
import {MessageServiceService} from '../../Auth/message-service.service';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {IntegrationService} from '../../Integrations/integration.service';
import {MeetingService} from '../../meetings/meeting.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  public editor;
  public editorContent = `<h3>I am Example content</h3>`;
  public editorOptions = {
    placeholder: "insert content..."
  };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  height;
  width;
  viewCroper:boolean;
  meetingPlatformResponse = [];
  spinLoading: boolean = true;
  counntryList = [
    {"name": "Afghanistan", "code": "AF"},
    {"name": "land Islands", "code": "AX"},
    {"name": "Albania", "code": "AL"},
    {"name": "Algeria", "code": "DZ"},
    {"name": "American Samoa", "code": "AS"},
    {"name": "AndorrA", "code": "AD"},
    {"name": "Angola", "code": "AO"},
    {"name": "Anguilla", "code": "AI"},
    {"name": "Antarctica", "code": "AQ"},
    {"name": "Antigua and Barbuda", "code": "AG"},
    {"name": "Argentina", "code": "AR"},
    {"name": "Armenia", "code": "AM"},
    {"name": "Aruba", "code": "AW"},
    {"name": "Australia", "code": "AU"},
    {"name": "Austria", "code": "AT"},
    {"name": "Azerbaijan", "code": "AZ"},
    {"name": "Bahamas", "code": "BS"},
    {"name": "Bahrain", "code": "BH"},
    {"name": "Bangladesh", "code": "BD"},
    {"name": "Barbados", "code": "BB"},
    {"name": "Belarus", "code": "BY"},
    {"name": "Belgium", "code": "BE"},
    {"name": "Belize", "code": "BZ"},
    {"name": "Benin", "code": "BJ"},
    {"name": "Bermuda", "code": "BM"},
    {"name": "Bhutan", "code": "BT"},
    {"name": "Bolivia", "code": "BO"},
    {"name": "Bosnia and Herzegovina", "code": "BA"},
    {"name": "Botswana", "code": "BW"},
    {"name": "Bouvet Island", "code": "BV"},
    {"name": "Brazil", "code": "BR"},
    {"name": "British Indian Ocean Territory", "code": "IO"},
    {"name": "Brunei Darussalam", "code": "BN"},
    {"name": "Bulgaria", "code": "BG"},
    {"name": "Burkina Faso", "code": "BF"},
    {"name": "Burundi", "code": "BI"},
    {"name": "Cambodia", "code": "KH"},
    {"name": "Cameroon", "code": "CM"},
    {"name": "Canada", "code": "CA"},
    {"name": "Cape Verde", "code": "CV"},
    {"name": "Cayman Islands", "code": "KY"},
    {"name": "Central African Republic", "code": "CF"},
    {"name": "Chad", "code": "TD"},
    {"name": "Chile", "code": "CL"},
    {"name": "China", "code": "CN"},
    {"name": "Christmas Island", "code": "CX"},
    {"name": "Cocos (Keeling) Islands", "code": "CC"},
    {"name": "Colombia", "code": "CO"},
    {"name": "Comoros", "code": "KM"},
    {"name": "Congo", "code": "CG"},
    {"name": "Congo, The Democratic Republic of the", "code": "CD"},
    {"name": "Cook Islands", "code": "CK"},
    {"name": "Costa Rica", "code": "CR"},
    {"name": "Cote D\"Ivoire", "code": "CI"},
    {"name": "Croatia", "code": "HR"},
    {"name": "Cuba", "code": "CU"},
    {"name": "Cyprus", "code": "CY"},
    {"name": "Czech Republic", "code": "CZ"},
    {"name": "Denmark", "code": "DK"},
    {"name": "Djibouti", "code": "DJ"},
    {"name": "Dominica", "code": "DM"},
    {"name": "Dominican Republic", "code": "DO"},
    {"name": "Ecuador", "code": "EC"},
    {"name": "Egypt", "code": "EG"},
    {"name": "El Salvador", "code": "SV"},
    {"name": "Equatorial Guinea", "code": "GQ"},
    {"name": "Eritrea", "code": "ER"},
    {"name": "Estonia", "code": "EE"},
    {"name": "Ethiopia", "code": "ET"},
    {"name": "Falkland Islands (Malvinas)", "code": "FK"},
    {"name": "Faroe Islands", "code": "FO"},
    {"name": "Fiji", "code": "FJ"},
    {"name": "Finland", "code": "FI"},
    {"name": "France", "code": "FR"},
    {"name": "French Guiana", "code": "GF"},
    {"name": "French Polynesia", "code": "PF"},
    {"name": "French Southern Territories", "code": "TF"},
    {"name": "Gabon", "code": "GA"},
    {"name": "Gambia", "code": "GM"},
    {"name": "Georgia", "code": "GE"},
    {"name": "Germany", "code": "DE"},
    {"name": "Ghana", "code": "GH"},
    {"name": "Gibraltar", "code": "GI"},
    {"name": "Greece", "code": "GR"},
    {"name": "Greenland", "code": "GL"},
    {"name": "Grenada", "code": "GD"},
    {"name": "Guadeloupe", "code": "GP"},
    {"name": "Guam", "code": "GU"},
    {"name": "Guatemala", "code": "GT"},
    {"name": "Guernsey", "code": "GG"},
    {"name": "Guinea", "code": "GN"},
    {"name": "Guinea-Bissau", "code": "GW"},
    {"name": "Guyana", "code": "GY"},
    {"name": "Haiti", "code": "HT"},
    {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
    {"name": "Holy See (Vatican City State)", "code": "VA"},
    {"name": "Honduras", "code": "HN"},
    {"name": "Hong Kong", "code": "HK"},
    {"name": "Hungary", "code": "HU"},
    {"name": "Iceland", "code": "IS"},
    {"name": "India", "code": "IN"},
    {"name": "Indonesia", "code": "ID"},
    {"name": "Iran, Islamic Republic Of", "code": "IR"},
    {"name": "Iraq", "code": "IQ"},
    {"name": "Ireland", "code": "IE"},
    {"name": "Isle of Man", "code": "IM"},
    {"name": "Israel", "code": "IL"},
    {"name": "Italy", "code": "IT"},
    {"name": "Jamaica", "code": "JM"},
    {"name": "Japan", "code": "JP"},
    {"name": "Jersey", "code": "JE"},
    {"name": "Jordan", "code": "JO"},
    {"name": "Kazakhstan", "code": "KZ"},
    {"name": "Kenya", "code": "KE"},
    {"name": "Kiribati", "code": "KI"},
    {"name": "Korea, Democratic People\"S Republic of", "code": "KP"},
    {"name": "Korea, Republic of", "code": "KR"},
    {"name": "Kuwait", "code": "KW"},
    {"name": "Kyrgyzstan", "code": "KG"},
    {"name": "Lao People\"S Democratic Republic", "code": "LA"},
    {"name": "Latvia", "code": "LV"},
    {"name": "Lebanon", "code": "LB"},
    {"name": "Lesotho", "code": "LS"},
    {"name": "Liberia", "code": "LR"},
    {"name": "Libyan Arab Jamahiriya", "code": "LY"},
    {"name": "Liechtenstein", "code": "LI"},
    {"name": "Lithuania", "code": "LT"},
    {"name": "Luxembourg", "code": "LU"},
    {"name": "Macao", "code": "MO"},
    {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
    {"name": "Madagascar", "code": "MG"},
    {"name": "Malawi", "code": "MW"},
    {"name": "Malaysia", "code": "MY"},
    {"name": "Maldives", "code": "MV"},
    {"name": "Mali", "code": "ML"},
    {"name": "Malta", "code": "MT"},
    {"name": "Marshall Islands", "code": "MH"},
    {"name": "Martinique", "code": "MQ"},
    {"name": "Mauritania", "code": "MR"},
    {"name": "Mauritius", "code": "MU"},
    {"name": "Mayotte", "code": "YT"},
    {"name": "Mexico", "code": "MX"},
    {"name": "Micronesia, Federated States of", "code": "FM"},
    {"name": "Moldova, Republic of", "code": "MD"},
    {"name": "Monaco", "code": "MC"},
    {"name": "Mongolia", "code": "MN"},
    {"name": "Montenegro", "code": "ME"},
    {"name": "Montserrat", "code": "MS"},
    {"name": "Morocco", "code": "MA"},
    {"name": "Mozambique", "code": "MZ"},
    {"name": "Myanmar", "code": "MM"},
    {"name": "Namibia", "code": "NA"},
    {"name": "Nauru", "code": "NR"},
    {"name": "Nepal", "code": "NP"},
    {"name": "Netherlands", "code": "NL"},
    {"name": "Netherlands Antilles", "code": "AN"},
    {"name": "New Caledonia", "code": "NC"},
    {"name": "New Zealand", "code": "NZ"},
    {"name": "Nicaragua", "code": "NI"},
    {"name": "Niger", "code": "NE"},
    {"name": "Nigeria", "code": "NG"},
    {"name": "Niue", "code": "NU"},
    {"name": "Norfolk Island", "code": "NF"},
    {"name": "Northern Mariana Islands", "code": "MP"},
    {"name": "Norway", "code": "NO"},
    {"name": "Oman", "code": "OM"},
    {"name": "Pakistan", "code": "PK"},
    {"name": "Palau", "code": "PW"},
    {"name": "Palestinian Territory, Occupied", "code": "PS"},
    {"name": "Panama", "code": "PA"},
    {"name": "Papua New Guinea", "code": "PG"},
    {"name": "Paraguay", "code": "PY"},
    {"name": "Peru", "code": "PE"},
    {"name": "Philippines", "code": "PH"},
    {"name": "Pitcairn", "code": "PN"},
    {"name": "Poland", "code": "PL"},
    {"name": "Portugal", "code": "PT"},
    {"name": "Puerto Rico", "code": "PR"},
    {"name": "Qatar", "code": "QA"},
    {"name": "Reunion", "code": "RE"},
    {"name": "Romania", "code": "RO"},
    {"name": "Russian Federation", "code": "RU"},
    {"name": "RWANDA", "code": "RW"},
    {"name": "Saint Helena", "code": "SH"},
    {"name": "Saint Kitts and Nevis", "code": "KN"},
    {"name": "Saint Lucia", "code": "LC"},
    {"name": "Saint Pierre and Miquelon", "code": "PM"},
    {"name": "Saint Vincent and the Grenadines", "code": "VC"},
    {"name": "Samoa", "code": "WS"},
    {"name": "San Marino", "code": "SM"},
    {"name": "Sao Tome and Principe", "code": "ST"},
    {"name": "Saudi Arabia", "code": "SA"},
    {"name": "Senegal", "code": "SN"},
    {"name": "Serbia", "code": "RS"},
    {"name": "Seychelles", "code": "SC"},
    {"name": "Sierra Leone", "code": "SL"},
    {"name": "Singapore", "code": "SG"},
    {"name": "Slovakia", "code": "SK"},
    {"name": "Slovenia", "code": "SI"},
    {"name": "Solomon Islands", "code": "SB"},
    {"name": "Somalia", "code": "SO"},
    {"name": "South Africa", "code": "ZA"},
    {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
    {"name": "Spain", "code": "ES"},
    {"name": "Sri Lanka", "code": "LK"},
    {"name": "Sudan", "code": "SD"},
    {"name": "Suriname", "code": "SR"},
    {"name": "Svalbard and Jan Mayen", "code": "SJ"},
    {"name": "Swaziland", "code": "SZ"},
    {"name": "Sweden", "code": "SE"},
    {"name": "Switzerland", "code": "CH"},
    {"name": "Syrian Arab Republic", "code": "SY"},
    {"name": "Taiwan, Province of China", "code": "TW"},
    {"name": "Tajikistan", "code": "TJ"},
    {"name": "Tanzania, United Republic of", "code": "TZ"},
    {"name": "Thailand", "code": "TH"},
    {"name": "Timor-Leste", "code": "TL"},
    {"name": "Togo", "code": "TG"},
    {"name": "Tokelau", "code": "TK"},
    {"name": "Tonga", "code": "TO"},
    {"name": "Trinidad and Tobago", "code": "TT"},
    {"name": "Tunisia", "code": "TN"},
    {"name": "Turkey", "code": "TR"},
    {"name": "Turkmenistan", "code": "TM"},
    {"name": "Turks and Caicos Islands", "code": "TC"},
    {"name": "Tuvalu", "code": "TV"},
    {"name": "Uganda", "code": "UG"},
    {"name": "Ukraine", "code": "UA"},
    {"name": "United Arab Emirates", "code": "AE"},
    {"name": "United Kingdom", "code": "GB"},
    {"name": "United States", "code": "US"},
    {"name": "United States Minor Outlying Islands", "code": "UM"},
    {"name": "Uruguay", "code": "UY"},
    {"name": "Uzbekistan", "code": "UZ"},
    {"name": "Vanuatu", "code": "VU"},
    {"name": "Venezuela", "code": "VE"},
    {"name": "Viet Nam", "code": "VN"},
    {"name": "Virgin Islands, British", "code": "VG"},
    {"name": "Virgin Islands, U.S.", "code": "VI"},
    {"name": "Wallis and Futuna", "code": "WF"},
    {"name": "Western Sahara", "code": "EH"},
    {"name": "Yemen", "code": "YE"},
    {"name": "Zambia", "code": "ZM"},
    {"name": "Zimbabwe", "code": "ZW"}
  ];
  linkButtonStatus: boolean = false;
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
  imageSource = '../../../assets/group_people.png';
  private image;
  date_range = false;
  visibleEmail = false;
  changeEmail;
  cnfEmail;
  constructor(
    private messageService: MessageServiceService,
    private router:Router,
    public accountService: AccountSettingsService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private authService: AuthServiceLocal,
    private integrationService: IntegrationService,
    private meetingService: MeetingService
  ) {
  }

  ngOnInit() {
    this.viewCroper=false;
    setTimeout(() => {
      this.editorContent = '<h1>content changed!</h1>';
      // console.log('you can use the quill instance object to do something', this.editor);
      // this.editor.disable();
    }, 2800);


    this.accountService.confirmEmail.subscribe((check)=>{
      // console.log("check=========",check);
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
    // console.log('USERID----------------->>>>>>', this.userId);
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      language: [null, [Validators.required]],
      dateFormat: [null, [Validators.required]],
      timeFormat: [null, [Validators.required]],
      country: [null, [Validators.required]],
      meetingPlatform: [null, [Validators.required]],
      welcome: [null, [Validators.required]],

    });
    this.myLinkForm = new FormGroup({
      userID: new FormControl(null, [Validators.required])
    });
    /*this.profileForm = new FormGroup({
      'file': new FormControl(null, [Validators.required]),
      'image': new FormControl(null)
    });*/
    this.profileForm = new FormGroup({
      'file': new FormControl(null, [Validators.required]),
      'image': new FormControl(null),
      'webLink': new FormControl(null)
    });
    this.myLinkForm.patchValue({
      userID: this.userId
    });
    /* This function use for get the meeting platform  [SUMIT]*/
    this.meetingService.getSelectedMeetingPlatform(this.userId).subscribe((responseData) => {
      console.log("Selected Meeting plat form",  responseData.data[0].selectedMeetingPlatform);
      let sMeetingPlatform  = typeof (responseData.data[0].selectedMeetingPlatform) === 'string' && responseData.data[0].selectedMeetingPlatform !== 'undefined' && responseData.data[0].selectedMeetingPlatform.split('').length > 0 && responseData.data[0].selectedMeetingPlatform != null ? responseData.data[0].selectedMeetingPlatform : false;
      if(sMeetingPlatform) {
        console.log("IF Part");
        this.integrationService.getMeetingPlatforms(this.userId).subscribe((response) => {
          console.log("Meeting plat form",  response);
            response.data[0].go2meeting === 'true' ? this.meetingPlatformResponse.push('GTM') : null;
            response.data[0].salesforce === 'true' ? this.meetingPlatformResponse.push('SALESFORCE') : null;
            response.data[0].zoom === 'true' ? this.meetingPlatformResponse.push('ZOOM') : null;
            this.meetingPlatformResponse.push('Hangout');
            this.validateForm.patchValue({
              meetingPlatform: responseData.data[0].selectedMeetingPlatform
            });
        });
      } else {
        console.log("ELSE part");
        this.meetingPlatformResponse.push('Hangout')
      }
    });
    this.httpClient.post<any>('/userData/userData', {'userId': this.userId}).subscribe(
      res => {
        this.imageSource = res.data[0].profilePic;
        if (this.imageSource == null) {
          this.imageSource = '../../../assets/group_people.png';
        }
        // console.log('Image Source --->', this.imageSource);
        // console.log('res===========', res);
        this.loginEmail = res.data[0].email;
        this.loginPassword = res.data[0].password;
        this.starPass = createStars(this.loginPassword.length);
        // console.log('Login Email --> ', this.loginEmail);
        // console.log('Login Password --> ', this.starPass);
        // console.log("========================================");
        // console.log("res.data[0].country  ", res.data[0].country);
        // console.log("res.data[0].fullName  ", res.data[0].fullName);
        // console.log("res.data[0].welcomeMessage  ", res.data[0].welcomeMessage);
        // console.log("res.data[0].language  ", res.data[0].language);
        // console.log("res.data[0].dateFormat  ", res.data[0].dateFormat);
        // console.log("res.data[0].timeFormat  ", res.data[0].timeFormat);

        let checkPointCountry = typeof (res.data[0].country) === 'string' && res.data[0].country !== 'null' && res.data[0].country !== 'undefined' && res.data[0].country.split('').length > 0 ? res.data[0].country : 'IN';
        let checkPointLanguage = typeof (res.data[0].language) === 'string' && res.data[0].language !== 'null' && res.data[0].language !== 'undefined' && res.data[0].language.split('').length > 0  ?  res.data[0].language : 'English';
        let checkPointDateFormat = typeof (res.data[0].dateFormat) === 'string' && res.data[0].dateFormat !== 'null' && res.data[0].dateFormat !== 'undefined' && res.data[0].dateFormat.split('').length > 0  ? res.data[0].dateFormat : 'DD/MM/YYYY';
        let checkPointTimeFormat = typeof (res.data[0].timeFormat) === 'string' && res.data[0].timeFormat !== 'null' && res.data[0].timeFormat !== 'undefined' && res.data[0].timeFormat.split('').length > 0 ? res.data[0].timeFormat : '12h (am/pm)';

        // console.log("========================================");
        this.validateForm.patchValue({
          country: checkPointCountry,
          name: res.data[0].fullName,
          welcome: res.data[0].welcomeMessage,
          language: checkPointLanguage,
          dateFormat: checkPointDateFormat,
          timeFormat: checkPointTimeFormat,
          meetingPlatform: 'Hangout'
        });

        this.timeZone = res.data[0].timeZone;
        this.spinLoading = false;
      }, err => {
        // console.log('Error=========', err.message);
        this.messageService.generateErrorMessage("404 ! Record does not exist");
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
    uid['meetingPlatform'] = this.validateForm.value.meetingPlatform !== 'Hangout' ? this.validateForm.value.meetingPlatform : null;
    this.accountService.SaveProfileData(uid);
  }

 /* submitMyProfileForm() {
    // console.log('Profile form--> ', this.profileForm.value);
    // console.log('Image value--> ', this.image);
    let uid = this.profileForm.value;
    uid['id'] = this.userId;
    uid['image'] = this.image;
    const postData = new FormData();
    postData.append('userId', this.userId);
    postData.append('image', this.image);
    this.accountService.saveProfilePic(postData);
    this.upload = true;
  }*/
  submitMyProfileForm() {
 /*   console.log('Profile form--> ', this.profileForm.value);
    console.log('Image value--> ', this.image);*/
    let uid = this.profileForm.value;
    uid['userId'] = this.userId;
    uid['image'] = this.imagePreview;
    const postData = new FormData();
    postData.append('userId', this.userId);
    postData.append('image', this.imagePreview);
    console.log('Post data - ', postData);
    this.accountService.saveProfilePic(this.profileForm.value);

    this.upload = true;
    this.viewCroper=false;
    this.height = 0;
    this.width =0;
  }

 /* onImagePicked(imageEvent: Event) {
    if ((imageEvent.target as HTMLInputElement).files && (imageEvent.target as HTMLInputElement).files[0]) {
      if((imageEvent.target as HTMLInputElement).files[0].size < 3145728){
        this.upload = false;
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
          this.imagePreview = (<FileReader>event.target).result;
          /!*this.image = (imageEvent.target as HTMLInputElement).files[0];*!/
          let type  = (imageEvent.target as HTMLInputElement).files[0].type;
          // console.log("Type ", type);
          switch (type) {
            case 'image/jpeg': this.image = (imageEvent.target as HTMLInputElement).files[0];
              break;
            case 'image/png' :this.image = (imageEvent.target as HTMLInputElement).files[0];
              break;
            case 'image/jpg' : this.image = (imageEvent.target as HTMLInputElement).files[0];
              break;
            default: this.messageService.generateErrorMessage("The image is invalid, or not supported. Allowed types: png jpg jpeg.");
              this.upload = true;
          }
        };
        reader.readAsDataURL((imageEvent.target as HTMLInputElement).files[0]);
      }else{
        this.upload = true;
        this.messageService.generateErrorMessage("Select the file less then 3MB.");
      }
    }
  }*/

  onImagePicked(imageEvent: Event) {
    // console.log("Image Event --- > ", imageEvent);
    if ((imageEvent.target as HTMLInputElement).files && (imageEvent.target as HTMLInputElement).files[0]) {
      if((imageEvent.target as HTMLInputElement).files[0].size < 3145728){
        this.upload = false;
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
          let type = (imageEvent.target as HTMLInputElement).files[0].type;
          // console.log("Type ", type);
          switch (type) {
            case 'image/jpeg':
              this.imagePreview = (<FileReader>event.target).result;
              this.imageChangedEvent = imageEvent;  this.viewCroper=true;
              break;
            case 'image/png' :
              this.imagePreview = (<FileReader>event.target).result;
              this.imageChangedEvent = imageEvent; this.viewCroper=true;
              break;
            case 'image/jpg' :
              this.imagePreview = (<FileReader>event.target).result;
              this.imageChangedEvent = imageEvent; this.viewCroper=true;
              break;
            default: this.messageService.generateErrorMessage("The image is invalid, or not supported. Allowed types: png jpg jpeg.");
              this.upload = true;
              this.viewCroper=false;
          }
        };

        reader.readAsDataURL((imageEvent.target as HTMLInputElement).files[0]);
      }else{
        this.upload = true;
        this.viewCroper=false;
        this.messageService.generateErrorMessage("Select the file less then 3MB.");
      }
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
      // console.log('Email stautus--> ',this.showConfirmEmail);
    }*/

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.changePasswordForm.controls.checkPassword.updateValueAndValidity());
  }

  submitForm1(): void {
    for (const i in this.changePasswordForm.controls) {
      this.changePasswordForm.controls[i].markAsDirty();
      this.changePasswordForm.controls[i].updateValueAndValidity();
    }
    // console.log('Password--> ', this.changePasswordForm.value);
    let changePassword = this.changePasswordForm.value;
    changePassword['userId'] = this.userId;
    this.accountService.updateAccountPassword(changePassword);
  }

  submitFormChangeEmail() {
    this.visibleEmail = false;
    for (const i in this.changeEmailForm.controls) {
      this.changeEmailForm.controls[i].markAsDirty();
      // console.log('Change Login --> ', this.changeEmailForm.value);
      this.changeEmail = this.changeEmailForm.value;
      this.changeEmail['userId'] = this.userId;
      this.cnfEmail = this.changeEmailForm.value.email;
    }
    this.accountService.sendAccountEmail(this.changeEmail);

  }
  handleConfirmOk(){
    this.showConfirmEmail = false;
  }

  onEditorBlured(quill) {
    // console.log('editor blur!', quill);
  }

  onEditorFocused(quill) {
    // console.log('editor focus!', quill);
  }

  onEditorCreated(quill) {
    this.editor = quill;
    // console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    // console.log('quill content is changed!', quill, html, text);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imagePreview = event.base64;
    this.height = event.height;
    this.width = event.width;
    this.upload = false;
    console.log('event--- imageCropped > ',event);
    console.log('imagePreview---->', this.imagePreview);
  }
  imageLoaded() {

  }
  cropperReady() {

  }
  loadImageFailed() {

    // show message
  }
}
