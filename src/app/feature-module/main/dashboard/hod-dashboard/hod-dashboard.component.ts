import { Component, OnInit, ViewChild } from "@angular/core";
import { Route, Router, ActivatedRoute } from "@angular/router";

import { ChartConfiguration, ChartData } from "chart.js";
import { BaseChartDirective } from "ng2-charts";

import { routes } from "src/app/core/helpers/routes/routes";

@Component({
  selector: "app-hod-dashboard",
  templateUrl: "./hod-dashboard.component.html",
  styleUrls: ["./hod-dashboard.component.scss"],
})
export class HodDashboardComponent implements OnInit {
  public uName: any;
  public userRole: any;
  constructor(private router: ActivatedRoute) {
    const currentState = this.router.queryParams.subscribe((params) => {
      this.uName = params["userName"];

    });
  }

  ngOnInit(): void {

    const getSessionData = sessionStorage.getItem("Email");


    const getLocal = localStorage.getItem("EmailId");


    this.userRole = localStorage.getItem("user_role");

  }

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public layoutWidth = "1";
  public routes = routes;
  public barChartData: ChartData<"bar"> = {
    labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012"],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
      { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
    ],
  };

  public pieChartData: ChartData<"pie", number[], string | string[]> = {
    labels: [["Series A", "Series B"], "Main Series"],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };

  public getUserRole() {
    return this.userRole;
  }
}
