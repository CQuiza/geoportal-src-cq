import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent {

}
