import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserInfoComponent } from './user-info/user-info.component';

const routes: Routes = [
  {
    path : '',
    component : UserInfoComponent,
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

export const UserRoutingComponents = [UserInfoComponent];