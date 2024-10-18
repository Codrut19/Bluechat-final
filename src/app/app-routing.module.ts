import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ChatComponent } from './chat/chat.component'
import { LoginComponent } from './login/login.component'
import { GroupsComponent } from './groups/groups.component'
import { CreateGroupComponent } from './groups/create-group.component'
import { CallComponent } from './call/call.component'
import { ProfileComponent } from './profile/profile.component'
import { GroupInfoComponent } from './group-info/group-info.component'

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'call', component: CallComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'group-info', component: GroupInfoComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}