import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if(!navigator.geolocation){
  alert('el navegador no tiene herramienta de geolocalizaciòn')
  throw new Error('el navegador no tiene herramienta de geolocalizaciòn')
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
