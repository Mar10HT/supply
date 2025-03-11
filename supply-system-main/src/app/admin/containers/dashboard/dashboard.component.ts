import { Component, OnInit } from '@angular/core';
import { DateFilterComponent, LoadingComponent, SideBarComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { EMPTY_DASHBOARD } from 'src/app/core/helpers';
import moment from 'moment';
import { DashboardQueries } from '../../services';
import { IDashboard, IYearlyStats } from '../../interfaces';

const MONTH_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    title: {
      display: true,
      text: 'SALIDAS MENSUALES',
      font: { size: 20 }
    },
    legend: { display: false },
  }
};

const DAILY_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins:{
    title: {
      display: true,
      text: 'SALIDAS DIARIAS',
      font: { size: 20 }
    },
    legend: { display: false },
  }
};

const GROUP_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  animateRotate: true,
  plugins:{
    title: {
      display: true,
      text: 'SALIDAS DE GRUPOS DE PRODUCTOS',
      font: { size: 20 }
    },
    hoverOffset: 4
  }
};

const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB", "#64B5F6",
  "#4DB6AC", "#81C784", "#AED581", "#FFB74D", "#FF8A65", "#A1887F"
];


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SideBarComponent, LoadingComponent, CommonModule,
    DateFilterComponent
   ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public loading = true;
  public yearlyStats: IYearlyStats[] = [];
  public totalRevenue = 0;
  public topEarningMonth: IYearlyStats = { month: '', revenue: 0 };
  public dashboardInfo: IDashboard = EMPTY_DASHBOARD;
  public start = moment.utc().startOf('month').format('YYYY-MM-DD');
  public end = moment.utc().format('YYYY-MM-DD');
  private dailyChart: Chart | null = null;
  private depChart: Chart | null = null;
  private groupChart: Chart | null | any = null;

  constructor(
    private dashboardQuery: DashboardQueries
  ) {}

  ngOnInit(): void {
    this.dashboardQuery.getYearlyStats().subscribe(({ data }) => {
      this.yearlyStats = data;
      this.totalRevenue = data.reduce((acc, curr) => acc + +curr.revenue, 0);
      this.topEarningMonth = data.reduce((acc, curr) => acc.revenue > curr.revenue ? acc : curr, { month: '', revenue: 0 });
      this.loading = false;
      this.createYearlyChart();
    });
    this.fetchDashboard(this.start, this.end);
  }

  public filterDates(dates: { startDate: Date | null, endDate: Date | null }): void {
    if(dates.startDate && dates.endDate) {
      this.loading = true;
      this.start = moment.utc(dates.startDate).format('YYYY-MM-DD');
      this.end = moment.utc(dates.endDate).format('YYYY-MM-DD');
      this.fetchDashboard(this.start, this.end);
    }
  }

  private fetchDashboard(start: string, end: string): void {
    this.dashboardQuery.getDashboard(start, end).subscribe(({ data }) => {
      this.dashboardInfo = data;
      this.loading = false;
      this.generateCharts();
    });
  }

  private generateCharts(): void {
    this.createDailyChart();
    this.createGroupedChart();
    this.departmentChart();
  }

  private departmentChart(): void {
    if(this.depChart) {
      this.depChart.destroy();
    }
    const chartElem = <HTMLCanvasElement>document.getElementById(`depts`);
    this.depChart = new Chart(
      chartElem, {
        type: 'bar',
        data: {
          labels: this.dashboardInfo.departments.map(stat => stat.department),
          datasets: [{
            label: 'Costo',
            data:  this.dashboardInfo.departments.map(stat => stat.quantity),
            backgroundColor: COLORS
          }]
        },
        options: {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          plugins:{
            title: {
              display: true,
              text: 'TOP DEPARTAMENTOS',
              font: { size: 20 }
            }
          }
        }
      }
    );
  }

  private createGroupedChart(): void {
    if(this.groupChart) {
      this.groupChart.destroy();
    }
    const chartElem = <HTMLCanvasElement>document.getElementById(`groups`);
    this.groupChart = new Chart(
      chartElem, {
        type: 'doughnut',
        data: {
          labels: this.dashboardInfo.groups.map(stat => stat.name),
          datasets: [{
            label: 'Costo',
            data:  this.dashboardInfo.groups.map(stat => stat.quantity),
            backgroundColor: COLORS
          }]
        },
        options: GROUP_OPTIONS
      }
    );
  }

  private createDailyChart(): void {
    if(this.dailyChart) {
      this.dailyChart.destroy();
    }
    const chartElem = <HTMLCanvasElement>document.getElementById(`days`);
    this.dailyChart = new Chart(
      chartElem, {
        type: 'bar',
        data: {
          labels: this.dashboardInfo.days.map(stat => stat.day),
          datasets: [{
            label: 'Costo',
            data:  this.dashboardInfo.days.map(stat => stat.quantity),
            backgroundColor: COLORS
          }]
        },
        options: DAILY_OPTIONS
      }
    );
  }

  private createYearlyChart(): void {
    const chartElem = <HTMLCanvasElement>document.getElementById(`months`);
    new Chart(
      chartElem, {
        type: 'bar',
        data: {
          labels: this.yearlyStats.map(stat => stat.month),
          datasets: [{
            label: 'Costo',
            data: this.yearlyStats.map(stat => stat.revenue),
            backgroundColor: COLORS
          }]
        },
        options: MONTH_OPTIONS
      }
    );
  }
}
