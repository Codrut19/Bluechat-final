import { Component, OnInit, OnDestroy } from '@angular/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-messaging';
import { FirebaseService } from './services/firebase.service';
import { ApplicationSettings } from '@nativescript/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async ngOnInit() {
    await this.initializeFirebase();
    await this.initPushNotifications();
    this.initDarkMode();
    this.checkAuthState();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private async initializeFirebase() {
    try {
      const firebaseConfig = {
        // Your Firebase configuration object goes here
        // You can find this in your Firebase project settings
      };
      await firebase().initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }

  private async initPushNotifications() {
    try {
      const messaging = firebase().messaging();
      const token = await messaging.getToken();
      if (token) {
        await this.firebaseService.registerPushToken(token);
      }

      messaging.onMessage((message) => {
        console.log('New message', message);
        // TODO: Handle incoming message when app is in foreground
      });

      messaging.onNotificationOpened((message) => {
        console.log('Notification opened', message);
        // TODO: Handle notification tap
      });
    } catch (error) {
      console.error("Error initializing push notifications:", error);
    }
  }

  private initDarkMode() {
    const isDarkMode = ApplicationSettings.getBoolean('darkMode', false);
    this.setDarkMode(isDarkMode);
  }

  setDarkMode(enable: boolean) {
    ApplicationSettings.setBoolean('darkMode', enable);
    if (enable) {
      document.body.classList.add('ns-dark');
    } else {
      document.body.classList.remove('ns-dark');
    }
  }

  private checkAuthState() {
    this.userSubscription = this.firebaseService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/groups']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}