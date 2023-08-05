import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ChatComponent } from './components/chat/chat.component';
// Import stompjs and sockjs-client modules
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { StompRService } from '@stomp/ng2-stompjs';
import { ChatRoomComponent } from './chat-room/chat-room.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [StompRService],
  bootstrap: [AppComponent]
})
export class AppModule { }
