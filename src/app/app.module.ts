import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptFormsModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ChatComponent } from './chat/chat.component'
import { LoginComponent } from './login/login.component'
import { GroupsComponent } from './groups/groups.component'
import { CreateGroupComponent } from './groups/create-group.component'
import { CallComponent } from './call/call.component'
import { ProfileComponent } from './profile/profile.component'
import { GroupInfoComponent } from './group-info/group-info.component'

import { FirebaseService } from './services/firebase.service'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, NativeScriptFormsModule, AppRoutingModule],
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    GroupsComponent,
    CreateGroupComponent,
    CallComponent,
    ProfileComponent,
    GroupInfoComponent
  ],
  providers: [FirebaseService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}