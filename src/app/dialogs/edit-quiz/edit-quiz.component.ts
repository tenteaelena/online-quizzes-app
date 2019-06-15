import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddQuestionsFormComponent} from '../../components/add-questions-form/add-questions-form.component';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {s} from '@angular/core/src/render3';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(200, animateChild()))
      ]),
    ])
  ]
})
export class EditQuizComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditQuizComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public form: AddQuestionsFormComponent) {
  }

  finish: boolean;

  ngOnInit() {
    this.form.formInitialState();

    this.finish = false;

    this.form.createQuizForm.controls['title'].setValue(this.data.quizToDelete);

    firebase.database().ref(this.data.path).once('value').then(function (snapshot) {
      console.log('-------' + snapshot.child('Questions').val());
      Object.keys(snapshot.child('Questions').val()).forEach(k => {
        console.log(k);
        this.form.addQuestion();

        console.log('-intrebare-' + snapshot.child('Questions/' + k + '/question').val());//intrebarea

        this.form.questionForm.at(k).get('question').setValue(snapshot.child('Questions/' + k + '/question').val());

        console.log('-answer type-' + snapshot.child('Questions/' + k + '/answerType').val());//tip raspuns

        this.form.questionForm.at(k).get('answerType').setValue(snapshot.child('Questions/' + k + '/answerType').val());

        Object.keys(snapshot.child('Questions/' + k + '/answers').val()).forEach(a => {
          console.log('-answer-' + snapshot.child('Questions/' + k + '/answers/' + a + '/ans').val()); //answers
          this.form.addAnswers(k);
          //this.form.questionForm.at(k).get('answers').setValue(snapshot.child('Questions/' + k+'/answers'+a).val());
          this.form.answer(k).at(a).get('ans').setValue(snapshot.child('Questions/' + k + '/answers/' + a + '/ans').val());

        });
      });

      this.finish = true;

      console.log(this.form.createQuizForm.controls['Questions'].value);
    }.bind(this));

  }

  onClose() { //close dialog
    this.dialogRef.close();
  }

  onSaveQuiz() {

    //nu se poate redenumi o cheie in firebase in cazul modificarii titlului
    // deci
    // se va sterge quizul si se va adauga iar cu modificarile deja facute

    firebase.database().ref(this.data.path).remove();

    this.form.updateDatabase()

    this.onClose();


    setTimeout(function(){ //reload page after 1.5 seconds
      window.location.reload();

    },1500);
  }

}
