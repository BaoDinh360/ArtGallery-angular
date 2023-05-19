import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../shared/guards/auth.guard";
import { EditPageState } from "../shared/models/enums";
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { PostEditComponent } from "./post-edit/post-edit.component";

const routes: Routes = [
    { path : 'post/:author/create-post', component : PostEditComponent, canActivate : [AuthGuard], data: {pageState: EditPageState.CREATE}},
    { path : 'post/:author/edit-post/:id', component : PostEditComponent, canActivate : [AuthGuard], data: {pageState: EditPageState.EDIT}},
    { path : 'post/:author/:id', component : PostDetailComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class PostRoutingModule{}