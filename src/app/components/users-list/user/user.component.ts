import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, UserStatus } from 'src/app/models/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public readonly UserStatus = UserStatus;
  @Input() user: User;
  @Input() displayMode: 'card' | 'line' = 'card';
  @Input() disabled = false;

  @Output() click = new EventEmitter<Event>();
  @Output() deleteMe = new EventEmitter<Event>();

  constructor() { }

  ngOnInit(): void {
  }

  public onUserClick(event: Event): void {
    event.stopPropagation();
    this.click.emit(event);
  }

  public onDeleteUser(user: User, event: Event): void {
    event.stopPropagation();

    if (user.selected) {
      return;
    }

    this.deleteMe.emit(event);
  }

}
