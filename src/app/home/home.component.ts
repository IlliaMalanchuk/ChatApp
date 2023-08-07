import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public userForm: FormGroup = new FormGroup({});
  public submitted = false;
  public openChat = false;

  constructor(private formBuilder: FormBuilder, private chatService: ChatService) {}


  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(){
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  submitForm() {
    this.submitted = true;

    if(this.userForm.valid){
      this.chatService.registerUser(this.userForm.value).subscribe({
        next: () => {
          this.chatService.userName = this.userForm.get('name')?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
      });
    }
  }

  public closeChat(){
    this.openChat = false;
  }
}
