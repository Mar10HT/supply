import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SideNavButtonComponent } from '../buttons';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatSidenavModule, SideNavButtonComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  public selectedOption = 'dashboard';
  public iconTopPosition = 4.5;

  constructor(
    private router: Router
  ){}

  ngOnInit(): void {
    this.selectedOption = this.router.url.split('/')[2];
    this.animateIcon();
    this.routeOption();
  }

  public selectOption(option: string): void {
    this.selectedOption = option;
    this.animateIcon();
    setTimeout(() => {
      option === 'requests' ? this.router.navigate(['admin/requests/0']) : this.router.navigate([`admin/`, option]);
    }, 500);
  }

  public logout(): void {
    this.router.navigate([``]);
  }

  private routeOption(): void {
    const url = this.router.url;
    switch(true) {
      case url.includes('vehicle'):
        this.selectedOption = 'vehicles';
        break;
      case url.includes('maintenance'):
        this.selectedOption = 'maintenance';
        break;
      case url.includes('driver'):
        this.selectedOption = 'drivers';
        break;
      case url.includes('create-log'):
        this.selectedOption = 'logs';
        break;
      case url.includes('log'):
        this.selectedOption = 'logs';
        break;
      case url.includes('requests'):
        this.selectedOption = 'requests';
        break;
      case url.includes('request'):
        this.selectedOption = 'requests';
        break;
      case url.includes('vehicles'):
        this.selectedOption = 'vehicles';
        break;
      default:
        this.selectedOption = 'dashboard';
    }
    this.animateIcon();
  }


  private animateIcon(): void {
    switch (this.selectedOption) {
      case 'dashboard':
        this.iconTopPosition = 4.5;
        break;
      case 'vehicles':
        this.iconTopPosition = 21;
        break;
      case 'drivers':
        this.iconTopPosition = 37.5;
        break;
      case 'maintenance':
        this.iconTopPosition = 54;
        break;
      case 'requests':
        this.iconTopPosition = 70.5;
        break;
      case 'logs':
        this.iconTopPosition = 87;
        break;
    }
  }
}
