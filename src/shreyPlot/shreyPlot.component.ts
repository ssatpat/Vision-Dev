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
//import PCA from 'ml-pca';
//import * as fs from 'fs';

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
        //this.values = this.GetValues();
        //this.initChart('myChart');
        //this.initChart('myChart');
        // let data : { x:any, y:any} [] = new Array();
        // data = this.prettifyDataVals();

        const chart = new Charts('myChart', this.GetValues());
        chart.makeChart();
        // chart.addData('myChart',null,data);

        // const chart2 = new Charts('myChart2', this.prettifyDataVals());
        // chart2.makeChart();

      }
    }
  }

prettifyDataVals(){
  let v1:any[] = new Array();
  let v2:any[] = new Array();

  let lol : { x:any, y:any} [] = new Array();
  let complete : { x:any, y:any} [] = new Array();
  let completing : { x:any, y:any} [] = new Array();

  //lol[0] = {x: 1, y: 1};

  let vals: any[][] = new Array();
  //vals = this.GetValues();
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
    var state: any[] = new Array();
    var x: any[][] = new Array();
    for(var i = 0;i<v[0].length;i++){
      state[i] = v[0][i][0].Name;
    }

    for(var i =0;i<v[0].length;i++){
      x[i] = new Array();
      for(var j = 0; j<v.length;j++){
        x[i][j] = v[j][i][1];
      }

    }    
    let A: any;
    x = this.SubtractMean(x);
    A = numeric.transpose(x);
    let pca: any[] = new Array();
    //pca = new PCA(x);

    let mat: any[][] = new Array();
    mat = cov.apply(this, A);
    
    var E = numeric.eig(mat);
    let lambda :any[]= new Array();
    lambda = E.lambda.x;
    var lambda_sort = lambda.sort
    

    //x = this.SubtractMean(x);
    let FD: any[][] = new Array();
    FD = numeric.dot(E.E.x, A);
    x = numeric.transpose(FD);

    let drilling : { x:any, y:any} [] = new Array();
    let complete : { x:any, y:any} [] = new Array();
    let completing : { x:any, y:any} [] = new Array();
    let ct_d : number = 0;
    let ct_com : number = 0;
    let ct_ing : number = 0;

    // let time: any[] = new Array();
    // time = this.GetTimestamps();
    for(var i = 0; i<x.length;i++){
      if(state[i] == "Drilling"){
        drilling[ct_d] = {x: x[i][0], y: x[i][1] };
        ct_d++;
      }
      if(state[i] == "Completing"){
        completing[ct_ing] = {x: x[i][0], y: x[i][1]};
        ct_ing++;
      }
      if(state[i] == "Complete"){
        complete[ct_com] = {x: x[i][0], y: x[i][1]};
        ct_com++;
      }
    }

    var scatterChartData = {
      datasets: [{
          label: "Drilling",
            data: drilling,
            backgroundColor: '#4286f4'
      },  {
          label: "Completing",
            data: completing,
            backgroundColor: '#e84d14'
      },  {
          label: "Complete",
            data: complete,
            backgroundColor: '#35c11d'
      }]
    }




    return scatterChartData;
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

    let time: any[] = new Array();
    //vals = this.GetValues();
    for(var i = 0; i<t.length;i++){
      time[i] = t[0][i][0]
      //console.log(v1,v2);
    }
  
    return time;

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
  _data: any;
  _time: any;

  constructor(name: string, data: any){
    this._data = data;
    this._name = name;
  }

  public makeChart(){
    
    const c = <HTMLCanvasElement> document.getElementById(this._name);
    const ctx =  c.getContext('2d');
    var scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: this._data,
      options: {
          responsive: true,
          hoverMode: 'single',
          events: ['click'],
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) { 
                   var multistringText = tooltipItems.xLabel + ' ' + tooltipItems.yLabel;
                   //var myArr =  this._time;
                      //  multistringText.push(this._time);
                      //  multistringText.push(tooltipItems.index+1);
                      //  multistringText.push('One more Item');
                    return multistringText;
                }
            }
          },
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


