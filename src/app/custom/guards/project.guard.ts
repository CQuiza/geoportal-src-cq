import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResponseAuth } from '../../interfaces/responseAuth';
import { catchError, map, of } from 'rxjs';

export const projectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token: string = authService.tokenExist()


  if (token != '') {
    return authService.isValidToken().pipe(
      map(data => {
        if(data.isSucces){
              return true
        } else {
            alert('Invalid token')
            authService.finalizeLogout()
            return false;
        }
      }),
      catchError(error => {
        console.log('Error:', error)
        authService.finalizeLogout()
        return of(false);
      })
    )
  } else {
      alert('Please login');
      authService.finalizeLogout()
      return false;
    }
}
