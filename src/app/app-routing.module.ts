import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { PersonListComponent } from './components/person-list/person-list.component';

const routes: Routes = [
  { path: '', component: PersonListComponent },
  { path: 'contacts/:personId', component: ContactListComponent },
  { path: '**', component: PersonListComponent },  // Wildcard route for initial page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
