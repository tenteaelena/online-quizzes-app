import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-pizza-party',
  templateUrl: './pizza-party.component.html',
  styleUrls: ['./pizza-party.component.css']
})
export class PizzaPartyComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  text: string;

  ngOnInit() {
    this.text = this.data['text'];
  }

}
