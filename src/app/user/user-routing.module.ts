import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPostListComponent } from './user-post-list/user-post-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PostDetailComponent } from '../post/post-detail/post-detail.component';
import { MyPostListComponent } from '../post/my-post-list/my-post-list.component';

const routes: Routes = [
  {
    // path : ':username',
    // children:[
    //   {
    //     path: 'profile',
    //     component: UserProfileComponent,
    //     canActivate : [AuthGuard]
    //   },
    //   {
    //     path: 'posts',
    //     component: UserPostListComponent,
    //     canActivate: [AuthGuard]
    //   }
    // ]
    path: 'profile',
    component: UserProfileComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'posts',
    children:[
      {
        path: '',
        component: MyPostListComponent,
      },
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

export const UserRoutingComponents = [UserInfoComponent];