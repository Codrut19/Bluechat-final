import { Injectable } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-database';
import '@nativescript/firebase-storage';
import '@nativescript/firebase-messaging';
import '@nativescript/firebase-auth';
import { ImageAsset } from '@nativescript/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private confirmationResult: any;
  private _currentUser = new BehaviorSubject<any>(null);

  constructor() {
    this.initializeFirebase();
  }

  get currentUser$(): Observable<any> {
    return this._currentUser.asObservable();
  }

  private async initializeFirebase() {
    await firebase().initializeApp();
    firebase().auth().onAuthStateChanged((user) => {
      this._currentUser.next(user);
    });
  }

  async registerUser(phoneNumber: string): Promise<void> {
    try {
      this.confirmationResult = await firebase().auth().signInWithPhoneNumber(phoneNumber);
    } catch (error) {
      console.error('Error during phone authentication:', error);
      throw error;
    }
  }

  async verifyPhoneNumber(verificationCode: string): Promise<void> {
    if (!this.confirmationResult) {
      throw new Error('No confirmation result available');
    }
    try {
      const userCredential = await this.confirmationResult.confirm(verificationCode);
      const user = userCredential.user;
      const userRef = firebase().database().ref(`users/${user.uid}`);
      await userRef.set({ phoneNumber: user.phoneNumber });
    } catch (error) {
      console.error('Error during code verification:', error);
      throw error;
    }
  }

  async registerPushToken(token: string): Promise<void> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const tokenRef = firebase().database().ref(`users/${user.uid}/pushToken`);
    await tokenRef.set(token);
  }

  async createGroup(groupName: string): Promise<string> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const groupRef = firebase().database().ref('groups').push();
    await groupRef.set({
      name: groupName,
      creator: user.uid,
      members: { [user.uid]: true },
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
    return groupRef.key;
  }

  async getGroups(): Promise<any[]> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const groupsRef = firebase().database().ref('groups');
    const snapshot = await groupsRef.orderByChild(`members/${user.uid}`).equalTo(true).once('value');
    
    const groups = [];
    snapshot.forEach((childSnapshot) => {
      groups.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    return groups;
  }

  async sendMessage(groupId: string, message: any): Promise<void> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const messageRef = firebase().database().ref(`messages/${groupId}`).push();
    const sanitizedMessage = this.sanitizeMessage(message);
    await messageRef.set({
      ...sanitizedMessage,
      sender: user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }

  private sanitizeMessage(message: any): any {
    const sanitized = { ...message };
    if (sanitized.text) {
      sanitized.text = sanitized.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return sanitized;
  }

  async getUserProfile(): Promise<any> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const userRef = firebase().database().ref(`users/${user.uid}`);
    const snapshot = await userRef.once('value');
    return snapshot.val() || {};
  }

  async updateUserProfile(displayName: string, profilePicture?: ImageAsset): Promise<void> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const userRef = firebase().database().ref(`users/${user.uid}`);
    const updates: any = { displayName };

    if (profilePicture) {
      const imageUrl = await this.uploadImage(profilePicture);
      updates.profilePictureUrl = imageUrl;
    }

    await userRef.update(updates);
  }

  async uploadImage(imageAsset: ImageAsset): Promise<string> {
    const user = firebase().auth().currentUser;
    if (!user) throw new Error('No authenticated user');
    const imagePath = `images/${user.uid}/${Date.now()}.jpg`;
    const reference = firebase().storage().ref(imagePath);
    await reference.putFile(imageAsset.android || imageAsset.ios);
    return await reference.getDownloadURL();
  }

  async signOut(): Promise<void> {
    await firebase().auth().signOut();
  }
}