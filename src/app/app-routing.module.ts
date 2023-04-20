import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostEditComponent } from './post/post-edit/post-edit.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UserInfoComponent } from './user/user-info/user-info.component';

const routes: Routes = [
  { path : '', component : PostListComponent},
  { path : 'post-list', component : PostListComponent},
  { path : 'post-edit', component : PostEditComponent, canActivate : [AuthGuard]},
  // { path : 'user-info', component : UserInfoComponent, canActivate : [AuthGuard]},
  //Lazy load UserModule
  {
    path : 'user-info',
    loadChildren : () => import('./user/user.module').then(m => m.UserModule)
  },
  { path : '**', redirectTo : '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [PostListComponent, PostEditComponent];
