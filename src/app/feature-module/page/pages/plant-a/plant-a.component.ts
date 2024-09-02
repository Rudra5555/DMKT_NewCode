import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-planta',
  templateUrl: './plant-a.component.html',
  styleUrls: ['./plant-a.component.scss']
})
export class PlantAComponent {
  public routes = routes;
}
