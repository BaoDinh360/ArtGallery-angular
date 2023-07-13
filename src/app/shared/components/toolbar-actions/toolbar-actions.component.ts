import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-actions',
  templateUrl: './toolbar-actions.component.html',
  styleUrls: ['./toolbar-actions.component.css']
})
export class ToolbarActionsComponent implements OnInit {

  @Input() currentUserLogin ={
    id: '',
    email: '',
    username: ''
  };

  @Input() isSearchFunc: boolean = false;
  @Input() isCreateFunc: boolean = false;
  @Input() isEditFunc: boolean = false;
  @Input() isDeleteFunc: boolean = false;

  // @Output() onSearchEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() onToolbarActionEvent : EventEmitter<{actionType: string, data: any}> 
      = new EventEmitter<{actionType: string, data: any}>();

  get isUserLoggedIn() : boolean{
    return this.currentUserLogin.id !== '' && this.currentUserLogin.id !== undefined;
  }
  get isShowToolbarActions() : boolean{
    return this.isUserLoggedIn || this.isSearchFunc;
  }

  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {
  }

  onFilterSearch(){
    // this.onSearchEvent.emit();
    this.onToolbarActionEvent.emit({
      actionType: 'search',
      data: undefined
    });
  }

  openCreatePostPage(){
    this.router.navigate(['/post', this.currentUserLogin.username, 'create-post']);
  }

  openEditPostPage(){
    // if(this.post === undefined) return;

    // this.router.navigate(['post', this.post.author.username, 'edit-post', this.post._id]);
    this.onToolbarActionEvent.emit({
      actionType: 'edit',
      data: undefined
    });
  }

  deletePost(){
    this.onToolbarActionEvent.emit({
      actionType: 'delete',
      data: undefined
    });
  }
}
