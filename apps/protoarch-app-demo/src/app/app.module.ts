import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AbModule } from '@protoarch.angular/ab';
//import { AbTestsModule } from '@lcgroup.core/ab-tests';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AbModule.forRoot([
      {
        versions: ['old', 'new'],
        versionForCrawlers: 'old',
        expiration: 45,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
