import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router){ }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      
      if(this.checkUserRoles(route)){
        return true
      }else{
        this.router.navigate(['/home']);
      }
    
    
      return false;
  }

  checkUserRoles(route: ActivatedRouteSnapshot): boolean {
    var routeString = route.routeConfig?.path;

    var data = this.loginService.user.permissions?.some((x) => x == routeString);
    return data?data:false
  
  }
}
