import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesListComponent } from './components/games-list/games-list.component';
import { GamesFormComponent } from './components/games-form/games-form.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/core/auth.guard.guard';

const routes: Routes = [
  {path: 'games', component: GamesListComponent},
  {path: 'forms', component: GamesFormComponent},
  {path: 'home', component: HomeComponent},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [GamesListComponent, GamesFormComponent, PageNotFoundComponent, 
HomeComponent, LoginComponent, RegisterComponent, UsersListComponent]
