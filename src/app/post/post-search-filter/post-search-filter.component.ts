import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-search-filter',
  templateUrl: './post-search-filter.component.html',
  styleUrls: ['./post-search-filter.component.css']
})
export class PostSearchFilterComponent implements OnInit {

  @Input() isUserSignedIn: boolean = false;
  @Output() openCreatePostEvent : EventEmitter<any> = new EventEmitter<any>();
  @Output() filterSearchEvent : EventEmitter<any> = new EventEmitter<any>();
  currentLoginUsername!: string;

  filterSearch = {
    postName: undefined,
    authorName: undefined
  }

  constructor(
  ){}

  ngOnInit(): void {

  }

  onFilterSearch(){
    this.filterSearchEvent.emit(this.filterSearch);
  }

  openCreatePost(){
    this.openCreatePostEvent.emit();
  }
}
