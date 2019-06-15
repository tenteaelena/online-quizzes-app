import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input()
  questionObj: object;

  value: string;

  form: FormGroup;

  constructor(public fb: FormBuilder) {
    this.form = fb.group({value: this.value})
  }

  ngOnInit() {
  }

}
