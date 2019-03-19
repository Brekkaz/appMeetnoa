import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './components/user/login/login.module#LoginModule'
  },
  {
    path: 'login',
    redirectTo: ''
  },
  {
    path: 'user',
    loadChildren: './components/user/profile/profile.module#ProfileModule'
  }/*,
  {
    path: '**',
    redirectTo: 'not-found'
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
