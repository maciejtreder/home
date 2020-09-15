import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { WritingComponent } from './writing/writing.component';
import { SpeakingComponent } from './speaking/speaking.component';
import { TeachingComponent } from './teaching/teaching.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    WritingComponent,
    SpeakingComponent,
    TeachingComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserTransferStateModule,
    TransferHttpCacheModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
