import { Component, Input } from '@angular/core';
import { AlertStatus } from '../../models/enums';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  
  @Input() alertType : string = 'error';
  @Input() alertMsg! : string;

  alertStatus = AlertStatus;
}
