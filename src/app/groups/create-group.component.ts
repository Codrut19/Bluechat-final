import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'ns-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
  groupName: string = '';
  invitePhoneNumber: string = '';

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  async createGroup() {
    if (this.groupName.trim()) {
      try {
        // Assuming we store the user's phone number after login. You might need to implement a proper auth state management.
        const creatorPhoneNumber = '1234567890'; // Replace with actual logged-in user's phone number
        const groupId = await this.firebaseService.createGroup(this.groupName, creatorPhoneNumber);
        await this.firebaseService.addUserToGroup(groupId, creatorPhoneNumber);
        
        if (this.invitePhoneNumber) {
          await this.firebaseService.addUserToGroup(groupId, this.invitePhoneNumber);
        }
        
        console.log('Group created:', this.groupName);
        this.router.navigate(['/groups']);
      } catch (error) {
        console.error('Error creating group:', error);
        alert('An error occurred while creating the group. Please try again.');
      }
    } else {
      alert('Please enter a group name');
    }
  }
}