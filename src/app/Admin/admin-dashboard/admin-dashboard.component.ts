import { Component, OnInit } from '@angular/core';
import {Data, Router} from '@angular/router';
import {MeetingService} from '../../meetings/meeting.service';
import {AdminService} from '../admin.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private meetingService: MeetingService,
    public adminService: AdminService,
    private message: NzMessageService,
    private router: Router
  ) { }
  listOfData: Data[] = [
    {
      user_id: 'abhi',
      name: 'John Brown',
      no_of_meeting: 32,
      created_date: 'New York No. 1 Lake Park',
      last_login : '20 May',
      signup_process: 'Google',
      location: 'Noida',
      email_id : 'sumit.kumar@cloudanaloy.com',
      company: 'CA',
      phone_no : '8954369176'

    }
  ];
  public listOfDisplayData: Data[];
  isSpinning: boolean = true;
  ngOnInit() {
    this.meetingService.removeHeader(true);
    this.adminService.getUserRecords().subscribe((responseData)=>{

      if(responseData.data.length > 0) {
        this.listOfData = [];
        console.log("Verified User  -- > ", responseData);
        console.log("Verified User  -- > ", responseData.data[0].meetingCount[0]['COUNT(*)']);
        for(let i =0; i < responseData.data.length; i++ ) {
          this.listOfData.push({
            user_id: responseData.data[i].userId,
            name : responseData.data[i].fullName,
            no_of_meeting: responseData.data[i].meetingCount[0]['COUNT(*)'],
            created_date: responseData.data[i].createdDate,
            last_login : responseData.data[i].lastLogin,
            signup_process: responseData.data[i].signupProcess,
            location: responseData.data[i].location,
            email_id : responseData.data[i].email,
            company: responseData.data[i].company,
            phone_no : responseData.data[i].phone
          })
        }
        /*this.listOfData.push({
          user_id: 'abhi',
          name: 'John Brown',
          no_of_meeting: 3,
          created_date: '2019-05-22 07:36:51',
          last_login : 'Wed May 22 2019 07:42:32 GMT-0700 (Mountain Standard Time)',
          signup_process: 'Google',
          location: 'Noida',
          email_id : 'sumit.kumar@cloudanaloy.com',
          company: 'CA',
          phone_no : '8954369176'

        },
          {
            user_id: 'abhi',
            name: 'John Brown',
            no_of_meeting: 5,
            created_date: '2019-05-23 07:36:51',
            last_login : 'Wed May 24 2019 07:42:31 GMT-0700 (Mountain Standard Time)',
            signup_process: 'Google',
            location: 'Noida',
            email_id : 'sumit.kumar@cloudanaloy.com',
            company: 'CA',
            phone_no : '8954369176'

          },
          {
            user_id: 'abhi',
            name: 'John Brown',
            no_of_meeting: 7,
            created_date: '2019-05-24 07:36:51',
            last_login : 'Wed May 25 2019 07:42:31 GMT-0700 (Mountain Standard Time)',
            signup_process: 'Google',
            location: 'Noida',
            email_id : 'sumit.kumar@cloudanaloy.com',
            company: 'CA',
            phone_no : '8954369176'

          },
          {
            user_id: 'abhi',
            name: 'John Brown',
            no_of_meeting: 1,
            created_date: '2019-05-25 07:36:51',
            last_login : 'Wed May 27 2019 07:42:31 GMT-0700 (Mountain Standard Time)',
            signup_process: 'Google',
            location: 'Noida',
            email_id : 'sumit.kumar@cloudanaloy.com',
            company: 'CA',
            phone_no : '8954369176'

          });*/
        this.listOfDisplayData = [...this.listOfData];
        this.isSpinning = false;

      } else {
        this.message.create('error', `Invalid Credentials`);
      }
    });

  }

  listOfSearchName: string[] = [];
  listOfSearchAddress: string[] = [];
  listOfFilterName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }];
  listOfFilterAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];


  mapOfSort: { [key: string]: any } = {
    user_id: null,
    name: null,
    no_of_meeting: null,
    created_date: null,
    last_login : null,
    signup_process: null,
    location: null,
    email_id : null,
    company: null,
    phone_no : null
  };
  sortName: string | null = null;
  sortValue: string | null = null;
  gridStyle = {
    width: '100%',
    textAlign: 'right'
  };
  searchValue = '';


  sort(sortName: string, value: string): void {
    value = typeof (value) === 'string' && value !== 'undefined' && value !== 'null' && value.split('').length > 0 ?  value : 'descend';
    console.log("value------ > ", value);
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.mapOfSort) {
      this.mapOfSort[key] = key === sortName ? value : null;
    }
    this.search(this.listOfSearchName, this.listOfSearchAddress);
  }
  searchs(input : string): void {
    const filterFunc = (item:Data) => {
      return (
        (this.listOfSearchAddress.length
          ? this.listOfSearchAddress.some(_input => item[input].indexOf(_input) !== -1)
          : true) && item[input].indexOf(this.searchValue) !== -1
      );
    };
    const data = this.listOfData.filter((item: Data) => filterFunc(item));
    this.listOfDisplayData = data.sort((a, b) =>
      this.sortValue === 'ascend'
        ? a[this.sortName!] > b[this.sortName!]
        ? 1
        : -1
        : b[this.sortName!] > a[this.sortName!]
        ? 1
        : -1
    );
  }
  search(listOfSearchName: string[], listOfSearchAddress: string[]): void {
    this.listOfSearchName = listOfSearchName;
    this.listOfSearchAddress = listOfSearchAddress;
    const filterFunc = (item: Data) =>
      (this.listOfSearchAddress.length
        ? this.listOfSearchAddress.some(address => item.address.indexOf(address) !== -1)
        : true) &&
      (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    const listOfData = this.listOfData.filter((item: Data) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.listOfDisplayData = listOfData;
    }
  }

  resetFilters(): void {
    this.listOfFilterName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }];
    this.listOfFilterAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];
    this.listOfSearchName = [];
    this.listOfSearchAddress = [];
    this.search(this.listOfSearchName, this.listOfSearchAddress);
  }

  resetSortAndFilters(): void {
    this.sortName = null;
    this.sortValue = null;
    this.mapOfSort = {
      name: null,
      no_of_meeting: null,
      created_date: null
    };
/*    this.resetFilters();*/
    this.search(this.listOfSearchName, this.listOfSearchAddress);
  }


  onLogout() {
    this.adminService.onLogout();

  }



}
