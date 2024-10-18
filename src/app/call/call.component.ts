import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {
  callType: 'audio' | 'video';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.callType = params['type'];
    });
  }

  endCall() {
    // Here you would typically end the call
    console.log('Ending call');
    // Navigate back to the chat
    // this.router.back();
  }
}