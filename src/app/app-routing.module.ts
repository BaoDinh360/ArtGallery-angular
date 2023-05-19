import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostEditComponent } from './post/post-edit/post-edit.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';
import { EditPageState } from './shared/models/enums';
import { PostRoutingModule } from './post/post-routing.module';

const routes: Routes = [
  { path : '', component : PostListComponent},
  // { path : 'post/:author/create-post', component : PostEditComponent, canActivate : [AuthGuard], data: {pageState: EditPageState.CREATE}},
  // {path : 'post/:author/edit-post/:id', component : PostEditComponent, canActivate : [AuthGuard], data: {pageState: EditPageState.EDIT}},
  // { path : 'post/:author/:id', component : PostDetailComponent},
  //Lazy load UserModule
  {
    path : 'user/:username',
    component : UserInfoComponent,
    loadChildren : () => import('./user/user.module').then(m => m.UserModule)
  },
  { path : '**', redirectTo : '', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PostRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
