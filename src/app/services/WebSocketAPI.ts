import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from '../app.component';

export class WebSocketAPI {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  appComponent: AppComponent;

  constructor(appComponent: AppComponent) {
    this.appComponent = appComponent;
  }

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // On error, schedule a reconnection attempt
  errorCallBack(error: string) {
    console.log("errorCallBack -> " + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
   * Send message to the server via web socket
   * @param {*} message
   */
  _send(message: string) {
    console.log("Calling WebSocket API to send message");
    const sender = this.appComponent.name;
    const payload = { sender, message };
    //app/invitations/send
    this.stompClient.send("/hello", {}, JSON.stringify(payload));
  }
  _sendHelloMessage(recipient: string, content: string) {
    const payload = {
      sender: this.appComponent.name,
      recipient,
      content,
      type: "chat"
    };
  }


  // Method to handle invitation sending
  _sendInvitation(message: string) {
    console.log("Calling WebSocket API to send invitation");
    const sender = this.appComponent.name;
    const payload = { sender, message };
    //app/invitations/send
    this.stompClient.send("/invitation", {}, JSON.stringify(payload));
  }
  onBroadcastReceived(message: any) {
    console.log("Broadcast Received from Server :: " + message);
    // Handle the broadcasted message here, e.g., add it to the messages list
    this.appComponent.handleMessage(JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    console.log("Message Received from Server :: " + message);
    this.appComponent.handleMessage(JSON.stringify(message.substring));
    /* const parsedMessage = JSON.parse(message);
       this.appComponent.handleMessage(parsedMessage.body);*/
  }
}
