import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import * as imagepicker from "@nativescript/imagepicker";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  imageUrl?: string;
  reactions?: { [key: string]: { [key: string]: boolean } };
}

@Component({
  selector: 'ns-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  groupId: string;
  searchQuery: string = '';
  private messageListener: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.groupId = params['groupId'];
      this.loadMessages();
    });
  }

  ngOnDestroy() {
    if (this.messageListener) {
      this.messageListener();
    }
  }

  loadMessages() {
    this.messageListener = this.firebaseService.getMessages(this.groupId, (newMessages) => {
      this.messages = [...this.messages, ...newMessages];
    });
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: '', // Firebase will generate this
        text: this.newMessage,
        sender: '1234567890', // Replace with actual logged-in user's phone number
        timestamp: Date.now()
      };

      try {
        await this.firebaseService.sendMessage(this.groupId, message);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  }

  async sendImage() {
    let context = imagepicker.create({
      mode: "single"
    });
    
    const selection = await context.authorize();
    const selected_item = await selection.present();

    if (selected_item.length > 0) {
      const imageAsset = selected_item[0];
      try {
        const imageUrl = await this.firebaseService.uploadImage(imageAsset);
        const message: Message = {
          id: '',
          text: '',
          sender: '1234567890', // Replace with actual logged-in user's phone number
          timestamp: Date.now(),
          imageUrl: imageUrl
        };
        await this.firebaseService.sendMessage(this.groupId, message);
      } catch (error) {
        console.error('Error sending image:', error);
        alert('Failed to send image. Please try again.');
      }
    }
  }

  async addReaction(messageId: string, reaction: string) {
    try {
      await this.firebaseService.addReactionToMessage(this.groupId, messageId, reaction, '1234567890'); // Replace with actual logged-in user's phone number
    } catch (error) {
      console.error('Error adding reaction:', error);
      alert('Failed to add reaction. Please try again.');
    }
  }

  async removeReaction(messageId: string, reaction: string) {
    try {
      await this.firebaseService.removeReactionFromMessage(this.groupId, messageId, reaction, '1234567890'); // Replace with actual logged-in user's phone number
    } catch (error) {
      console.error('Error removing reaction:', error);
      alert('Failed to remove reaction. Please try again.');
    }
  }

  async searchMessages() {
    if (this.searchQuery.trim()) {
      try {
        this.messages = await this.firebaseService.searchMessages(this.groupId, this.searchQuery);
      } catch (error) {
        console.error('Error searching messages:', error);
        alert('Failed to search messages. Please try again.');
      }
    } else {
      this.loadMessages();
    }
  }

  goBack() {
    this.router.navigate(['/groups']);
  }

  startCall(type: 'audio' | 'video') {
    this.router.navigate(['/call'], { queryParams: { type } });
  }

  openGroupInfo() {
    this.router.navigate(['/group-info'], { queryParams: { groupId: this.groupId } });
  }
}