import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { routes } from "src/app/core/helpers/routes/routes";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  {
  public routes = routes;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([routes.adminDashboard]);
  }
}
