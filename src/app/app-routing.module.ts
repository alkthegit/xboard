import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListPageComponent } from './components/pages/users-list-page/users-list-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/xboard'
  },
  {
    path: 'xboard',
    component: UsersListPageComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
