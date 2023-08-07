import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userName: string = '';
  private chatConnection?: HubConnection
  public onlineUsers: string[] = [];
  public messages: Message[] = [];

  constructor(private httpClient: HttpClient) {}

  public registerUser(user: User){
    return this.httpClient.post(`${environment.apiUrl}api/chat/register-user`, user, {responseType: 'text'});
  }

  createChatConnection(){
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}hubs/chat`).withAutomaticReconnect().build();

      this.chatConnection.start().catch(error => console.log(error));

      this.chatConnection.on('UserConnected', () => {
        this.addUserConnectionId();
      });

      this.chatConnection.on('OnlineUsers', (onlineUsers) => {
        this.onlineUsers = [...onlineUsers];
      });

      this.chatConnection.on('NewMessage', (newMessage: Message) => {
        this.messages = [...this.messages, newMessage];
      })
  }

  stopChatConnection(){
    this.chatConnection?.stop().catch(error => console.log(error));
  }

  public async addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.userName)
    .catch(error => console.log(error)
    );
  }

  async sendMessage(content: string){
    const message: Message = {
      from: this.userName,
      content
    };

    return this.chatConnection?.invoke('ReceiveMessage', message)
    .catch(error => console.log(error));
  }
}
