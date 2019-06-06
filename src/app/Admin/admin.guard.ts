import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AdminService} from './admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService,private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.adminService.getIsAdminAuthenticated();
    console.log("isAuthenticated===========> ", isAuthenticated);
    if(!isAuthenticated){
      this.router.navigate(['admin-login']);
    }
    return true;
  }
}
