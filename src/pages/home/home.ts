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

  constructor(public navCtrl: NavController,private network:Network, private platform:Platform, private reiknivelService: ReiknivelService, private storage: Storage) {
   
    this.platform.ready().then(() => {
      if(this.network.type != 'none'){
        this.reiknivelService.getNewCurrency().subscribe(response =>{
          let res = response.rates;
          this.arr = [];
          for (let key in res){
            this.arr.push({'name':key,'rate':res[key]});
          }

          storage.set('items',this.arr);
          this.items = this.arr;
        });
      }else{
        storage.get('items').then(
          data => this.items = data
        );
      }

      storage.get('favorates').then(
        data => this.favorates = data
      ).then(() => {
        if (this.favorates != undefined) {
        } else {
          this.favorates = ['ISK', 'USD'];
          storage.set('favorates', this.favorates);
        }
        this.readyUp();
      })
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

  



  public removeItemFromFavorites(item){
    console.log(item);
    console.log("asdasd");
  }



  changingInput(e,item){
    console.log(e.value);
  }






  readyUp() {
    let temp = [];
    for (let key in this.items) {
      //console.log(this.items[key].name)
      //console.log('XXX ',this.favorates.includes(this.items[key].name));
      if (this.favorates.indexOf(this.items[key].name) > -1) {
        let t = this.items[key];
        Object.assign(t, {'visual':this.items[key].rate});
        temp.push(t);
      }
    }
    console.log(temp);
    this.favorates = temp;
  }

}
