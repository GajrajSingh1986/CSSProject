import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BidsComponent } from './AppComponents/bids/bids.component';
import { BidTemplatesComponent } from './AppComponents/bid-templates/bid-templates.component';
import { ProposalTemplatesComponent } from './AppComponents/proposal-templates/proposal-templates.component';
import { ManageBidComponent } from './AppComponents/manage-bid/manage-bid.component';
import { customercomponent } from './AppComponents/Add-Customer/customer.component';
import { CustomDateFormat } from './AppComponents/Pipes/custom-date.pipes';
import { authorizecomponent } from './Authorize/authorize.component';
import { managebidservice } from './AppComponents/manage-bid/manage-bidservice'; 
import { ReactiveFormsModule } from '@angular/forms';
import { Bidupdate } from './AppComponents/bid-update/bidupdate.component'
import { Addareamodal } from './AppComponents/Add-area/Addarea-modal';
import { Bidstatus }  from './AppComponents/bid-status/Bidstatus.component';
import { bidcalculator } from './AppComponents/bidcalculator-modal/bid-calculator.component';
import { Appservice } from './AppServices/Appservice';
import { ResponseInterceptor } from './AppServices/ResponseInterceptor_Service';
import { Biddocument } from './AppComponents/BidDocument/biddocument.component';
import { DocumentMasterService } from './AppComponents/Services/GetMasterDocumentService';
import { BiddocumentService } from './AppComponents/Services/BidDocumentService';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { bidsservice }  from './AppComponents/Services/bidservice';
import { BidActivities } from './AppComponents/Activities-manage/Bidactivities.component';
import { ActivitiesService } from './AppComponents/Services/BidActivities.Service';
import { ProposalAddsection } from './AppComponents/proposal-Addsection/proposal-addsection';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LocationComponent } from './AppComponents/Locations/LocationComponent';
import { ActivitiesComponent } from './AppComponents/Calculator-Activities/Activities.component';
import { StepsComponent } from './AppComponents/Calculator-Steps/Steps.component';
import { StepsService } from './AppComponents/CalculatorService/StepsService';
import { NgxPaginationModule } from 'ngx-pagination';
import { FixtureService } from './AppComponents/CalculatorService/fixtureService';
import { AreaTemplateService } from './AppComponents/CalculatorService/AreaTemplateService';
import { Areatemplatecomponent } from './AppComponents/Calculator-AreaTemplates/Areatemplate.component';
import{ LocationService } from './AppComponents/CalculatorService/locationService';
import { buildingService } from './AppComponents/CalculatorService/buildingService';
import { roomService} from './AppComponents/CalculatorService/roomService';

import { UnAuthorizedcomponent } from './AppComponents/UnAuthorized/UnAuthorizedcomponent';
import { Authentication_Service } from './AppServices/appRoutingService'
import { Reportscomponent } from './AppComponents/Calculator-Reports/Reports.component';
import { ReportService } from './AppComponents/CalculatorService/ReportService';
import { mycalculation } from './AppComponents/MyCalculation/mycalculation.component';
import { GlobalAuthentication_Service } from './AppServices/GlobalAuthentication_Service';
import { Global_Service } from './AppServices/Global_Service';

@NgModule({
  declarations: [
    AppComponent,
    BidsComponent,
    BidTemplatesComponent,
    ProposalTemplatesComponent,
    ManageBidComponent,
    customercomponent,
    CustomDateFormat,
    authorizecomponent,
    Bidupdate,
    Addareamodal,
    Bidstatus,
    bidcalculator,
    Biddocument,
    BidActivities,
    ProposalAddsection,
    LocationComponent,
    ActivitiesComponent,
    StepsComponent,
    Areatemplatecomponent,
    UnAuthorizedcomponent,
    Reportscomponent,
    mycalculation
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RichTextEditorAllModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
    
  ],
  providers: [bidsservice, managebidservice, Appservice, DocumentMasterService, BiddocumentService, ActivitiesService, StepsService, FixtureService, AreaTemplateService, LocationService, buildingService, roomService, Authentication_Service, ReportService, GlobalAuthentication_Service, Global_Service,
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
