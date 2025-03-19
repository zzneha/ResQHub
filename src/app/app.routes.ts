import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeroComponent } from './hero/hero.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './volunteer/dashboard/dashboard.component';
import { CampFormComponent } from './volunteer/camps/camp-form.component';
import { CampListComponent } from './volunteer/camps/camp-list.component';
import { CampResidentFormComponent } from './volunteer/residents/camp-resident-form.component';
import { AuthGuard } from './guards/auth.guard';
import { PostListComponent } from './volunteer/posts/post-list.component';
import { PostFormComponent } from './volunteer/posts/post-form.component';
import { GameEmbedComponent } from './game/game.embed.component';
import { PublicForumComponent } from './forum/forum.component';
import { CampResidentsComponent } from './volunteer/residents/residents.component';
import { ReportRetrievalComponent } from './report/reportretrive.component';
import { SearchComponent } from './volunteer/residents/search.component';
import { FindShelterComponent } from './shelter/findshelter.component';
import { SosComponent } from './sos/sos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'report', component: ReportComponent },
  { path: 'home', component: HeroComponent },
  {path:'forum',component:PublicForumComponent},
  {path : 'training',component:GameEmbedComponent},
  {path :'sos',component :SosComponent},
  {path:'shelters',component:FindShelterComponent},
  { 
    path: 'volunteer',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'camps/new', component: CampFormComponent },
      { path: 'camps/edit/:id', component: CampFormComponent },
      { path: 'camps/:campId/residents/new', component: CampResidentFormComponent },
      { path: 'camps', component: CampListComponent },
      { path: 'forum', component: PostListComponent },
      { path: 'camps/:id/residents',component:CampResidentsComponent},
      {path: 'posts', component: PostListComponent},
      {path: 'posts/new', component: PostFormComponent},
      {path: 'posts/edit/:id', component: PostFormComponent},
      {path: 'reportsr' , component: ReportRetrievalComponent},
      {path :'search',component: SearchComponent}
    ]
  },
  { 
    path: 'account', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '/home' } // Catch-all for unknown routes
];
