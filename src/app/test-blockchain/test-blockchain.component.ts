import {Component, OnInit} from '@angular/core';
import {Block} from '../custom-classes/block';
import {AngularFireDatabase} from '@angular/fire/database';
import {DatabaseService} from '../services/database.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-test-blockchain',
  templateUrl: './test-blockchain.component.html',
  styleUrls: ['./test-blockchain.component.css']
})

export class TestBlockchainComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private ok: DatabaseService) {
  }

   genesisBlock = () => new Block(0, Date.now(), 'genesis block', '0');

   nextBlock = (lastBlock, data) => new Block(lastBlock.index + 1, Date.now(), data, lastBlock.hash);

  blockchain= null;
  previousBlock = null;

  ngOnInit() {
    //
    // //get users from database
    // let ref = this.db.database.ref('/users');
    // ref.on('value', function(snapshot){
    //   console.log('okee', snapshot.val())
    // })

    this.blockchain = [this.genesisBlock()];
    this.previousBlock = this.blockchain[0];

    // for (let i = 1; i < 20; i += 1) {
    //   const blockToAdd = this.nextBlock(this.previousBlock, `This is block #${i}`);
    //   this.blockchain.push(blockToAdd);
    //   this.previousBlock = blockToAdd;
    // }

  }




}
