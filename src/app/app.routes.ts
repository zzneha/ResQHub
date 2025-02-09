import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogComponent }, // Updated to include BlogComponent


  { path: 'training', component: HomeComponent }, // TODO: Create separate training component
  { path: 'shelters', component: HomeComponent } // TODO: Create shelters component
];
