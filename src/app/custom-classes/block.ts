import {sha256} from 'js-sha256';

export class Block {
  index = 0;
  timestamp = null;
  data = null;
  prevHash = null;
  hash = null;
  nonce = 0;

  constructor(index: number, timestamp: any, data: any, prevHash: any,) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }


  private calculateHash(){
    return sha256(this.index + this.timestamp + this.data + this.prevHash + this.nonce);
  }

  public mineBlock(dificulty){
    //console.log('mining');
    while(this.hash.substring(0, dificulty) != Array(dificulty + 1).join("0")){
      //increment nonce
      this.nonce++;

      //recalculate hash value
      this.hash = this.calculateHash();

      //console.log('calculated hash: ', this.hash )
    }
    //console.log('block mined: ', this.hash)

    return this.hash;
  }
}

