import {Component, HostListener} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'licenta-web-etentea';


  constructor(private authService: AuthService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    //this.authService.logout();
  }

  ngOnInit(){
    console.log('LOGGED IN UID - '+localStorage.getItem('uid'));
  }
}
