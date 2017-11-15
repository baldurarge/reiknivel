import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { Network } from '@ionic-native/network';

import { ReiknivelService} from '../../app/services/reiknivel.service';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bank:String;
  items:any;
  arr:any;
  favorates:any;
  showAdding:boolean;
  firstLetter:string;
  firstTime:any;

  constructor(public navCtrl: NavController,private network:Network, private platform:Platform, private reiknivelService: ReiknivelService, private storage: Storage) {
    this.showAdding=true;
    this.firstLetter = "0";
    
    storage.get('firstTime').then(
      data => this.firstTime = data
    ).then(()=>{
      if(this.firstTime == undefined){
        this.firstTime = true;

      }
    });

    this.platform.ready().then(() => {
      if(this.network.type != 'none'){
        this.reiknivelService.getNewCurrency().subscribe(response =>{
          let res = response.rates;
          this.arr = [];
          for (let key in res){
            this.arr.push({'name':key,'rate':res[key],'checked':false});
          }
          storage.set('items',this.arr);
          this.items = this.arr;
          this.nextUp();
        });
      }else{
        storage.get('items').then(
          data => this.items = data
        );
        this.nextUp();
      }
    });



    /*storage.get('items').then((val)=>{
      if(val === null){
        this.getNewCurrency(()=> {
        });
      }else{
        this.items = val;
      }
    }).catch((error) =>{
      console.log('error ',error);
    });*/
  }


  nextUp(){
    this.storage.get('favorates').then(
      data => this.favorates = data
    ).then(() => {
      if (this.favorates != undefined) {
        console.log('FAVORATES STORAGE: ', this.favorates);                
        let temp = [];
        for (let key in this.items) {    
          for(let x in this.favorates){
            if (this.favorates[x].name.indexOf(this.items[key].name) > -1) {
              console.log(this.items[key]);
              let t = this.items[key];
              Object.assign(t, { 'visual': this.items[key].rate });
              temp.push(t);
              this.items[key].checked = true;
            }
          }   
            
        }
        this.favorates = temp;
        this.storage.set('favorates', this.favorates);


      } else {
        this.favorates = ['ISK', 'USD'];
        let temp = [];
        for (let key in this.items) {
          if (this.favorates.indexOf(this.items[key].name) > -1) {
            console.log(this.items[key]);
            let t = this.items[key];
            Object.assign(t, { 'visual': this.items[key].rate });
            temp.push(t);
            this.items[key].checked = true;
          }
        }
        this.favorates = temp;
        this.storage.set('favorates', this.favorates);
      }

      console.log(this.items);
    });

  }


  public removeItemFromFavorites(item){
    for(let key in this.favorates){
      if(this.favorates[key].name === item.name){
        var index = this.favorates.indexOf(this.favorates[key], 0);
        if (index > -1) {
          this.favorates.splice(index, 1);
        }
      }
    }
    this.storage.set('favorates', this.favorates);    
  }



  changingInput(event,item){
    //Find what the current is in USD

    let base = item.visual / item.rate;

    //Then calculate every line with the amount of USD
    for (var fave of this.favorates) {
      if(fave.name != item.name){
        fave.visual = (fave.rate * base).toFixed(2);
      }
    }

    /*
    ISK = 104,03
    GBP = 0,76
    EUR = 0,85
    USD = 1

    300 ISK => GBP
    300 / 104,03 = 2,884 USD
    2,884 * 0,76 = 2,19
    */
  }


  changeState(){
    this.showAdding = !this.showAdding;
  }

  lastLetter(item){
    var res = item.name.charAt(0);
    if (res.toString() != this.firstLetter.toString()){
      this.firstLetter = res;
      return res;
    }
  }

  getFirstLetter(item){
    return item.name.charAt(0);
  }


  readyUp() {
    let temp = [];
    for (let key in this.items) {
      if (this.favorates.indexOf(this.items[key].name) > -1) {
        let t = this.items[key];
        Object.assign(t, {'visual':this.items[key].rate});
        temp.push(t);
        this.items[key].checked = true;

      }
    }
    this.favorates = temp;
    
  }

  changeFavorates(item){
    /*for(let key in this.items){
      if(this.items[key].checked){
        console.log("Checked", this.items[key].name);
      }
    }*/
    let temp = [];
    item.checked = !item.checked;
    for(let key in this.items){
      if(this.items[key].checked){
        
        let t = this.items[key];
        Object.assign(t, { 'visual': this.items[key].rate });
        temp.push(t);
      }
    }
    this.favorates = temp;
    console.log(this.favorates);
    this.storage.set('favorates', this.favorates);
  }





  finishIntro(){
    this.firstTime = false;
    console.log('This is firstime!',this.firstTime)
    this.storage.set('firstTime',false);
  }


  inputClicked($event,i){
    i.visual = "";
  }

  showIntroAgain(){
    this.firstTime=true;
  }

}
