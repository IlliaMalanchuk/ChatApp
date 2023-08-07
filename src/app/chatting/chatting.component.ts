import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.css']
})
export class ChattingComponent implements OnInit{
  @Output() contentEmitter = new EventEmitter();
  messageContent: string = '';
  constructor() {}

  ngOnInit(): void {
  }

  sendMessage(){
    if(this.messageContent.trim() !== ""){
      this.contentEmitter.emit(this.messageContent);
    }

    this.messageContent = '';
  }
}
