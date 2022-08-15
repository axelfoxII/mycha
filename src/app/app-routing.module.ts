import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { VideosComponent } from './pages/videos/videos.component';
import { SubirVideosComponent } from './pages/subir-videos/subir-videos.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ControlWebComponent } from './pages/control-web/control-web.component';

const routes:Routes=[

  {path: 'login', component:LoginComponent},
  {path: 'home', component:HomeComponent, canActivate:[AuthGuard]},
  {path: 'videos', component:VideosComponent, canActivate:[AuthGuard]},
  {path: 'subir-videos', component:SubirVideosComponent, canActivate:[AuthGuard]},
  {path: 'control', component:ControlWebComponent, canActivate:[AuthGuard]},


  {path:'', pathMatch:'full', redirectTo:'/login'},
  {path:'**', pathMatch:'full', redirectTo:'/login'}

]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
