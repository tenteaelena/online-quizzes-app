import {Component, OnInit, SecurityContext} from '@angular/core';
import * as firebase from 'firebase';
import {MatDialog} from '@angular/material';
import {DeleteQuizComponent} from '../../dialogs/delete-quiz/delete-quiz.component';
import {DomSanitizer} from '@angular/platform-browser';
import {EditQuizComponent} from '../../dialogs/edit-quiz/edit-quiz.component';
import {Overlay} from '@angular/cdk/overlay';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {

  quizList: Array<string>;
  questionNumberList: Array<string>;
  date= '15/05/2019';
  path = 'users/' + localStorage.getItem('uid') + '/quizez';

  constructor(private dialog: MatDialog, private dom: DomSanitizer, private overlay: Overlay) {

  }

  ngOnInit() {


    this.quizList = [];
    this.questionNumberList = [];

    firebase.database().ref(this.path).once('value').then(function (snapshot) {
      console.log(snapshot.val());
      Object.keys(snapshot.val()).forEach(k => {

        this.quizList.push(k);//push in list de quizuri --numai atat pentru lista
        var contor = 0;

        Object.keys(snapshot.child(k).child('Questions').val()).forEach(l => {
          //console.log('-intrebare-'+snapshot.child(k).child('Questions/' + l+'/question').val());//intrebarea
          contor++;
          //console.log('-answer type-'+snapshot.child(k).child('Questions/' + l+'/answerType').val());//tip raspuns
          // Object.keys(snapshot.child(k).child('Questions/' + l+'/answers').val()).forEach(a => {
          //   console.log('-answer-'+snapshot.child(k).child('Questions/' + l+'/answers/'+a+'/ans').val()) //answers
          // })
        });
        this.questionNumberList.push(contor); //number of questionsswa
      });
    }.bind(this));
  }

  // users/currentuser/quizez

  onDelete(quizName: string) {
    const dialogRef = this.dialog.open(DeleteQuizComponent, {
      width: '30%',
      data: {text: 'Are you sure?', quizToDelete: quizName},
      autoFocus: false
    });

    dialogRef.componentInstance.htmlContent = this.dom.sanitize(SecurityContext.HTML, '<p>You are about to delete <b>'+quizName+'</b> quiz!!!</p>');
  }

  onEdit(quizName: string) {
    const dialogRef = this.dialog.open(EditQuizComponent, {
      width: '70%',
      data: {path: this.path + '/' + quizName, quizToDelete: quizName},
      autoFocus: false
    });
  }
}
