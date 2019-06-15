import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {PizzaPartyComponent} from '../../pizza-party/pizza-party.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-questions-form',
  templateUrl: './add-questions-form.component.html',
  styleUrls: ['./add-questions-form.component.css']
})
export class AddQuestionsFormComponent implements OnInit {

  createQuizForm: FormGroup;

  path = 'users/' + localStorage.getItem('uid') + '/quizez';
  answerNumber = 0;

  constructor(private authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.formInitialState();
  }

  formInitialState() {
    this.createQuizForm = this.fb.group({
      title: [],
      Questions: this.fb.array([])
    });
  }

  //question

  public get questionForm() {
    return this.createQuizForm.controls['Questions'] as FormArray;
  }

  addQuestion() {
    const questions = this.fb.group({
      question: [],
      answerType: [],
      answers: this.fb.array([])
    });

    this.questionForm.push(questions);
  }

  deleteQuestion(i) {
    this.questionForm.removeAt(i);
  }

  //answers

  addAnswers(i) {
    const control = (<FormArray>this.createQuizForm.controls['Questions']).at(i).get('answers') as FormArray;

    const ans = this.fb.group({
      ans: []
    });

    control.push(ans);
    this.answerNumber++;
  }

  deleteAnswers(i, j) {
    const control = (<FormArray>this.createQuizForm.controls['Questions']).at(i).get('answers') as FormArray;
    control.removeAt(j);

    this.answerNumber--;

    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: 500,
      data: {text: 'Answer deleted!'}
    });
  }

  public answer(i){
    return (<FormArray>this.createQuizForm.controls['Questions']).at(i).get('answers') as FormArray;
  }

  saveForm() {
    //show notification
    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: 500,
      data: {text: 'Form saved!'}
    });

    this.updateDatabase();

    //reset form
    Object.keys(this.createQuizForm).forEach(k => {
      this.createQuizForm.removeControl(k);
    });

    this.formInitialState();
  }

  public updateDatabase(){
    const data = Object.assign({}, this.createQuizForm.value);

    //insert in database
    const newPath = this.path + '/' + this.createQuizForm.value.title;
    firebase.database().ref(newPath).set(data);
  }

}
