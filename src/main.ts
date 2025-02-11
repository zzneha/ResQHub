import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StatsComponent } from './app/components/stats/stats.component';
import { FeaturesComponent } from "./app/components/features/features.component";
import { IncidentReportingComponent } from "./app/components/incidentreport/incidentreport.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, StatsComponent, FeaturesComponent, IncidentReportingComponent], 
  template: `
    <app-header />
    <main class="min-h-screen bg-gray-50">
      <router-outlet /> 
      <app-stats></app-stats>
      <app-features></app-features>
      <app-incident-reporting></app-incident-reporting>
     
    </main>
    
    <app-footer />  
   
  `
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideAnimationsAsync()
  ]
});
