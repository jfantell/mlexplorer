import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard'
import { ProjectComponent } from './project/project.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ExperimentComponent } from './experiment/experiment.component';


const routes: Routes = [
	{ 	
		path: '', 
		redirectTo: '/dashboard', 
		pathMatch: 'full' 
	},
	{ 	
		path: 'login', 
		component: LoginComponent
	},
	{ 
		path: 'register', 
		component: RegisterComponent 
	},
	{ 
		path: 'projects/:name', 
		canActivate: [AuthGuard],
		component: ProjectComponent 
	},
	{ 
		path: 'experiments/project/:name/id/:id', 
		canActivate: [AuthGuard],
		component: ExperimentComponent 
	},
	{ 
		path: 'dashboard', 
		canActivate: [AuthGuard],
		component: DashboardComponent 
	},
	{ 
		path: 'profile',
		canActivate: [AuthGuard],
		component: ProfileComponent 
	},
	{ 
		path: '**',
		redirectTo: '/404', 
	},
	{ 
		path: '404', 
		canActivate: [AuthGuard],
		component: PageNotFoundComponent 
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
