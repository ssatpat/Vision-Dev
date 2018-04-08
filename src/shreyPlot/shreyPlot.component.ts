/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {PiWebApiService} from '@osisoft/piwebapi';
import Chart from 'chart.js';
import * as maths from 'mathjs';
import cov from 'compute-covariance';
import numeric from 'numeric';

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
    this.data = null;
  }


  ngOnChanges(changes) {
    if(changes.data){
      if (this.data.body.length == 0){
        this.values = null;
        //this.timestamps =null;
      }
      if (this.data.body.length > 1) {
        //this.values = this.prettifyDataVals();
        this.timestamps = this.GetTimestamps();
        //this.values = this.GetValues();
        //this.initChart('myChart');
        //this.initChart('myChart');
        const chart = new Charts('myChart', this.prettifyDataVals());
        chart.makeChart();
        // const chart2 = new Charts('myChart2', this.prettifyDataVals());
        // chart2.makeChart();

      }
    }
  }

prettifyDataVals(){
  let v1:any[] = new Array();
  let v2:any[] = new Array();

  let lol : { x:any, y:any} [] = new Array();

  //lol[0] = {x: 1, y: 1};

  let vals: any[][] = new Array();
  vals = this.GetValues();
  for(var i = 0; i<vals.length;i++){
    lol[i] = {x: vals[i][0], y: vals[i][1]};
    //console.log(v1,v2);
  }
  //this.data.body[1].events.length
  return lol
}

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

    var x: any[][] = new Array();
    for(var i =0;i<v[0].length;i++){
      x[i] = new Array();
      for(var j = 0; j<v.length+1;j++){
        if(j <=1){
          x[i][j] = v[0][i][j];
        }
        else{
          x[i][j] = v[j-1][i][1];
        }
      }

    }    
    let A: any;
    A = numeric.transpose(x);
    let mat: any[][] = new Array();
    mat = cov.apply(this, A);
    console.log(mat);
    let E : any[] = new Array();
    E = numeric.eig(mat);
    v = this.SubtractMean(x);
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

  private SubtractMean(v: any[][]){
    let n: any[][] = new Array();
    n = v;
    let mean : number[] = new Array();

    for(var j = 0; j<n[0].length;j++){
      mean[j] = 0.0;
      for(var i = 0; i<n.length;i++){
        mean[j] += (n[i][j] - mean[j])/(i + 1);
      }
    }

    for(var i  = 0; i<n.length;i++){
      for(var j = 0;j<n[0].length;j++){
        n[i][j] = n[i][j] - mean[j];
      }
    }
    // for(var i = 0; i<n[0].length;i++){
    //   console.log(mean[i]);
    // }
    return n;
  }


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

export class Charts{
  _name: string;
  _data: {x:any,y:any}[];

  constructor(name: string, data: {x:any,y:any}[]){
    this._data = data;
    this._name = name;
  }

  public makeChart(){
    const c = <HTMLCanvasElement> document.getElementById(this._name);
    const ctx =  c.getContext('2d');
    var scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'XY Data',
              data: this._data,
              backgroundColor: '#ff6384'
          }]
      },
      options: {
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'middle'
              }],
              
          },
          maintainAspectRatio: true
      }
  });
  }

  


}

