import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

interface Group {
  id: string;
  name: string;
  members: { [key: string]: boolean };
}

@Component({
  selector: 'ns-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    try {
      this.groups = await this.firebaseService.getGroups();
    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('An error occurred while fetching groups. Please try again.');
    }
  }

  onGroupTap(groupId: string) {
    this.router.navigate(['/chat'], { queryParams: { groupId } });
  }

  createGroup() {
    this.router.navigate(['/create-group']);
  }

  async signOut() {
    try {
      await this.firebaseService.signOut();
      // Navigation is handled by app.component.ts based on auth state
    } catch (error) {
      console.error('Error signing out:', error);
      alert('An error occurred while signing out. Please try again.');
    }
  }
}