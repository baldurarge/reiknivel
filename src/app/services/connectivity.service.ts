import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network';

@Injectable()
export class ConnectivityService {
    http: any;
    baseUrl: String;

    constructor(public network: Network) {

        
    }

    getNetwork(){
        console.log('The network: ',this.network.type);
    }

}