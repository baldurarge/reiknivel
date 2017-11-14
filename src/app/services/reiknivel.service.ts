import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class ReiknivelService{
    http:any;
    baseUrl:String;

    constructor(http:Http){
        this.http = http;
        this.baseUrl = 'https://openexchangerates.org/api/latest.json?app_id=634d9b0b034a4e80b38943af47ef6c92';
    }

    getNewCurrency(){
        return this.http.get(this.baseUrl)
        .map(res => res.json());
    }

}