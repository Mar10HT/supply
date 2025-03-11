import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NameHelper } from 'src/app/admin/helpers';
import { cookieHelper } from 'src/app/core/helpers';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  providers: [NameHelper, cookieHelper],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public position = this.cookieHelper.getPosition();
  public title = 'Sistema de Gestión de Vehículos';
  public name = '';

  constructor(
    private cookieHelper: cookieHelper,
    public nameHelper: NameHelper,
    private router: Router
  ){
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

  private setTitle(): void {
    const url = this.router.url;
    switch(true) {
      case url.includes('dashboard'):
        this.title = 'Dashboard';
        break;
      case url.includes('vehicles'):
        this.title = 'Vehículos';
        break;
      case url.includes('drivers'):
        this.title = 'Conductores';
        break;
      case url.includes('maintenance'):
        this.title = 'Mantenimiento';
        break;
      case url.includes('requests'):
        this.title = 'Solicitudes';
        break;
      case url.includes('request'):
        this.title = 'Solicitud';
        break;
      case url.includes('create-log'):
        this.title = 'Crear Bitácoras';
        break;
      case url.includes('log'):
        this.title = 'Bitácoras';
        break;
      case url.includes('vehicle'):
        this.title = 'Vehículo';
        break;
      case url.includes('driver'):
        this.title = 'Conductor';
        break;
      default:
        this.title = 'Sistema de Gestión de Vehículos';
    }
  }
}
