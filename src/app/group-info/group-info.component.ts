import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'ns-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {
  groupId: string;
  groupName: string;
  members: string[] = [];
  newMemberPhone: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.groupId = params['groupId'];
      await this.loadGroupInfo();
    });
  }

  async loadGroupInfo() {
    try {
      const groupInfo = await this.firebaseService.getGroupInfo(this.groupId);
      this.groupName = groupInfo.name;
      this.members = await this.firebaseService.getGroupMembers(this.groupId);
    } catch (error) {
      console.error('Error loading group info:', error);
      alert('Failed to load group information. Please try again.');
    }
  }

  async addMember() {
    if (this.newMemberPhone.trim()) {
      try {
        await this.firebaseService.addUserToGroup(this.groupId, this.newMemberPhone);
        this.members.push(this.newMemberPhone);
        this.newMemberPhone = '';
        alert('Member added successfully');
      } catch (error) {
        console.error('Error adding member:', error);
        alert('Failed to add member. Please try again.');
      }
    }
  }

  async removeMember(memberPhone: string) {
    try {
      await this.firebaseService.removeUserFromGroup(this.groupId, memberPhone);
      this.members = this.members.filter(member => member !== memberPhone);
      alert('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    }
  }

  goBack() {
    this.router.navigate(['/chat'], { queryParams: { groupId: this.groupId } });
  }
}