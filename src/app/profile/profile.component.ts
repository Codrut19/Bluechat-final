import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import * as imagepicker from "@nativescript/imagepicker";

@Component({
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  displayName: string = '';
  profilePictureUrl: string = '';
  isDarkMode: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    // TODO: Replace with actual logged-in user's phone number
    const userProfile = await this.firebaseService.getUserProfile('1234567890');
    this.displayName = userProfile.displayName || '';
    this.profilePictureUrl = userProfile.profilePictureUrl || '';
    this.isDarkMode = userProfile.darkMode || false;
  }

  async updateProfile() {
    try {
      // TODO: Replace with actual logged-in user's phone number
      await this.firebaseService.updateUserProfile('1234567890', this.displayName);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

  async changeProfilePicture() {
    let context = imagepicker.create({
      mode: "single"
    });
    
    const selection = await context.authorize();
    const selected_item = await selection.present();

    if (selected_item.length > 0) {
      const imageAsset = selected_item[0];
      try {
        // TODO: Replace with actual logged-in user's phone number
        await this.firebaseService.updateUserProfile('1234567890', this.displayName, imageAsset);
        alert('Profile picture updated successfully');
      } catch (error) {
        console.error('Error updating profile picture:', error);
        alert('Failed to update profile picture. Please try again.');
      }
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // TODO: Implement dark mode toggle in app.component.ts
    // this.appComponent.setDarkMode(this.isDarkMode);
  }
}