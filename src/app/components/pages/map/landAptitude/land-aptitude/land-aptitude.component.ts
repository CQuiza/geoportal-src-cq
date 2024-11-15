import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'; // Importación necesaria para las tablas
import { MatFormFieldModule } from '@angular/material/form-field'; // Importación necesaria para los campos de formulario
import { MatInputModule } from '@angular/material/input'; // Importación necesaria para los inputs

@Component({
  selector: 'app-land-aptitude',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatTableModule, MatFormFieldModule, MatInputModule],
  templateUrl: './land-aptitude.component.html',
  styleUrls: ['./land-aptitude.component.css']
})
export class LandAptitudeComponent {

  @Input() aptitudes!: any;
  @Input() cultivosAptos! : any;

  // getCultivoNames(obj: any): string[] {
  //   return Object.keys(obj);
  // }

}
