import {Component, Inject, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {QuestionComponent} from '../question/question.component';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {SimpleTimer} from 'ng2-simple-timer';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  styles: [`
    /deep/ .carousel-item.active {
      padding: 5% 15% 5% 15%;
    }

    /deep/ .carousel-indicators > li {
      heigh: 5%;
      width: 7%;
      background: darkviolet;
      border: solid darkviolet 1px;
    }

    /deep/ .carousel-control-next {
      background: darkviolet;
      width: 10%;
      opacity: 0.2;
    }

    /deep/ .carousel-control-prev {
      background: darkviolet;
      width: 10%;
      opacity: 0.2;
    }
  `],
  entryComponents: [QuestionComponent]
})
export class QuizComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QuizComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
    config.interval = 0;
    config.wrap = true;
    this.quizName = data.quizName;
  }

  ngOnInit() {
    this.extractDataFromDatabase();

   
  }

  info: Array<object>;
  quizName: string;

  private extractDataFromDatabase() {

    this.info = [];
    let answers = [];
    let obj = {};
    let question = null;

    firebase.database().ref(this.data.path).once('value').then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(a => {//users
        let user = snapshot.child(a + '/loginInfo/name').val() + ' ' + snapshot.child(a + '/loginInfo/surname').val();
        //-----if creator name egal cu numele dat then do the rest

        if (user == this.data.creator) {

          obj = {};
          // quizuri
          if (snapshot.child(a + '/quizez').val() != null) {//check if they have quizez
            Object.keys(snapshot.child(a + '/quizez').val()).forEach(b => {
              if (b == this.data.quizName) {

                //---------if quizez.child equals my quiz then do nu stiu ce
                Object.keys(snapshot.child(a + '/quizez/' + b + '/Questions').val()).forEach(c => {
                  question = snapshot.child(a + '/quizez/' + b + '/Questions/' + c + '/question').val();
                  answers = [];

                  Object.keys(snapshot.child(a + '/quizez/' + b + '/Questions/' + c + '/answers').val()).forEach(d => {
                    let raspuns = snapshot.child(a + '/quizez/' + b + '/Questions/' + c + '/answers/' + d + '/ans').val();
                    answers.push(raspuns);
                  });

                  obj = {
                    q: question,
                    a: answers
                  };
                  this.info.push(obj);

                });
              }
            });
          }//end if

        }//end if
      });

    }.bind(this));
  }

  public submitAnswers() {
    //check all questions are answered

    //block chain stuff begin here
  }

  startCountDown(min: number){
    console.log('count down ' + min +' minute')
    console.log('count down ' + min*60 +' secunde')

      let secunde =    min * 60;
      let interval = setInterval(()=>
      {
        console.log(secunde)

        if(secunde < 0){
          clearInterval(interval);
          console.log('ding!')
        }
      }
    )
  }

}
