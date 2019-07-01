import {Component, Inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {QuestionComponent} from '../question/question.component';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {SimpleTimer} from 'ng2-simple-timer';
import {Block} from '../../custom-classes/block';
import {Observable, of} from 'rxjs';
import {PizzaPartyComponent} from '../../pizza-party/pizza-party.component';

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
  entryComponents: [QuestionComponent],
  providers: [SimpleTimer]
})
export class QuizComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<QuizComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public config: NgbCarouselConfig,
              private snackBar: MatSnackBar,
              private st: SimpleTimer, private zone: NgZone) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
    config.interval = 0;
    config.wrap = true;
    this.quizName = data.quizName;
  }
  counter: number = 0;
  time=10;
  timpUi: any;
  info: Array<object>;
  answers: Array<string>;
  quizName: string;
  private ansPath = '';
  public timeHasPassed = false;

  callback(sec) {
    this.timpUi = this.time-this.counter
    if(this.counter<sec) {
      this.counter++;
      this.timeHasPassed = false;
    }
    else {
      this.counter=0;
      this.timeHasPassed = true;
      this.st.unsubscribe('1sec')
      this.st.delTimer('1sec')
    }
    console.log(this.counter)

  }

  obs=null;

  ngOnInit() {
    this.extractDataFromDatabase();

    this.st.newTimer('1sec',1);

    this.st.subscribe('1sec', () => this.callback(this.time));

    // let observable = of(1,2,3);
    //
    // let observer = {
    //   next: x => console.log('Observer got a next value: ' + x),
    //   error: err => console.error('Observer got an error: ' + err),
    //   complete: () => console.log('Observer got a complete notification'),
    // }
    //
    // observable.subscribe(observer);

    this.blockchain = [this.genesisBlock('whatever')];
    this.previousBlock = this.blockchain[0];

    this.obs = Observable.create(function (observer){
      let block = this.nextBlock(this.previousBlock, "whatever");

      let mine = block.mineBlock(4);
      observer.next(mine);
    }.bind(this))

  }

  testSomething(): Observable<any>{
    let obs = new Observable(observer => {
      let block = this.nextBlock(this.previousBlock, "whatever");

      let mine = block.mineBlock(3);
      observer.next(mine);
    })
    return obs;
  }


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
                this.ansPath = this.data.path+''+a + '/quizez/'+b+'/Questions';
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
          //TODO: break the cycle somehow ???

        }//end if
      });

      this.answers = new Array<string>(this.info.length)

    }.bind(this));
  }

  genesisBlock = (data) => new Block(0, Date.now(), data, '0');

  nextBlock = (lastBlock, data) => new Block(lastBlock.index + 1, Date.now(), data, lastBlock.hash);

  blockchain= null;
  previousBlock = null;

  public async submitAnswers() {
    let allAnswerd = true;

    // TODO: check all questions are answered
    this.answers.forEach(answer => {
      if(answer == null)
        allAnswerd = false;
    });

    if(allAnswerd) {
      /* stop timer */
      this.st.delTimer('1sec');
      this.timpUi = 0;

      /* get grade */
      let grade = await this.getRightAnswersFromDatabase();

      /* push data to database */
      let dataToSave = {
          studentUID: localStorage.getItem('uid'),
          grade: grade,
          quizName: this.data.quizName,
          date: new Date().getTime()
    };

      let quizRef = firebase.database().ref( '/grades');
      quizRef.push(dataToSave);

      /* get previous block */
      firebase.database().ref('/blockchain/lastBlock').once('value').then(function (snapshot) {
        let lastBlock = snapshot.val();

        let block = null;
        let blockDataToSave = null;
        let hash = null;

        this.zone.runOutsideAngular(()=>{
          block = this.nextBlock(lastBlock, dataToSave);
          hash = block.mineBlock(3);

          /* add block to blockchain */
          blockDataToSave = {
            hash: hash
          };
        });

        firebase.database().ref('/blockchain').push(blockDataToSave);//this was genesis
        firebase.database().ref('/blockchain/lastBlock').set(hash);
      }.bind(this));
    }
    else{
      if(this.timpUi != 0)
        this.showMessage('You have unanswered questions!', 1500);
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private async getRightAnswersFromDatabase(){
    let nota = 0;
    let rightAnswers = new Array<string>(this.answers.length);

    firebase.database().ref(this.ansPath).once('value').then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(a =>{
        rightAnswers[a] = snapshot.child(a).child('answerType').val();
    });

      nota = this.getNota(rightAnswers);

    }.bind(this));
    await this.delay(300);
    return nota;
  }

  private getNota(rightAnswers){
    let points =0;
    let contor=0;

    for(let i = 0; i<rightAnswers.length; i++){
      if(rightAnswers[i] == this.answers[i])
        points++;
      contor++;
    }

    console.log('POINTS: ', points);
    return points;
  }

  ngOnDestroy(): void {
    this.st.delTimer('1sec');
  }

  onVoted(agree: string, i){
    this.answers[i] = agree; //write the selected option to the answers list
  }

  showMessage(msg: string, duration: number) {
    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: duration,
      data: {text: msg}
    });
  }
}
