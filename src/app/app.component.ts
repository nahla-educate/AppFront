import { Component } from '@angular/core';
import { WebSocketAPI } from './services/WebSocketAPI';
import { HttpClient } from '@angular/common/http';
interface User {
  userId: number;
  userName: string;
  userMail: string;
  // Add more properties as needed
}
interface InvitationMessage {
  sender: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'coChat';
  userList: User[] = [];
  webSocketAPI!: WebSocketAPI;
  selectedRecipient: User | null = null;

  users: string[] = ['User1', 'User2', 'User3']; // Replace this with your list of users
  //selectedRecipient: User | null = null; // Store the selected recipient
 
  greeting: any;
  name: string = '';
  messageContent: string = '';
  messages: { sender: string, receiver: string, content: string }[] = [];

  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(this); // Pass the current instance of AppComponent
    this.fetchUserList();
  }
  fetchUserList() {
    this.http.get<User[]>('http://localhost:8080/api/auth/list').subscribe(
      (response) => {
        this.userList = response;
      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }

  connect() {
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  // Method to set the user's name during signup
  setUser(name: string) {
    this.name = name;
  }

 /* sendMessage() {
    if (this.messageContent.trim() === '' || this.selectedRecipient.trim() === '') {
      return; // Don't send empty messages or if the recipient is not selected
    }

    this.webSocketAPI._send(JSON.stringify({
      sender: this.name,
      recipient: this.selectedRecipient,
      content: this.messageContent
    }));

    // Add the sent message to the messages list
    this.messages.push({ sender: this.name, receiver: this.selectedRecipient, content: this.messageContent });
    this.messageContent = ''; // Clear the message input box after sending
  }

  sendInvitation() {
    if (this.selectedRecipient.trim() === '') {
      return; // Don't send invitations if the recipient is not selected
    }

    this.webSocketAPI._send(JSON.stringify({
      sender: this.name,
      recipient: this.selectedRecipient,
      content: "Invitation from " + this.name // Customize the invitation content as needed
    }));
  }
*/
sendMessage() {
 /* if (!this.selectedRecipient || !this.messageContent.trim()) {
    return; // Don't send empty messages or if the recipient is not selected
  }

  this.webSocketAPI._send(JSON.stringify({
    sender: this.name,
    recipient: this.selectedRecipient.userName,
    content: this.messageContent
  }));

  // Add the sent message to the messages list
  this.messages.push({ sender: this.name, receiver: this.selectedRecipient.userName, content: this.messageContent });
  this.messageContent = ''; // Clear the message input box after sending
*/
if (!this.selectedRecipient || !this.messageContent.trim()) {
  return; // Don't send empty messages or if the recipient is not selected
}

if (this.selectedRecipient.userName === this.name) {
  // Send a greeting message to oneself
  this.webSocketAPI._sendHelloMessage(this.name,this.messageContent);
} else {
  // Send a chat message to the selected recipient
  this.webSocketAPI._send(JSON.stringify({
    sender: this.name,
    recipient: this.selectedRecipient.userName,
    content: this.messageContent,
    type: "chat"
  }));
}  // Add the sent message to the messages list
this.messages.push({ sender: this.name, receiver: this.selectedRecipient.userName, content: this.messageContent });
this.messageContent = ''; // Clear the message input box after sending
}

sendInvitation() {
  if (!this.selectedRecipient) {
    return; // Don't send invitations if the recipient is not selected
  }

  this.webSocketAPI._sendInvitation("Invitation from " + this.name);

  /*if (!this.selectedRecipient) {
    return; // Don't send invitations if the recipient is not selected
  }
  

  this.webSocketAPI._send(JSON.stringify({
    sender: this.name,
    recipient: this.selectedRecipient.userName,
    content: "Invitation from " + this.name // Customize the invitation content as needed
  }));*/
}
selectUser(user: User) {
  // Set the selected recipient when a user is clicked from the search results
  this.selectedRecipient = user;
}

  searchUsers() {
    if (!this.searchQuery) {
      // Empty search query, clear the search results
      this.searchResults = [];
      return;
    }

    // Call the backend API to retrieve the search results
    this.http.get<any[]>(`http://localhost:8080/api/auth/users?userName=${this.searchQuery}`).subscribe(
      (response) => {
        this.searchResults = response;
        console.log('search results', response);
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }

  sendInvitationn(user: any) {
    if (!user || !user.userName) {
      return; // Invalid user, handle error if needed
    }
  
    console.log("Sending invitation to user:", user.userName);
  
    // Call the WebSocketAPI to send the invitation
    this.webSocketAPI._sendInvitation(JSON.stringify({ sender: this.name }));
    
    // Handle the invitation logic here, e.g., display a notification or confirmation message
    // You can customize this according to your requirements
    alert("Invitation sent to " + user.userName);
  }

  handleMessage(message: any) {
    console.log("Message Received from Server :: ", message);
    this.greeting = message;
    if (typeof message === "string") {
      // Parse the JSON data
      try {
        const parsedMessage = JSON.parse(message);
        // Now you can access properties of the parsed message and handle it accordingly
        console.log("Parsed Message:", parsedMessage);
        this.messages.push({ sender: parsedMessage.sender, receiver: parsedMessage.recipient, content: parsedMessage.content });
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    } else {
      console.error("Invalid message format:", message);
    }
  }
}
