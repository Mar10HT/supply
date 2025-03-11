import { Component, OnInit } from '@angular/core';
import { EMPTY_DRIVER } from 'src/app/core/helpers';
import { ActivatedRoute } from '@angular/router';
import { IDriver } from '../../interfaces';
import { DriverQueries } from '../../services';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent implements OnInit {
  public driver: IDriver = EMPTY_DRIVER;

  constructor(
    private route: ActivatedRoute,
    private driverQuery: DriverQueries
  ){}

  ngOnInit(): void {
    const driverId = this.route.snapshot.params.id;

    this.driverQuery.getDriver(driverId).subscribe(({data}) => {
      this.driver = data;
    });
  }
}
