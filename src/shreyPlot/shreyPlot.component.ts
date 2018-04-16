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


export class ShreyPlotComponent implements OnChanges, OnInit {
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
      }
      if (this.data.body.length > 1) {
        const chart = new Charts('Biplot', this.GetValues(), this.GetTimestamps());
        chart.makeChart();

      }
    }
  }



  GetValues(){
    let v: any[][][] = new Array();
    for(var i = 1; i<this.data.body.length;i++){
      v[i-1] = new Array();
      const attribute = this.data.body[i];
      for(var j = 0;j<attribute.events.length;j++){
        v[i-1][j] = new Array();
        const event = attribute.events[j];
        for(var k = 0;k<event.value.length;k++){
          v[i-1][j][k] = event.value[k];
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

    let mat: any[][] = new Array();
    mat = cov.apply(this, A);
    
    var E = numeric.eig(mat);
    let lambda :any[]= new Array();
    lambda = E.lambda.x;
    var lambda_sort = lambda.sort;

    let eigV: any[] = new Array(lambda.length);
    for(var i = 0;i<lambda.length;i++){
      eigV[i] = lambda[i];
    }
    const barChart = new BarChart('ScreePlot', eigV);
    barChart.makeChart();

    let FD: any[][] = new Array();
    FD = numeric.dot(E.E.x, A);
    x = numeric.transpose(FD);

    let drilling : { x:any, y:any} [] = new Array();
    let complete : { x:any, y:any} [] = new Array();
    let completing : { x:any, y:any} [] = new Array();
    let ct_d : number = 0;
    let ct_com : number = 0;
    let ct_ing : number = 0;

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
    for(var i = 1; i<this.data.body.length;i++){
      t[i-1] = new Array();
      const attribute = this.data.body[i];
      for(var j = 0;j<attribute.events.length;j++){
        t[i-1][j] = new Array();
        const event = attribute.events[j];
        for(var k = 0;k<event.timestamp.length;k++){
          t[i-1][j][k] = event.timestamp[k];
        }
      }
    }

    let time: any[] = new Array();
    for(var i = 0; i<t.length;i++){
      time[i] = t[0][i][0]
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
    return n;
  }

}

export class Charts{
  _name: string;
  _data: any;
  _time: any;

  constructor(name: string, data: any, time: any){
    this._data = data;
    this._name = name;
    this._time = time;
  }

  public makeChart(){
    
    const c = <HTMLCanvasElement> document.getElementById(this._name);
    const ctx =  c.getContext('2d');
    
    var scatterChart = new Chart(ctx, {
      type: 'scatter',
      data: this._data,
      time: this._time,
      options: {
          title: {
            display: true,
            text: 'PC1 vs PC2'
          },

          responsive: true,
          hoverMode: 'single',
          events: ['click'],
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItem, data, time) { 
                     var label = time[tooltipItem.datasetIndex];
                    return label;
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

  public makeBarChart(){
    const c = <HTMLCanvasElement> document.getElementById(this._name);
    const ctx =  c.getContext('2d');

    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: this._data,    
      options: {
          title: {
            display: true,
            text: 'Scree Plot'
          }
        }

    });
  }
}

export class BarChart{
  _name: string;
  _data: any;

  constructor(name: string, data: any){
    this._name = name;
    this._data = data;
  }

  public makeChart(){
    
    let label: any[] = new Array(this._data.length);
    for(var i = 0; i<this._data.length;i++){
      label[i] = i+1;
    }
    const c = <HTMLCanvasElement> document.getElementById(this._name);
    const ctx =  c.getContext('2d');
    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [{
            label: 'Eigenvalues',
            data: this._data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        }]
      },    
      options: {
        title: {
          display: true,
          text: 'Scree Plot'
        }
      }
    });


  }

}





