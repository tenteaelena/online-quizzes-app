import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {MatDialog} from '@angular/material';
import {EditQuizComponent} from '../../dialogs/edit-quiz/edit-quiz.component';
import {QuizComponent} from '../../dialogs/quiz/quiz.component';

class Tree {
  node: Array<Node>;

  constructor() {
    this.node = [];
  }

  addNode(newNode: Node) {
    this.node.push(newNode);
    this.addChildToNode();
  }

  addChildToNode() {
    this.node.forEach(k => {
      if (k.data == this.node[this.node.length - 1].parent) {
        k.addChild(this.node[this.node.length - 1].data);
      }
    });
  }

  quizezLeafs() {
    let numberOfLeafs = 0;
    let leafs = [];

    this.node.forEach(a => {
      if (a.children.length === 0 && a.parent != 'users') {
        leafs[numberOfLeafs] = a.data;
        numberOfLeafs++;
      }
    });

    return leafs;
  }

  getParentOfNode(nodeData: string) {
    let parent = '';
    this.node.forEach(a => {
      if (a.data == nodeData)
        parent = a.parent;
    });

    return parent;
  }
}

class Node {
  data: string;
  parent: string;
  children: Array<string>;

  constructor(data: string, parent: string) {
    this.data = data;
    this.parent = parent;
    this.children = [];
  }

  addChild(nodeChild: string) {// adding a child to the parent
    this.children.push(nodeChild);
  }
}

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  quizList: Array<string>;
  questionNumberList: Array<string>;

  path = 'users/' + localStorage.getItem('uid') + '/quizez';

  path2 = 'users/';
  tree: Tree = new Tree();

  finish = false;

  intrebari: Array<number>;

  ngOnInit() {
    this.quizList = [];
    this.questionNumberList = [];

    this.finish = false;

    this.extractDataFromDatabase();


  }

  private extractDataFromDatabase() {

    this.tree.addNode(new Node('users', null));
    let numQuiz = 0;
    this.intrebari = [];
    firebase.database().ref(this.path2).once('value').then(function (snapshot) {
      Object.keys(snapshot.val()).forEach(a => {//users
        let user = snapshot.child(a + '/loginInfo/name').val() + ' ' + snapshot.child(a + '/loginInfo/surname').val();
        //-----if creator name egal cu numele dat then do the rest
        this.tree.addNode(new Node(user, 'users'));
        if (snapshot.child(a + '/quizez').val() != null) {//check if they have quizez
          Object.keys(snapshot.child(a + '/quizez').val()).forEach(b => {
            this.tree.addNode(new Node(b, user));
            Object.keys(snapshot.child(a + '/quizez/' + b + '/Questions').val()).forEach(c => {
              this.intrebari[numQuiz] = snapshot.child(a + '/quizez/' + b + '/Questions').numChildren();
            });
            numQuiz++;
          });
        }//end if


      });

      this.finish = true;

    }.bind(this));
  }

  public onStartQuiz(quizName: any, quizCreator){
    const dialogRef = this.dialog.open(QuizComponent, {
      width: '80%',
      data: {path: this.path2,
        creator: quizCreator,
        quizName: quizName},
      autoFocus: false
    });
  }
}
