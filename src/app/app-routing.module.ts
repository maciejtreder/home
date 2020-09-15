import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SpeakingComponent } from './speaking/speaking.component';
import { TeachingComponent } from './teaching/teaching.component';
import { WritingComponent } from './writing/writing.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'speaking', component: SpeakingComponent },
  { path: 'writing', component: WritingComponent },
  { path: 'teaching', component: TeachingComponent },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
