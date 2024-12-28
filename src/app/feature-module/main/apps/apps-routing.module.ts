import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
// import { CalendarComponent } from './calendar/calendar.component';
// import { IncomingCallComponent } from './calls/incoming-call/incoming-call.component';
// import { OutgoingCallComponent } from './calls/outgoing-call/outgoing-call.component';
// import { VideoCallComponent } from './calls/video-call/video-call.component';
// import { VoiceCallComponent } from './calls/voice-call/voice-call.component';
// import { ChatsComponent } from './chat/chats/chats.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { EmailPagecontentComponent } from './emails/email-pagecontent/email-pagecontent.component';
import { EmailComposeComponent } from './emails/email-compose/email-compose.component';
import { EmailEmailviewComponent } from './emails/email-emailview/email-emailview.component';
import { FileManagerMainheadComponent } from './file-manager-mainHead/file-manager-mainhead.component';
import { AuthGuard } from '../dashboard/AuthGuard';

const routes: Routes = [
  { 
    path: '', 
    component: AppsComponent,
    children: [
      // { path: "chats", component: ChatsComponent },
      { path: "contacts", component: ContactsComponent,canActivate: [AuthGuard]  },
      // { path: "calendar", component: CalendarComponent },
      { path: "file-manager", component: FileManagerComponent,canActivate: [AuthGuard] },
      { path: "file-manager-mainhead", component: FileManagerMainheadComponent,canActivate: [AuthGuard] },
      // { path: "voice-call", component: VoiceCallComponent },
      // { path: "video-call", component: VideoCallComponent },
      // { path: "outgoing-call", component: OutgoingCallComponent },
      // { path: "incoming-call", component: IncomingCallComponent },
      {
        path: 'email',
        component: EmailPagecontentComponent
      },
      {
        path: 'mailview',
        component: EmailEmailviewComponent
      },
      {
        path:'compose',
        component:EmailComposeComponent
      },
    ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
