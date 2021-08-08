import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { AuthGuard } from './base/guards/auth.guard';
import { Urls } from './base/enums/enums';
import { HomeComponent } from './modules/home/home.component';
import { CashDeskComponent } from './modules/cash-desk/cash-desk.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: `/${Urls.AUTH}` },
  {
    path: Urls.HOME,
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Urls.CASSA_STANDARD,
    component: CashDeskComponent,
    canActivate: [AuthGuard],
  },
  { path: Urls.AUTH, component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
