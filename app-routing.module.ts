import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingService } from './AppServices/appRoutingService';
import { BidsComponent } from './AppComponents/bids/bids.component';
// import { BidTemplatesComponent } from './AppComponents/bid-templates/bid-templates.component';
import { ProposalTemplatesComponent } from './AppComponents/proposal-templates/proposal-templates.component';
import { LocationComponent } from './AppComponents/Locations/LocationComponent';
import { Areatemplatecomponent } from './AppComponents/Calculator-AreaTemplates/Areatemplate.component';
import { ActivitiesComponent } from './AppComponents/Calculator-Activities/Activities.component';
import { StepsComponent } from './AppComponents/Calculator-Steps/Steps.component';
import { authorizecomponent } from './Authorize/authorize.component';
import { ManageBidComponent } from './AppComponents/manage-bid/manage-bid.component';
import { UnAuthorizedcomponent } from './AppComponents/UnAuthorized/UnAuthorizedcomponent';
import { Reportscomponent } from './AppComponents/Calculator-Reports/Reports.component';
import { mycalculation } from './AppComponents/MyCalculation/mycalculation.component';


const routes: Routes = [
  { path: 'unthorized', component: UnAuthorizedcomponent, data: ['unthorized', true] },
  // { path: 'Locations/:GuId', component: LocationComponent, canActivate: [AppRoutingService], data: ['Locations',true] },
  { path: 'Locations', component: LocationComponent, canActivate: [AppRoutingService], data: ['Locations',true] },
  { path: 'Areatemplates', component: Areatemplatecomponent, canActivate: [AppRoutingService], data: ['Areatemplates',true] },
  { path: 'Activities', component: ActivitiesComponent, canActivate: [AppRoutingService], data: ['Activities',true] },
  { path: 'Steps', component: StepsComponent, canActivate: [AppRoutingService], data: ['Steps', true] },
  { path: 'Reports', component: Reportscomponent, canActivate: [AppRoutingService], data: ['Reports', true] },
  { path: 'MyCalculation', component: mycalculation, canActivate: [AppRoutingService], data: ['MyCalculation', true] },

  //{ path: 'authorize/:GuId', component: authorizecomponent, data: ['authorize', true] },
  { path: 'authorize/:GuId/:userid', component: authorizecomponent, data: ['authorize',true] },
  { path: 'proposaltemplates', component: ProposalTemplatesComponent, canActivate: [AppRoutingService], data: ['proposaltemplates',true] },
  { path: 'managebid/:id', component: ManageBidComponent, canActivate: [AppRoutingService], data: ['Locations',true] },
  { path: 'bid/:id', component: BidsComponent, canActivate: [AppRoutingService], data: ['bid',true] },
  { path: '', redirectTo: '/Locations', pathMatch: 'full', canActivate: [AppRoutingService], data: ['Locations',true] },
  { path: '**', redirectTo: '/Locations', canActivate: [AppRoutingService], data: ['Locations',true] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AppRoutingService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
