import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input()
  questionObj: object;

  @Input()
  disableQuestions: boolean;

  @Output() radioSelected = new EventEmitter<string>();

  selected: string;
  form: FormGroup;

  constructor(public fb: FormBuilder) {
    this.form = fb.group({value: ''})
  }

  ngOnInit() {
  }

  radioGroupChange(event: any){
    this.radioSelected.emit(this.selected) //trimite valoarea mat-radio-group
  }
}
