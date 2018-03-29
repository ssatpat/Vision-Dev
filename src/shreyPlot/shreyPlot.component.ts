/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges } from '@angular/core';
import {PiWebApiService} from '@osisoft/piwebapi';

@Component({
  selector: 'shrey-plot',
  templateUrl: './shreyPlot.component.html',
  styleUrls: ['./shreyPlot.component.css']
})
export class ShreyPlotComponent implements OnChanges {
  @Input() fgColor: string;
  @Input() bkColor: string;
  @Input() data: any;
  @Input() pathPrefix: string;
  output: string;
  values: any[];
  timestamps: any[];
  

  //constructor(public piwebapi: PiWebApiService) {
    
  //}
  //constructor(data: any){
  //  this.data = null
  //}

  ngOnInit(): void {
    this.data = null
  }
  ngOnChanges(changes) {
    if(changes.data){
      if (this.data.body.length == 0){
        this.values = null;
        //this.timestamps =null;
      }
      if (this.data.body.length > 1) {
        this.values = this.prettifyDataVals();
        this.timestamps = this.GetTimestamps();
      }
    }
  }

prettifyDataVals(){
  let v1:any[] = new Array();
  let v2:any[] = new Array();
  let vals: any = this.GetValues();
  for(var i = 0; i<this.data.body[1].events.length;i++){
    v1[i] = vals[0][i][0];
    v2[i] = vals[0][i][1];
    //console.log(v1,v2);
  }

  return v1
}

  //formatData() {
    //if (this.isDataValid()) {
      
      //var timestamp = this.data.body.timestamp
      //let timestamp: any[]
      //let value: any[]
      //var ev = this.data.body.map(r => ({events: r.events}))
      //return this.data.body.map(r => ({ path: r.path, value: this.formatValue(r.value), type: r.type}))
      //return this.data.body.map(r => ({ path: r.path, value: this.formatValue(r.value), timestamp: r.timestamp }));
      //return this.data.body.map(r => ({ path: r.path, value: r.value, timestamp: r.timestamp }));
    //} else {
    //  return [];
   // }
 // }

  GetValues(){
    let v: any[][][] = new Array();
    //let bod: any[] = this.GetBody()
    for(var i = 1; i<this.data.body.length;i++){
      v[i-1] = new Array();
      const attribute = this.data.body[i];
      for(var j = 0;j<attribute.events.length;j++){
        v[i-1][j] = new Array();
        const event = attribute.events[j];
        for(var k = 0;k<event.value.length;k++){
          v[i-1][j][k] = event.value[k];
          //console.log(event.value[k]);
        }
      }
    }
    //val = this.data.body[1].events["1"].value["1"];
    //console.log(v);
    return v;
  }


  GetTimestamps(){
    let t: any[][][] = new Array();
    //let bod: any[] = this.GetBody()
    for(var i = 1; i<this.data.body.length;i++){
      t[i-1] = new Array();
      const attribute = this.data.body[i];
      for(var j = 0;j<attribute.events.length;j++){
        t[i-1][j] = new Array();
        const event = attribute.events[j];
        for(var k = 0;k<event.timestamp.length;k++){
          t[i-1][j][k] = event.timestamp[k];
          //console.log(event.value[k]);
        }
      }
    }
    return t;

  }

  //private formatValue(value: any) {
    // very basic enumeration support
  //  if (value.Name) {
  //    return value.Name;
  //  }

  //  return value;
 // }

  private isDataValid(): boolean {
    return this.data && this.data.body && this.data.body.length;
  }

  private formatInfo() {
    let output = '';
    this.data.body.forEach(item => {
      output += item.path + '\n';
      output += item.timestamp + '\n';
      output += item.type + '\n';
      output += (item.good ? 'good' : 'bad') + ' data\n------------\n';
    });

    return output;
  }
}
