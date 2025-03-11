import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NameHelper } from 'src/app/admin/helpers';
import { cookieHelper } from 'src/app/core/helpers';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationsComponent, CommonModule],
  providers: [NameHelper, cookieHelper],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public position = this.cookieHelper.getPosition();
  public title = 'Sistema de Gestión de Vehículos';
  public name = '';
  public notifications = false;

  constructor(
    private cookieHelper: cookieHelper,
    public nameHelper: NameHelper,
    private router: Router
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.setTitle();
      }
    });
  }

  ngOnInit(): void {
    this.setTitle();
    this.name = this.nameHelper.getShortName(this.cookieHelper.getName());
  }

  public toggleNotifications(): void {
    this.notifications = !this.notifications;
  }

  private setTitle(): void {
    const url = this.router.url;
    switch (true) {
      case url.includes('dashboard'):
        this.title = 'Dashboard';
        break;
      case url.includes('products'):
        this.title = 'Productos';
        break;
      case url.includes('suppliers'):
        this.title = 'Proveedores';
        break;
      case url.includes('requisitions'):
        this.title = 'Requisiciones';
        break;
      case url.includes('history'):
        this.title = 'Historial';
        break;
      case url.includes('inventory'):
        this.title = 'Inventario';
        break;
      case url.includes('reports'):
        this.title = 'Reportes';
        break;
      case url.includes('input'):
        this.title = 'Entrada';
        break;
      default:
        this.title = 'Sistema de Proveduría';
    }
  }
}
