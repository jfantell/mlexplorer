import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { ChartComponent } from './chart/chart.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessagesComponent } from './messages/messages.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectComponent } from './project/project.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ExperimentService } from './experiment.service';
import { AuthService } from './auth.service';
import { TokeninterceptorService } from './tokeninterceptor.service';
import { MessagesService } from './messages.service';
import { ProjectService } from './project.service';
import { ProfileService } from './profile.service';

import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    ChartComponent,
    ExperimentComponent,
    LoginComponent,
    RegisterComponent,
    MessagesComponent,
    PageNotFoundComponent,
    ProjectComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: [
    AuthService, 
    AuthGuard, 
    ExperimentService,
    ProjectService,
    MessagesService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeninterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
