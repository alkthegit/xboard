import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/users-list/user/user.component';
import { UserShortNamePipe } from './pipes/user-short-name.pipe';
import { UsersListPageComponent } from './components/pages/users-list-page/users-list-page.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { FormsModule } from '@angular/forms';
import { UserFioPipe } from './pipes/user-fio.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserShortNamePipe,
    UserFioPipe,
    UsersListComponent,
    UsersListPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
