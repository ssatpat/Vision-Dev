/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {PiWebApiService} from '@osisoft/piwebapi';
import Chart from 'chart.js';

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

  private initChart() {

    let data:{
      x:any,
      y:any
    }[] =new Array();
    data = this.prettifyDataVals();
    const c = <HTMLCanvasElement> document.getElementById('myChart');
    const ctx =  c.getContext('2d');
    var scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Scatter Dataset',
              data: data
              // [{
              //     x: data[1].x,
              //     y: 0
              // }, {
              //     x: 0,
              //     y: 10
              // }, {
              //     x: 10,
              //     y: 5
              // }]
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

  addData(scatterChart, 'Scatter Dataset' , data);

  function addData(chart, label, data){
    chart.data.datasets[0].data.push(data);
    chart.update();

  }

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
        this.initChart();
      }
    }
  }

prettifyDataVals(){
  let v1:any[] = new Array();
  let v2:any[] = new Array();

  let lol : { x:any, y:any} [] = new Array();

  //lol[0] = {x: 1, y: 1};

  let vals: any = this.GetValues();
  for(var i = 0; i<this.data.body[1].events.length;i++){
    lol[i] = {x: vals[0][i][0], y: vals[0][i][1]};
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
