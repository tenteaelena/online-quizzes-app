import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  addQuiz() {
    this.router.navigate(['add-quiz']);
  }


  onLogOut() {
    this.authService.logout();
  }

  onYourQuizzes(){
    this.router.navigate(['your-quizzes'])
  }

  onTakeAQuiz(){
    this.router.navigate(['take-quiz']);
  }
}
