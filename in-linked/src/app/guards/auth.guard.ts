import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(localStorage.getItem(environment.token_key));
      if (localStorage.getItem(environment.token_key)) {
        return true;
      }
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
      return false;
  }
}
