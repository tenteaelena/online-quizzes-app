import {Component, OnInit} from '@angular/core';
import {Block} from '../custom-classes/block';
import {AngularFireDatabase} from '@angular/fire/database';
import {DatabaseService} from '../services/database.service';

@Component({
  selector: 'app-test-blockchain',
  templateUrl: './test-blockchain.component.html',
  styleUrls: ['./test-blockchain.component.css']
})

export class TestBlockchainComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private ok: DatabaseService) {
    this.ok.vals.subscribe( (s) => {

    });
  }

   genesisBlock = () => new Block(0, Date.now(), 'genesis block', '0');

   nextBlock = (lastBlock, data) => new Block(lastBlock.index + 1, Date.now(), data, lastBlock.hash);

  blockchain= null;

  ngOnInit() {
    //
    // //get users from database
    // let ref = this.db.database.ref('/users');
    // ref.on('value', function(snapshot){
    //   console.log('okee', snapshot.val())
    // })

    this.blockchain = [this.genesisBlock()];
    let previousBlock = this.blockchain[0];

    for (let i = 1; i < 20; i += 1) {
      const blockToAdd = this.nextBlock(previousBlock, `This is block #${i}`);
      this.blockchain.push(blockToAdd);
      previousBlock = blockToAdd;
    }

    let block = this.nextBlock(previousBlock, "whatever");

    this.blockchain.push(block.mineBlock(3));

  }



}
