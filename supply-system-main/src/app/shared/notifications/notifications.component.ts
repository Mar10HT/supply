import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/admin/interfaces';
import { CommonModule } from '@angular/common';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { LoadingComponent } from '../loading/loading.component';
import { HeaderQueries } from '../services';
import { NotificationCardComponent } from '../notification-card/notification-card.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationCardComponent, CommonModule, LoadingComponent
  ],
  animations: [
    fadeInOnEnterAnimation()
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public loading = true;
  public products: IProduct[] = [];
  public hasNotifications = false;

  constructor(
    private headerQuery: HeaderQueries
  ) {}

  ngOnInit(): void {
    this.getNotifications();
  }

  private getNotifications(): void {
    this.headerQuery.getNotifications().subscribe(({ data }) => {
      this.products = data;
      this.hasNotifications = this.products.length > 0;
      this.loading = false;
    });
  }
}
