import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material-ui/material.module";
import { SharedModule } from "../shared/shared.module";
import { PostListComponent } from "./post-list/post-list.component";
import { PostEditComponent } from "./post-edit/post-edit.component";
import { MyPostListComponent } from './my-post-list/my-post-list.component';
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { PostRoutingModule } from "./post-routing.module";
import { PostListItemComponent } from './post-list/post-list-item/post-list-item.component';
import { PostSearchFilterComponent } from "./post-search-filter/post-search-filter.component";



@NgModule({
    declarations: [
        PostListComponent,
        PostEditComponent,
        MyPostListComponent,
        PostDetailComponent,
        PostListItemComponent,
        PostSearchFilterComponent,
      ],
      imports: [
        PostRoutingModule,
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      exports :[
        PostListComponent,
        PostEditComponent,
        MyPostListComponent,
        PostDetailComponent,
      ]
})
export class PostModule{}