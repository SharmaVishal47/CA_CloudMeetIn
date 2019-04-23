import { Injectable } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  constructor(private modalService: NzModalService,) { }
  public generateCreateMessage(content:any){
    this.modalService.create({
      nzTitle: 'CloudMeetIn message ',
      nzContent:content,
      nzMask:false,
      nzClosable: false,
      nzOnOk: () => console.log('Info OK')//new Promise((resolve) => window.setTimeout(resolve, 1000))
    });
  }
  public generateSuccessMessage(content:any){
    this.modalService.success({
      nzTitle: 'CloudMeetIn message ',
      nzContent:content,
      nzMask:false,
      nzClosable: false,
      nzOnOk: () => console.log('Info OK') //new Promise((resolve) => window.setTimeout(resolve, 1000))
    });
  }
  public generateErrorMessage(content:any){
    this.modalService.error({
      nzTitle: 'CloudMeetIn message ',
      nzContent:content,
      nzMask:false,
      nzClosable: false,
      nzOnOk: () => console.log('Info OK')//new Promise((resolve) => window.setTimeout(resolve, 1000))
    });
  }
  public generateInfoMessage(content:any){
    this.modalService.info({
      nzTitle: 'CloudMeetIn message ',
      nzContent:content,
      nzMask:false,
      nzClosable: false,
      nzOnOk: () => console.log('Info OK')//new Promise((resolve) => window.setTimeout(resolve, 1000))
    });
  }
}
