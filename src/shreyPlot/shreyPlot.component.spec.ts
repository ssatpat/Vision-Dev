/**
 * @license
 * Copyright © 2017-2018 OSIsoft, LLC. All rights reserved.
 * Use of this source code is governed by the terms in the accompanying LICENSE file.
 */
import { ShreyPlotComponent } from './shreyPlot.component';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing'
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { testOutputPath } from '../../test-utils';

describe('Component: ShreyPlotComponent', function () {

  @Component({
    selector: 'shrey-Plot',
    template: `
      <shreyPlot #shreyPlotComponent
        [fgColor]="fgColor"
        [bkColor]="bkColor"
        [data]="data"
        [pathPrefix]="pathPrefix"
      ></shreyPlot>
    `
  })
  class TestHostComponent {
    @ViewChild('shreyPlotComponent', { read: ShreyPlotComponent })
    target: ShreyPlotComponent;
    
    data: any;
    pathPrefix: string;
    fgColor: string = '#123456';
    bkColor: string = '#AA00BB';
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: ShreyPlotComponent;

  beforeEach(async(() => {

  }));

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports:      [ ],
      declarations: [ TestHostComponent, ShreyPlotComponent ],
      providers:    [ ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(ShreyPlotComponent, {
      // without the override, karma just attempts to load the html from http://localhost:9877/example.component.html
      set: {
        templateUrl: testOutputPath + 'shreyPlot/shreyPlot.component.html',
        styleUrls:  [testOutputPath + 'shreyPlot/shreyPlot.component.css']
      }
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      component = host.target;
      fixture.detectChanges();
    });
  });

   // very basic unit test example
   it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
