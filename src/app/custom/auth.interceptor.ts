import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.indexOf('login') > 0 || req.url.indexOf('register')> 0) return next(req);

  const token = localStorage.getItem('token')
  const clonRequest  = req.clone({
    setHeaders : {
      Authorization: `Token ${token}`
    }
  })
  console.log('este es interceptor')
  return next(clonRequest);

};
