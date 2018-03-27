import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgLibrary, SymbolType, SymbolInputType, ConfigPropType } from './framework';
import { LibModuleNgFactory } from './module.ngfactory';

import { ShreyPlotComponent } from './shreyPlot/shreyPlot.component';

@NgModule({
  declarations: [ ShreyPlotComponent ],
  imports: [ CommonModule ] ,
  exports: [ ShreyPlotComponent ],
  entryComponents: [ ShreyPlotComponent ]
})
export class LibModule { }

export class ExtensionLibrary extends NgLibrary {
  module = LibModule;
  moduleFactory = LibModuleNgFactory;
  symbols: SymbolType[] = [
    {
      name: 'ShreyPlot-symbol',
      displayName: 'ShreyPlot Symbol',
      dataParams: { shape: 'single' },
      thumbnail: '^/assets/images/example.svg',
      compCtor: ShreyPlotComponent,
      inputs: [
        SymbolInputType.Data,
        SymbolInputType.PathPrefix
      ],
      generalConfig: [
        {
          name: 'Example Options',
          isExpanded: true,
          configProps: [
            { propName: 'bkColor', displayName: 'Background color', configType: ConfigPropType.Color, defaultVal: 'white' },
            { propName: 'fgColor', displayName: 'Color', configType: ConfigPropType.Color, defaultVal: 'black' }
          ]
        }
      ],
      layoutWidth: 200,
      layoutHeight: 100
    }
  ];
}
