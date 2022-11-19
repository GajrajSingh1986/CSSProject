import { Component, OnInit, defineInjectable, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetCompanyId_Request } from '../Models/customerinfo';
import { LocationService } from '../CalculatorService/locationService';
import { buildingService } from '../CalculatorService/buildingService';
import { roomService } from '../CalculatorService/roomService';
import { AreaTemplateService } from '../CalculatorService/AreaTemplateService';
import {
  LocationViewModel, BuildingModel, FloorViewModel, CalculatorDetailModels,
  LocationModel, BidCalculationDetailModel, BidModel, LocationCalculation_response, ChangeSortorder_response, ChangeItemOrderModel,
  Buildingcalculation, SaveBuildingcalculation_request, BuildingcalculationName_request, GetBuildingcalculationName_request,
  Location_response_model
} from '../CalculatorModels/LocationViewModel';
import { RoomViewModel,RoomScheduleModel_response} from '../CalculatorModels/RoomViewModel';
import { AreaTemplateViewModel,FloortypeModel,AreaTemplateFixtureViewModel,FrequencyType }from '../CalculatorModels/AreaTemplateViewModel';
import { GetBuilding_response } from '../CalculatorModels/BuildingModel';
import { JobcardStatus_response } from '../CalculatorModels/BuildingModel';

import { AppConfig }from '../../Common/AppConfig';
import { request } from 'http';
import { Console } from 'console';
declare var $: any;
declare const kendo: any;
import * as XLSX from 'xlsx';

@Component({
    selector:'Locations-app',
    templateUrl:'./Location.component.html'
})
export class LocationComponent implements OnInit
{
    Filetrstandard:string;
    teststandard:string;
    companyid:string;
    search:string;
    locations:LocationViewModel[] =[];
    locatiomVM:LocatiomVM;
    rooms:RoomViewModel[];
    Areatemplatemodel:AreaTemplateViewModel[]=[];
    Floortypemodel:FloortypeModel[]=[];
    Areatemplate_response:RoomScheduleModel_response[]=[];
    Calculation_response:RoomScheduleModel_response[]=[];
    room_response:RoomScheduleModel_response;
    model_showbidcalculator: BidCalculationDetailModel;
    JobcardStatus: JobcardStatus_response;
    buildingreport_model: GetBuilding_response;
    ChangeOrder: ChangeSortorder_response;
    location_cal:LocationViewModel;
    building_model: BuildingModel;
    calculationName_response: GetBuildingcalculationName_request;
    floor_model:FloorViewModel;
    rooms_model:RoomViewModel;
    model: BidModel;
    Segments:string; 
    Undefined:string;
    marketSegments:any=[];
    compid:string;
    calname:string;
    Locationname:string;
    Areatotal: number;
    SqrMtrtotal: number;
    FrequencyTypes_lst : FrequencyType[];
    jobcards:string;
    Locationcalculation_response:LocationCalculation_response;
    TotalArea: number = 0;
    TotalMinutes: number = 0;
    TotalMonthlyMinutes: number = 0;
    TotalSpace: number = 0;
    TotalSqFt: number = 0;
    TotalWeeklyLaborInHours: number = 0;
    TotalMonthlyLaborInHours: number = 0;
    Monthlylbrcost: number = 0;
    suggestamount: string = "";
    sqlmeter:string;
    buildingname:string;
    buindingArea:number;
    buindingMinutes:number;
    buindinghours:number;
    checkMetric: string;
    idex: number;
    templocationname: string;
    tempbuildname: string;
    tempfloorname: string;
    temproomname: string;
    exportexcelurl: string;
  masterSelected: boolean;
  Location_responsemodel: Location_response_model;

    constructor(private _ActivatedRoute:ActivatedRoute,private _locationservice: LocationService,private _buildingService:buildingService,private _Router: Router,private _roomService:roomService,private _Areatemplateservice:AreaTemplateService){
        this.locatiomVM=new LocatiomVM();
        this.room_response =new RoomScheduleModel_response();
        this.model_showbidcalculator=new BidCalculationDetailModel();
        this.location_cal= new LocationViewModel();
        this.building_model= new BuildingModel();
        this.floor_model= new FloorViewModel();
        this.rooms_model=new RoomViewModel();
        this.buildingreport_model = new GetBuilding_response();
        this.ChangeOrder = new ChangeSortorder_response();
        this.model = new BidModel();
        this.Locationcalculation_response = new LocationCalculation_response();
        this.JobcardStatus = new JobcardStatus_response();
      this.calculationName_response = new GetBuildingcalculationName_request();
      this.Location_responsemodel = new Location_response_model();
      }
    
    ngOnInit(){
     
        this.companyid =localStorage.getItem('key');
        let request: GetCompanyId_Request = new GetCompanyId_Request();
        request.GuId = (this._ActivatedRoute.snapshot.params["GuId"]);
        this._locationservice.getMetricNonMetric(this.companyid).subscribe(x=>{
          if(x.Metricmodel.IsMetric==true)
          {
           localStorage.setItem('ChkMetric','Metric');
           this.sqlmeter="Square Meter";
           this.locatiomVM.IsMetric=true;
          }
          else
          {
           localStorage.setItem('ChkMetric','NonMetric');
           this.sqlmeter="Square Feet";
           this.locatiomVM.IsMetric=false;
          }
        });
        //this.GetJobcardStatus(this.companyid);
        this.checkMetric=localStorage.getItem('ChkMetric');
        
        if(this.companyid !=null && this.companyid!=undefined)
        {
            this.Getlocation(this.companyid);
        }
        this.marketSegments=this._locationservice.getMarketSegments();
      this.FrequencyTypes_lst = this._Areatemplateservice.getFrequencyType();
    }

   //GetJobcardStatus(companyid: string) {
   // this._locationservice.getJobcardStatus(companyid).subscribe(x => {
   //   if (x.Jobcardmodel.IsJobcard == true) {
   //     this.locatiomVM.JobcarbSetting = true;
   //     //localStorage.getItem('JobCard','On');
   //   }
   //   else {
   //     this.locatiomVM.JobcarbSetting = false;
   //     //localStorage.getItem('JobCard', 'Off');
   //   }
   //     this.JobcardStatus = x;
   //   });
   // }
   Getlocation(companyid:string)
    {
     this._locationservice.getLocations(companyid).subscribe(x => {
          if(x.length >0)
          {
            this.locations = x;
          }
       });
    }
   SearchChange(): void {
      
      if (this.locatiomVM.search == undefined || this.locatiomVM.search == '') {
        this.Getlocation(this.companyid);
      }
      else {
        this.locations = this.locations.filter(x =>
          (x.LocationName.toLowerCase().indexOf(this.locatiomVM.search.toLowerCase()) != -1)
        );
      }
  }
   ClearLocation(): void {
    this.locatiomVM.search = null;
    this.Getlocation(this.companyid);
  }

   ClickParent(index:number,locationid:number)
    {
      this.companyid = localStorage.getItem('key');
      this.locations[index].showparent = !this.locations[index].showparent;
      this.locations[index].loinx = index;
      this.locations[index].isSelected = false;
      this._buildingService.GetLocationetBuildings(locationid, this.companyid).subscribe(x=>{
            if(x.length >0)
            {
              this.locations[index].buildings = x;
            }
        });
    }
   
    Clickbuilding(index:number,Buildindex:number,buildingId:number)
    {
      this.companyid = localStorage.getItem('key');
      this.locations[index].buildings[Buildindex].showbuild = !this.locations[index].buildings[Buildindex].showbuild;
      this.locations[index].buinx = Buildindex;

        this._buildingService.getFloors(buildingId, this.companyid).subscribe(x=>{
          if(x.length >0)
          {
            this.locations[index].buildings[Buildindex].floors = x;
          }
        });
    }

    Clickfloor(index:number,Buildindex:number,floorindex:number,floorId:number)
    {
        this.locations[index].floinx=floorindex;
      this.locations[index].buildings[Buildindex].floors[floorindex].showfloor = !this.locations[index].buildings[Buildindex].floors[floorindex].showfloor;
      this.locatiomVM.eFloorName = this.locations[index].buildings[Buildindex].floors[floorindex].FloorName;
      this._roomService.GetroomDetails(floorId).subscribe(x => {
          this.locations[index].buildings[Buildindex].floors[floorindex].rooms = x;
        });
     }
    Clickroom(loinx:number,bulinx:number,flrinx:number,rominx:number,roomid:number):void
    {
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].showroom = !this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].showroom;
        this.locations[loinx].rminx=rominx;
      
        this._Areatemplateservice.getAreaTemplates(this.companyid).subscribe(x=>{
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Areatemplatemodel=x;
          }); 

         this._Areatemplateservice.GetFloorTypes().subscribe(x=>{
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Floortypemodel =x;
         });

         this._roomService.GetemployeeList(this.companyid).subscribe(x => {
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Assign_employee = x;
         });
             
          if(this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].AreaTemplateId ==null || this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].AreaTemplateId ==undefined)
          {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].AreaTemplateId=undefined;
          }
          if(this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].FloorTypeId ==null || this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].FloorTypeId ==undefined)
          {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].FloorTypeId=undefined;
          }

         this._buildingService.Getroomschedule(roomid).subscribe(x=>{
             if(x.length >0)
             {
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response=x;
                //console.log(this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response);
             }
         });
     }
    Cancelroom(loinx:number,bulinx:number,flrinx:number,rominx:number,roomid:number):void
     {
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].editMode =false;

        this._Areatemplateservice.getAreaTemplates(this.companyid).subscribe(x=>{
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Areatemplatemodel=x;
        }); 

         this._Areatemplateservice.GetFloorTypes().subscribe(x=>{
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Floortypemodel =x;
         });

           this._buildingService.Getroomschedule(roomid).subscribe(x=>{
                this.Areatemplate_response =x;
         });
         this.locatiomVM.AreaTemplateId=undefined;
         this.locatiomVM.FloorTypeId = undefined;
         this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].RoomName = this.temproomname;
    }

  CancelFloor(loinx: number, bulinx: number, flrinx: number): void {
      this.locations[loinx].buildings[bulinx].floors[flrinx].editMode = false;
    this.locations[loinx].buildings[bulinx].floors[flrinx].FloorName = this.tempfloorname;
  }
  CancelBuilding(loinx: number, bulinx: number): void {
    this.locations[loinx].buildings[bulinx].editMode = false;
    this.locations[loinx].buildings[bulinx].BuildingName = this.tempbuildname;
  }
  CancelLocation(loinx: number): void {
    this.locations[loinx].editMode = false;
    this.locations[loinx].LocationName = this.templocationname;
  }

    editLoction(locationid:number):void
    {
        let index:number = this.locations.findIndex(x=> x.LocationId == locationid);
      this.locations[index].editMode = true;
      let locationname = this.locations[index].LocationName;
      this.locatiomVM.eLocationName = locationname;
      this.templocationname = locationname;
     
    }
    
    updateLocation(location:LocationViewModel):void
    {
        if(this.locatiomVM.eLocationName != null)
        {
            location.LocationName = this.locatiomVM.eLocationName;
        }
      this._locationservice.updateLocation(location).subscribe(x => {
        if (x.Status == true) {
          AppConfig.DangerNotify('Location name already exists.');
        }
          else {
            location.editMode = false;
            AppConfig.SuccessNotify('Location update successfully.');
          }
           
        }, err => {
            console.log('something went wrong');
      });
    }
    deleteLocation(LocationId:number):void
    {
        this.companyid =localStorage.getItem('key');
        if (confirm("Are you sure you want to delete location?")) {   
            
        this,this._locationservice.deleteLocation(LocationId,this.companyid).subscribe(x=>{
            this.Getlocation(this.companyid);
            AppConfig.SuccessNotify('Location Deleted Succefully');
        },error => {
            AppConfig.DangerNotify('Something Error occurs');
         });
        }
    }

    deletebuilding(loinx:number,buildings:BuildingModel):void
    {
      this.companyid = localStorage.getItem('key');

      if (this.locations[loinx].buildings.length > 1) {

        if (confirm("Are you sure you want to delete this building ?")) {

          this._buildingService.deleteBuilding(buildings).subscribe(x => {

            this._buildingService.GetLocationetBuildings(buildings.LocationId, this.companyid).subscribe(x => {
              if (x.length > 0) {
                this.locations[loinx].buildings = x;
              }
              else {
                this.locations[loinx].buildings = null;
              }
            });
            this._locationservice.getRemoveUpdateMinutes(buildings.LocationId).subscribe(x => {
              this.locations[loinx].totalMinuts = x[0].LocationTotalMinutes;
              this.locations[loinx].SquareFeet = x[0].LocationTotalArea;
              this.locations[loinx].SquareMeter = x[0].LocationTotalMeter;
            });
            AppConfig.SuccessNotify('Building Deleted Succefully');

          }, error => {
            AppConfig.DangerNotify('Something Error occurs');
          });
        }
      }
      else {
        alert('Can not delete building because at least one building required');
      }
    }

    deletefloor(loinx:number,bulinx:number,flrinx:number,floor:FloorViewModel):void
    {
      this.companyid = localStorage.getItem('key');
      let vals = this.locations[loinx].buildings[bulinx].floors.length;

      if (this.locations[loinx].buildings[bulinx].floors.length > 1) {
        if (confirm("Are you sure you want to delete this floor ?")) {

          this._buildingService.deleteFloors(floor).subscribe(() => {

            this._buildingService.getFloors(floor.BuildingId, this.companyid).subscribe(x => {
              this.locations[loinx].buildings[bulinx].floors = x;
              this._locationservice.getBuildingUpdateMinutes(floor.BuildingId).subscribe(x => {
                this.locations[loinx].buildings[bulinx].totalMinuts = x[0].BuildingTotalMinutes;
                this.locations[loinx].buildings[bulinx].SquareFeet = x[0].BuildingTotalArea;
                this.locations[loinx].buildings[bulinx].SquareMeter = x[0].BuildingTotalMeter;
                this.locations[loinx].totalMinuts = x[0].LocationTotalMinutes;
                this.locations[loinx].SquareFeet = x[0].LocationTotalArea;
                this.locations[loinx].SquareMeter = x[0].LocationTotalMeter;
              });
            });
            AppConfig.SuccessNotify('Floor Deleted Succefully');
            //this.Getlocation(this.compid);
          }, error => {
            AppConfig.DangerNotify('Something Error occurs');
          });
        }
      }
      else {
        alert('Can not delete floor because at least one floor required');
      }
    }

   deleteroom(loinx:number,bulinx:number,flrinx:number,rominx:number,room_models:RoomViewModel):void
   {

     if (this.locations[loinx].buildings[bulinx].floors[flrinx].rooms.length > 1) {

       if (confirm("Are you sure you want to delete this room ?")) {
         this._roomService.deleteRooms(room_models).subscribe(() => {
           this._roomService.GetroomDetails(room_models.FloorId).subscribe(x => {
             this.locations[loinx].buildings[bulinx].floors[flrinx].rooms = x;
           });
           this._locationservice.getSelectFloorMinutes(room_models.FloorId).subscribe(x => {
             this.locations[loinx].buildings[bulinx].floors[flrinx].totalMinuts = x[0].FloorTotalMinutes;
             this.locations[loinx].buildings[bulinx].floors[flrinx].SquareFeet = x[0].FloorTotalArea;
             this.locations[loinx].buildings[bulinx].floors[flrinx].SquareMeter = x[0].FloorTotalMeter;
             this.locations[loinx].buildings[bulinx].totalMinuts = x[0].BuildingTotalMinutes;
             this.locations[loinx].buildings[bulinx].SquareFeet = x[0].BuildingTotalArea;
             this.locations[loinx].buildings[bulinx].SquareMeter = x[0].BuildingTotalMeter;
             this.locations[loinx].totalMinuts = x[0].LocationTotalMinutes;
             this.locations[loinx].SquareFeet = x[0].LocationTotalArea;
             this.locations[loinx].SquareMeter = x[0].LocationTotalMeter;
           });
           AppConfig.SuccessNotify('Room Deleted Succefully');
         }, error => {
           AppConfig.DangerNotify('Something Error occurs');
         });
       }
     }
     else {
       //AppConfig.SuccessNotify('Room can be delete which have one more');
         alert('Can not delete room because at least one room required');
     }
    }

   editBuilding(locationid:number, buildingId:number):void
   {
      this.companyid = localStorage.getItem('key');
        let index:number = this.locations.findIndex(x=> x.LocationId == locationid);

        this._buildingService.GetLocationetBuildings(locationid, this.companyid).subscribe(x=>{
            if(x.length >0)
            {
                this.locations[index].buildings =x;
                let buindex:number =  x.findIndex(x=> x.BuildingId == buildingId);
                this.locations[index].buildings[buindex].editMode=true;

              let buildname = this.locations[index].buildings[buindex].BuildingName;
              this.locatiomVM.eBuildingName = buildname;
              this.tempbuildname = buildname;
            }
        });
    }

    updateBuilding(Buildingmodel:BuildingModel):void
    {
        Buildingmodel.BuildingName=this.locatiomVM.eBuildingName;
      this._buildingService.updateBuilding(Buildingmodel).subscribe(x => {
        if (x.Status == true) {
          AppConfig.DangerNotify('Building name already exists');
        }
        else {
          Buildingmodel.editMode = false;
          AppConfig.SuccessNotify('Building updated succefully');
         }
       },error => {
            AppConfig.DangerNotify('Something Error occurs');
         });
    }
    editFloor(indexlo:number,bulinx:number,indxflor:number):void
    {
      let floorname = this.locations[indexlo].buildings[bulinx].floors[indxflor].FloorName;
      this.locations[indexlo].buildings[bulinx].floors[indxflor].editMode = true;
      this.locatiomVM.eFloorName = floorname;
      this.tempfloorname = floorname;
      this.locations[indexlo].buildings[bulinx].floors[indxflor].showfloor = false;
    }
    editRoom(indexlo:number,bulinx:number,indxflor:number,rominx:number):void
    {
      let roomname = this.locations[indexlo].buildings[bulinx].floors[indxflor].rooms[rominx].RoomName;
      this.locations[indexlo].buildings[bulinx].floors[indxflor].rooms[rominx].editMode=true;
      this.locatiomVM.eRoomName = roomname;
      this.temproomname = roomname;
    }
    
    createLocation():void
    {
        this.companyid =localStorage.getItem('key');
        let  buildingId:number;
        let  floorId:number;
        
        this._locationservice.createLocation(this.companyid).subscribe(x=>{
          this.building_model.LocationId=x.LocationId;
             this._buildingService.Createbuilding_location(this.building_model).subscribe(x=>{
                  this.floor_model.BuildingId=x.BuildingId;

                  this._buildingService.Createfloor_location(this.floor_model).subscribe(x=>{
                    this.rooms_model.FloorId= x.FloorId;

                    //this.createNewroom(loinx, bulinx, (this.locations[loinx].buildings[bulinx].floors.length - 1));
                    //this._roomService.createRoom_location(this.rooms_model).subscribe(x=>{
                    //    AppConfig.SuccessNotify('Location create succefully');
                    //});
                    let room_create: RoomViewModel = new RoomViewModel();
                    room_create.FloorId = x.FloorId;
                    this._roomService.CreateNewRoom(room_create).subscribe(y => {
                      //this._roomService.GetroomDetails(room_create.FloorId).subscribe(x => {
                      //  this.locations[loinx].buildings[bulinx].floors[flrinx].rooms = x;
                      //});
                      AppConfig.SuccessNotify('Location create succefully');
                     });
                  });
             });
            this.Getlocation(this.companyid);
            
        },error => {
             AppConfig.DangerNotify('Something Error occurs');
        });
    }
    
    createNewroom(loinx: number, bulinx: number, flrinx: number): void {
        let room_create: RoomViewModel = new RoomViewModel();
        room_create.FloorId = this.locations[loinx].buildings[bulinx].floors[flrinx].FloorId;
        this._roomService.CreateNewRoom(room_create).subscribe(y => {
          this._roomService.GetroomDetails(room_create.FloorId).subscribe(x => {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms = x;
          });
        });
     }
    
  createNewBuilding(loinx: number): void {
    this.companyid = localStorage.getItem('key');
        let Building_create: BuildingModel = new BuildingModel();
        Building_create.LocationId = this.locations[loinx].LocationId;
        this._buildingService.CreateNewBuilding(Building_create).subscribe(y => {
          this._buildingService.GetLocationetBuildings(Building_create.LocationId, this.companyid).subscribe(x => {
            this.locations[loinx].buildings = x;
            this.createNewFloor(loinx, (this.locations[loinx].buildings.length -1));
            //this.createNewFloor(loinx, (0));
          });
        });
      }
    
  createNewFloor(loinx: number, bulinx: number): void {
    this.companyid = localStorage.getItem('key');

        let Floor_create: FloorViewModel = new FloorViewModel();
        Floor_create.BuildingId = this.locations[loinx].buildings[bulinx].BuildingId;
        this._buildingService.CreateNewFloor(Floor_create).subscribe(y => {
          this._buildingService.getFloors(Floor_create.BuildingId, this.companyid).subscribe(x => {
            this.locations[loinx].buildings[bulinx].floors = x;
    
            this.createNewroom(loinx, bulinx, (this.locations[loinx].buildings[bulinx].floors.length - 1));
            //this.createNewroom(loinx, bulinx, (0));
          });
        });
      }
  createCopyOfLocation(location_createcopy: LocationModel): void {
        this._locationservice.createCopyOfLocation(location_createcopy).subscribe(x => {
          this.Getlocation(this.companyid);
        });
    }

  createCopyOfBuilding(building_createcopy: BuildingModel, loinx: number): void {
    this.companyid = localStorage.getItem('key');
      let Building_create: BuildingModel = new BuildingModel();
      this._buildingService.createCopyOfBuilding(building_createcopy).subscribe(x => {

        this._buildingService.GetLocationetBuildings(building_createcopy.LocationId, this.companyid).subscribe(x => {
          this.locations[loinx].buildings = x;
           this._locationservice.getRemoveUpdateMinutes(building_createcopy.LocationId).subscribe(x=>{
            this.locations[loinx].totalMinuts=x[0].LocationTotalMinutes;
            this.locations[loinx].SquareFeet=x[0].LocationTotalArea;
            this.locations[loinx].SquareMeter=x[0].LocationTotalMeter;
            });
        });
      });
    }

  createCopyOfFloor(floor_createcopy: FloorViewModel, loinx: number, bulinx: number): void {
    this.companyid = localStorage.getItem('key');
      let Floor_create: FloorViewModel = new FloorViewModel();
      this._buildingService.createCopyOfFloor(floor_createcopy).subscribe(x => {
        this._buildingService.getFloors(floor_createcopy.BuildingId, this.companyid).subscribe(x => {
          this.locations[loinx].buildings[bulinx].floors = x;

            this._locationservice.getBuildingUpdateMinutes(floor_createcopy.BuildingId).subscribe(x=>{
              this.locations[loinx].buildings[bulinx].totalMinuts=x[0].BuildingTotalMinutes;
              this.locations[loinx].buildings[bulinx].SquareFeet=x[0].BuildingTotalArea;
              this.locations[loinx].buildings[bulinx].SquareMeter=x[0].BuildingTotalMeter;

              this.locations[loinx].totalMinuts=x[0].LocationTotalMinutes;
              this.locations[loinx].SquareFeet=x[0].LocationTotalArea;
              this.locations[loinx].SquareMeter=x[0].LocationTotalMeter;
            });
        });
      });
    }

  createCopyOfRoom(loinx: number, bulinx: number, flrinx: number,room_model:RoomViewModel):void {
      this._roomService.createCopyOfRoom(room_model).subscribe(x=>{
          this._roomService.GetroomDetails(room_model.FloorId).subscribe(x => {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms = x;

              this._locationservice.getSelectFloorMinutes(room_model.FloorId).subscribe(x=>{

                 this.locations[loinx].buildings[bulinx].floors[flrinx].totalMinuts=x[0].FloorTotalMinutes;
                 this.locations[loinx].buildings[bulinx].floors[flrinx].SquareFeet=x[0].FloorTotalArea;
                 this.locations[loinx].buildings[bulinx].floors[flrinx].SquareMeter=x[0].FloorTotalMeter;
   
                 this.locations[loinx].buildings[bulinx].totalMinuts=x[0].BuildingTotalMinutes;
                 this.locations[loinx].buildings[bulinx].SquareFeet=x[0].BuildingTotalArea;
                 this.locations[loinx].buildings[bulinx].SquareMeter=x[0].BuildingTotalMeter;
   
                 this.locations[loinx].totalMinuts=x[0].LocationTotalMinutes;
                 this.locations[loinx].SquareFeet=x[0].LocationTotalArea;
                 this.locations[loinx].SquareMeter=x[0].LocationTotalMeter;
              });
           });
        });
    }

  updateFloor(floormodels:FloorViewModel):void 
    {
       floormodels.FloorName=this.locatiomVM.eFloorName;
        this._buildingService.updateFloor(floormodels).subscribe(x => {
       
        if (x.Status == true) {
          AppConfig.DangerNotify('Floor name already exists');
        }
        else {
          floormodels.editMode = false;
          AppConfig.SuccessNotify('Floor updated succefully');
          }
        },error => {
            AppConfig.DangerNotify('Something Error occurs');
         });
    }
  updateRoom(room_models:RoomViewModel):void 
    {
        room_models.RoomName=this.locatiomVM.eRoomName;
        this._roomService.updateRoom(room_models).subscribe(x => {
        if (x.Status == true) {
          AppConfig.DangerNotify('Room name already exists');
        }
        else {
          room_models.editMode = false;
          AppConfig.SuccessNotify('Room updated succefully');

          }
         },error => {
            AppConfig.DangerNotify('Something Error occurs');
         });
    }
  frequecySelected(loinx:number,bulinx:number,flrinx:number,rominx:number,value:number):void
    {
        if(value >0)
        {
         this._Areatemplateservice.getRoomschedule(value).subscribe(x=>{
           if(x.length >0)
           {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response=x;
           }
           else
           {
            this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response=null;
           }
        });
      }
    }  
  Saverecord(loinx:number,bulinx:number,flrinx:number,rominx:number,room_models:RoomViewModel):void
   {
      var sqlfeet=0;
      var sqlmtr=0;
      if(this.locatiomVM.IsMetric==true)
      {
        sqlfeet=((room_models.SquareMeter)*10.764);
        room_models.SquareFeet= this.MathRound(sqlfeet,2);
      }
      else
      {
        sqlmtr=((room_models.SquareFeet)/10.764);
        room_models.SquareMeter= this.MathRound(sqlmtr,2);
      }
     room_models.roomschedule_response=this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response;

     this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].editMode=false;
     this.locations[loinx].buildings[bulinx].floors[flrinx].editMode=false;
     this.locations[loinx].buildings[bulinx].editMode=false;
     this.locations[loinx].editMode=false;

     this._roomService.updateRoom(room_models).subscribe(x=>{
      
          this._buildingService.Saveroomschedule(room_models).subscribe(x=>{
            this._roomService.Getroom_minutes(room_models.RoomId).subscribe(x=>{
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].Total_Minuts=x.Total_Minuts;
              
                this._locationservice.getLocationsUpdateMinutes(room_models.FloorId).subscribe(x=>{
                this.locations[loinx].buildings[bulinx].floors[flrinx].totalMinuts=x[0].FloorTotalMinutes;
                this.locations[loinx].buildings[bulinx].floors[flrinx].SquareFeet=x[0].FloorTotalArea;
                this.locations[loinx].buildings[bulinx].floors[flrinx].SquareMeter=x[0].FloorTotalMeter;
                this.locations[loinx].buildings[bulinx].totalMinuts=x[0].BuildingTotalMinutes;
                this.locations[loinx].buildings[bulinx].SquareFeet=x[0].BuildingTotalArea;
                this.locations[loinx].buildings[bulinx].SquareMeter=x[0].BuildingTotalMeter;
                this.locations[loinx].totalMinuts=x[0].LocationTotalMinutes;
                this.locations[loinx].SquareFeet=x[0].LocationTotalArea;
                this.locations[loinx].SquareMeter=x[0].LocationTotalMeter;
                });
              this._buildingService.Getroomschedule(room_models.RoomId).subscribe(x => {
                if (x.length > 0) {
                  this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response = x;
                }
              });
            });
            AppConfig.SuccessNotify('Room updated succefully');
            },error => {
            AppConfig.DangerNotify('Something Error occurs');
          });
     });
  }

  TaskEmployee(loinx: number, bulinx: number, flrinx: number, rominx: number, employeename: string): void {
    if (employeename == "0: null") {
      this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response.forEach((myObject, index) => {
        myObject.EmployeeName = null;
      });
    }
    else {
      this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response.forEach((myObject, index) => {
        myObject.EmployeeName = employeename;
      });
    }
  }

  UpdateRoomOrderUp(rominx: number, RoomModel: RoomViewModel[]): void {
    let origin = rominx;
    let destination = rominx - 1;
    var temp = RoomModel[destination];
    RoomModel[destination] = RoomModel[origin];
    RoomModel[origin] = temp;
    var temp1 = RoomModel[destination];
        
      temp1.SortOrder = destination;
      temp.SortOrder = origin;
      let items: ChangeItemOrderModel[];
        items = [{
          ItemId: temp1.RoomId,
          SortOrder: temp1.SortOrder
        },
        {
          ItemId: temp.RoomId,
          SortOrder: temp.SortOrder
        }
      ];
      this._locationservice.UpdateRoomOrder(items).subscribe(x => {

       });
  }
  UpdateRoomOrderDown(rominx: number, RoomModel: RoomViewModel[]): void {
    let origin = rominx;
    let destination = rominx + 1;
    var temp = RoomModel[destination];
    RoomModel[destination] = RoomModel[origin];
    RoomModel[origin] = temp;
    var temp1 = RoomModel[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.RoomId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.RoomId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateRoomOrder(items).subscribe(x => {

    });
  }

  UpdateFloorOrderUp(flrinx: number, floormodels: FloorViewModel[]): void {

    let origin = flrinx;
    let destination = flrinx - 1;
    var temp = floormodels[destination];
    floormodels[destination] = floormodels[origin];
    floormodels[origin] = temp;
    var temp1 = floormodels[destination];

      temp1.SortOrder = destination;
      temp.SortOrder = origin;
      let items: ChangeItemOrderModel[];
      items = [{
        ItemId: temp1.FloorId,
        SortOrder: temp1.SortOrder
      },
      {
        ItemId: temp.FloorId,
        SortOrder: temp.SortOrder
      }
      ];
      this._locationservice.UpdateFloorOrder(items).subscribe(x => {

      });
  }
  UpdateFloorOrderDown(flrinx: number, floormodels: FloorViewModel[]): void {
    let origin = flrinx;
    let destination = flrinx + 1;
    var temp = floormodels[destination];
    floormodels[destination] = floormodels[origin];
    floormodels[origin] = temp;
    var temp1 = floormodels[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.FloorId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.FloorId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateFloorOrder(items).subscribe(x => {

    });
  }

  UpdateBuildingOrderUp(bulinx: number, buildmodel: BuildingModel[]): void {
    let origin = bulinx;
    let destination = bulinx - 1;
    var temp = buildmodel[destination];
    buildmodel[destination] = buildmodel[origin];
    buildmodel[origin] = temp;
    var temp1 = buildmodel[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.BuildingId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.BuildingId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateBuildingOrder(items).subscribe(x => {

    });
  }
  UpdateBuildingOrderDown(bulinx: number, buildmodel: BuildingModel[]): void {
    let origin = bulinx;
    let destination = bulinx + 1;
    var temp = buildmodel[destination];
    buildmodel[destination] = buildmodel[origin];
    buildmodel[origin] = temp;
    var temp1 = buildmodel[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.BuildingId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.BuildingId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateBuildingOrder(items).subscribe(x => {

    });
  }

  UpdateLocationOrderUp(loinx: number, location: LocationViewModel[]): void {
    let origin = loinx;
    let destination = loinx - 1;
    var temp = location[destination];
    location[destination] = location[origin];
    location[origin] = temp;
    var temp1 = location[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.LocationId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.LocationId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateLocationOrder(items).subscribe(x => {

    });
  }
  UpdateLocationOrderDown(loinx: number, location: LocationViewModel[]): void {
    let origin = loinx;
    let destination = loinx + 1;
    var temp = location[destination];
    location[destination] = location[origin];
    location[origin] = temp;
    var temp1 = location[destination];

    temp1.SortOrder = destination;
    temp.SortOrder = origin;
    let items: ChangeItemOrderModel[];
    items = [{
      ItemId: temp1.LocationId,
      SortOrder: temp1.SortOrder
    },
    {
      ItemId: temp.LocationId,
      SortOrder: temp.SortOrder
    }
    ];
    this._locationservice.UpdateLocationOrder(items).subscribe(x => {
    });
  }

  BuildingReport(building_response: BuildingModel): void {
    
    this.companyid = localStorage.getItem('key');

        this._buildingService.getBuildingReport(building_response.BuildingId, this.companyid).subscribe(x => {
          this.buildingreport_model = x;
          console.log(this.buildingreport_model);
          var hours: any;
          hours = ((building_response.totalMinuts) / 60);
          this.buindinghours = this.MathRound(hours, 2);

          this.buildingreport_model.building.editMode = true;
          this.buildingreport_model.building.BuildingId = building_response.BuildingId;
          this.buildingreport_model.building.BuildingName = building_response.BuildingName;
          this.buildingreport_model.building.SquareFeet = building_response.SquareFeet;
          this.buildingreport_model.building.SquareMeter = building_response.SquareMeter;
          this.buildingreport_model.building.totalMinuts = building_response.totalMinuts;
          this.buildingreport_model.building.Hours = this.buindinghours;
        
          $("#Showbuildingreport").modal('show');
        });
  }

  SaveReport(savebuilding: GetBuilding_response) {
       this._buildingService.SavebuildingReport(savebuilding).subscribe(x=>{
       // });  
        AppConfig.SuccessNotify('Record Save Succefully');
      },error => {
          AppConfig.DangerNotify('Something Error occurs');
       });
    }

  RemoveFixture(loinx:number,bulinx:number,flrinx:number,rominx:number,indxlst:number):void
   {
    this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response.splice(indxlst,1);
      //this.Areatemplate_response.splice(indxlst,1);
   }
  SelectFrequency(loinx:number,bulinx:number,flrinx:number,rominx:number,value:number,Fixtureid:number):void
   {
       //let fixind:number =  this.Areatemplate_response.findIndex(x=> x.FixtureId == Fixtureid);
       let fixind:number =  this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response.findIndex(x=> x.FixtureId == Fixtureid);
       
       if(value == 3)
       {
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Sunday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Monday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Tuesday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Wednesday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Thursday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Friday=true;
        this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Saturday=true;
       }
       else
       {
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Sunday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Monday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Tuesday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Wednesday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Thursday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Friday=false;
           this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].Saturday=false;
       }
           
           if(value == 3)
            {
                //let cleanfre:number =this.Areatemplate_response[fixind].CleaningFrequecy;
             //let totminute: number = this.Areatemplate_response[fixind].OrgTotalStepTime;
                let cleanfre: number = this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].CleaningFrequecy;
                let totminute: number = this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].OrgTotalStepTime;
                let total:number= (cleanfre)* 7*4.33* totminute;
                let totalval:any=total.toFixed(2);
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].TotalStepTime=totalval;
            }
            else if(value == 1)
            {
                let cleanfre:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].CleaningFrequecy;
                let totminute:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].OrgTotalStepTime;
                let total:number= (cleanfre)*4.33 * totminute;
                let totalval:any=total.toFixed(2);
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].TotalStepTime=totalval;
            }
            else if(value == 2)
            {
                let cleanfre:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].CleaningFrequecy;
                let totminute:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].OrgTotalStepTime;
                let total:number= (cleanfre)*totminute;
                let totalval:any=total.toFixed(2);
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].TotalStepTime=totalval;
            }
            else
            {
                let cleanfre:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].CleaningFrequecy;
                let totminute:number =this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].OrgTotalStepTime;
                this.locations[loinx].buildings[bulinx].floors[flrinx].rooms[rominx].roomschedule_response[fixind].TotalStepTime=totminute;
            }
   }

//////New Code 

  ShowCalculation(location: LocationViewModel) {

  this.locatiomVM.buildingshow = false;
  this.Locationname=location.LocationName;
  this.Areatotal = location.SquareFeet;
  this.SqrMtrtotal = location.SquareMeter;
  let request: number=location.LocationId;
  this.model_showbidcalculator = new BidCalculationDetailModel();
   // console.log(location.SquareMeter);
  this.model_showbidcalculator.LocationId=location.LocationId;
    this._locationservice.GetLocationCalculationDetail(location.LocationId).subscribe(x => {
    if(x.result.status==true)
    {
     // this.model_showbidcalculator = x.LocationCalculatiomModels;
      this.GetCalculation(location);
      this.model_showbidcalculator.SquareFeet = location.SquareFeet;
      this.model_showbidcalculator.SquareMeter = location.SquareMeter;
      this.model_showbidcalculator.TotalMinutes = location.totalMinuts;
      $("#Showbidcaculator").modal('show');
    }  
    else
    {
      this.GetCalculation(location);
      this.model_showbidcalculator.SquareMeter = location.SquareMeter;
      
      $("#Showbidcaculator").modal('show');
    }
   });
}
  GetCalculation(location:LocationViewModel)
  {
    if(this.model_showbidcalculator.SquareFeet==null ||this.model_showbidcalculator.SquareFeet==undefined)
    {
      this.TotalArea = 0;
      this.TotalMinutes = 0;
      this.TotalMonthlyMinutes = 0;
      this.TotalSpace = 0;
      this.TotalSqFt = 0;
      this.TotalWeeklyLaborInHours = 0;
      this.TotalMonthlyLaborInHours = 0;
      this.Monthlylbrcost = 0;
      this.suggestamount = "";
    
      this.model_showbidcalculator
      this.TotalMinutes =this.defaultZeroIfNull(location.totalMinuts / 4.33);// this.defaultZeroIfNull(location.totalMinuts / 4.33);
      this.TotalArea =location.SquareFeet;// this.defaultZeroIfNull(location.SquareFeet);
      this.TotalMonthlyMinutes =location.totalMinuts;// this.defaultZeroIfNull(location.totalMinuts);
      this.TotalSpace =location.SquareFeet;

      this.model_showbidcalculator.TotalMinutes=location.totalMinuts;
      this.model_showbidcalculator.SquareFeet=location.SquareFeet;
      this.model_showbidcalculator.GrossMargin = 13;
      this.model_showbidcalculator.OverHeadRate = 14;
      this.model_showbidcalculator.SupplyRate = 12;
      this.model_showbidcalculator.WeeklyHours = 25;
      this.model_showbidcalculator.HourlyLaborRate =9;// location.HourlyLaborRate;
  
      this.TotalWeeklyLaborInHours = this.MathRound(this.TotalMinutes / 60, 2); //* numberOfTimeInWeek;
      this.TotalMonthlyLaborInHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);
      this.model_showbidcalculator.MonthlyLaborCost = this.TotalMonthlyLaborInHours * this.model_showbidcalculator.HourlyLaborRate; //$bidVM.BidCalculatorObject.HourlyLaborRate;
      this.model_showbidcalculator.MonthlySupplyCost = this.model_showbidcalculator.MonthlyLaborCost * (this.model_showbidcalculator.SupplyRate / 100); // ($bidVM.BidCalculatorObject.SupplyRate / 100);
      this.model_showbidcalculator.MonthlyOverHeadCost = this.model_showbidcalculator.MonthlyLaborCost * (this.model_showbidcalculator.OverHeadRate / 100); //($bidVM.BidCalculatorObject.OverHeadRate / 100);
      this.model_showbidcalculator.MonthlyTotalCost = this.model_showbidcalculator.MonthlyLaborCost + this.model_showbidcalculator.MonthlySupplyCost + this.model_showbidcalculator.MonthlyOverHeadCost;
      this.model_showbidcalculator.Revenue = (100 * this.model_showbidcalculator.MonthlyTotalCost) / (100 - this.model_showbidcalculator.GrossMargin); //(100 - $bidVM.BidCalculatorObject.GrossMargin);
      this.model_showbidcalculator.MonthlyGrossMargin = this.model_showbidcalculator.Revenue * (this.model_showbidcalculator.GrossMargin / 100); //($bidVM.BidCalculatorObject.GrossMargin / 100);
  
      this.model_showbidcalculator.FullTimeEmployees = Math.ceil((this.TotalWeeklyLaborInHours / this.model_showbidcalculator.WeeklyHours)); //Math.ceil(($bidVM.BidCalculatorObject.TotalMonthlyLaborInHours / $bidVM.BidCalculatorObject.WeeklyHours));
      //this.model_showbidcalculator.TotalWeeklyLabor = this.MathRound(this.TotalMinutes / 60, 2);
      this.model_showbidcalculator.TotalWeeklyLabor = this.TotalWeeklyLaborInHours;
      this.model_showbidcalculator.TotalLaborHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);
    }
  }

  OnBidCalculatorChange(invalid: boolean): void {
    if (invalid == false) {
      this.model_showbidcalculator = this.MarginCalculation(this.model_showbidcalculator);
    }
}

MarginCalculation(request: BidCalculationDetailModel): BidCalculationDetailModel {
  //console.log(request);
  this.TotalArea = 0;
  this.TotalMinutes = 0;
  this.TotalMonthlyMinutes = 0;
  this.TotalSpace = 0;
  this.TotalSqFt = 0;
  this.TotalWeeklyLaborInHours = 0;
  this.TotalMonthlyLaborInHours = 0;
  this.Monthlylbrcost = 0;
  this.suggestamount = "";
  // if (this.model.LocationId == null) {
  //   this.model.BidAreas.map(x => {
  //     this.TotalArea = this.TotalArea + this.defaultZeroIfNull(x.Space);
  //     this.TotalMinutes = this.TotalMinutes + this.defaultZeroIfNull(x.Minutes);
  //     this.TotalMonthlyMinutes = this.TotalMonthlyMinutes + this.defaultZeroIfNull(x.MonthlyMinutes);
  //     this.TotalSpace = this.TotalSpace + this.defaultZeroIfNull(x.Space);
  //     this.TotalSqFt = this.TotalSqFt + this.defaultZeroIfNull(x.CalculatedSquareFeet);
  //   });
  // }
  // else {
    // let location: LocationViewModel = this.model.LocationDetail;

    // if (this.model.LocationDetail == null || this.model.LocationDetail == undefined) {
    //   location = this.location_model_drp.filter(x => x.LocationId == this.model.LocationId)[0];
    // }
    //if (location != null && location != undefined) {
      this.TotalMinutes =this.defaultZeroIfNull((request.TotalMinutes)/ 4.33);// this.defaultZeroIfNull(location.totalMinuts / 4.33);
      this.TotalArea =request.SquareFeet;// this.defaultZeroIfNull(location.SquareFeet);
      this.TotalMonthlyMinutes =request.TotalMinutes;// this.defaultZeroIfNull(location.totalMinuts);
      this.TotalSpace =request.SquareFeet;// this.defaultZeroIfNull(location.SquareFeet);
   // }
  //}
  
  if (request == null) {
    //Hourly Labor Rate	9.00
    //Weekly Employee Hours	25.00
    //Supply Rate	12.00
    //Overhead Rate	14.00
    //Gross Margin	13.00
    // Call GetBidDefaultSettings API later
    request = new BidCalculationDetailModel();
    request.BidId = this.model.BidId;
    request.GrossMargin = 13;
    request.OverHeadRate = 14;
    request.SupplyRate = 12;
    request.WeeklyHours = 25;
    request.HourlyLaborRate = 9;
    request.SquareFeet = this.model.SquareFeet;
    request.SquareFoot = this.model.SquareFeet;
    request.LaborRevenueRate = 0;
    request.MonthlyGrossMargin = 0;
    request.MonthlyLaborCost = 0;
    request.MonthlyOverHeadCost = 0;
    request.MonthlySupplyCost = 0;
    request.MonthlyTotalCost = 0;
    request.TotalLaborHours = 0;
    request.TotalWeeklyLabor = 0;
    request.Revenue = 0;
  }

  this.TotalWeeklyLaborInHours = this.MathRound(this.TotalMinutes / 60, 2); //* numberOfTimeInWeek;
  this.TotalMonthlyLaborInHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);
  request.MonthlyLaborCost = this.TotalMonthlyLaborInHours * request.HourlyLaborRate; //$bidVM.BidCalculatorObject.HourlyLaborRate;
  request.MonthlySupplyCost = request.MonthlyLaborCost * (request.SupplyRate / 100); // ($bidVM.BidCalculatorObject.SupplyRate / 100);
  request.MonthlyOverHeadCost = request.MonthlyLaborCost * (request.OverHeadRate / 100); //($bidVM.BidCalculatorObject.OverHeadRate / 100);
  request.MonthlyTotalCost = request.MonthlyLaborCost + request.MonthlySupplyCost + request.MonthlyOverHeadCost;
  request.Revenue = (100 * request.MonthlyTotalCost) / (100 - request.GrossMargin); //(100 - $bidVM.BidCalculatorObject.GrossMargin);
  request.MonthlyGrossMargin = request.Revenue * (request.GrossMargin / 100); //($bidVM.BidCalculatorObject.GrossMargin / 100);

  request.FullTimeEmployees = Math.ceil((this.TotalWeeklyLaborInHours / request.WeeklyHours)); //Math.ceil(($bidVM.BidCalculatorObject.TotalMonthlyLaborInHours / $bidVM.BidCalculatorObject.WeeklyHours));

  //$bidVM.BidCalculatorObject.SquareFoot = totalArea;
  //$bidVM.BidCalculatorObject.SquareFeet = totalArea;
  request.TotalWeeklyLabor = this.MathRound(this.TotalMinutes / 60, 2);
  request.TotalLaborHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);

  //this.CalculateActualMargin();
  return request;
}

CalculateActualMargin(): void {
    
  if (this.model.ActualBid && this.model.BidCalculationDetail && this.model.BidCalculationDetail.MonthlyTotalCost) {
    this.model.ActualMargin = this.model.ActualBid - this.model.BidCalculationDetail.MonthlyTotalCost;
    this.model.ActualMarginInPercentage = (this.model.ActualMargin * 100) / this.model.ActualBid;
  } else {
    this.model.ActualMargin = 0
    this.model.ActualMarginInPercentage = 0;
  }
}

SaveCalculation(request: BidCalculationDetailModel):void
{
  this._locationservice.SaveLocationCalculation(request).subscribe(x=>{
    if(x.result.status==true)
    {
      AppConfig.SuccessNotify('Location Calculation Save Successfully.');
    }
  });
  }

 Recalculate(locationid: number, buildingId: number, index: number): void {
  
    this.locatiomVM.locationId = locationid;
    this.locatiomVM.buildingId = buildingId;
    this.locatiomVM.LoIndex = index;

    $("#ConfirmMSG").modal('show');
  }
  ConfirmMSG(): void {

    this.companyid = localStorage.getItem('key');
    this.locatiomVM.showmsg = true;
    this._buildingService.RecalculateBuilding(this.locatiomVM.buildingId).subscribe(x => {
        if (x.result.status = true) {
          AppConfig.SuccessNotify('Update Succefully');
          $("#ConfirmMSG").modal('hide');

          let index: number = 0;
          index = this.locatiomVM.LoIndex;
          this._locationservice.getLocations(this.companyid).subscribe(x => {
            if (x.length > 0) {
              this.locations = x;
              this.locations[index].loinx = index;
              this._buildingService.GetLocationetBuildings(this.locatiomVM.locationId, this.companyid).subscribe(x => {
                if (x.length > 0) {
                  this.locations[index].buildings = x;
                  this.locations[this.locatiomVM.LoIndex].showparent = true;
                  this.locatiomVM.showmsg = false;
                }
              });
            }
          });
        }
      }, error => {
        AppConfig.DangerNotify('Something Error occurs');
    });
  }

  Recalculatebyfloor(buildingId: number, floorid: number, index: number, bulindex: number, flrindex: number): void {

    this.locatiomVM.floorId = floorid;
    this.locatiomVM.buildingId = buildingId;
    this.locatiomVM.LoIndex = index;
    this.locatiomVM.bulinx = bulindex;
    this.locatiomVM.flrinx = flrindex; 
  
    $("#ConfirmMSGbyfloor").modal('show');
  }
  ConfirmMSGbyfloor(): void {

    this.companyid = localStorage.getItem('key');
    this.locatiomVM.showmsg = true;
    this._buildingService.Recalculatebyfloor(this.locatiomVM.buildingId, this.locatiomVM.floorId).subscribe(x => {
      if (x.result.status = true) {
        AppConfig.SuccessNotify('Update Succefully');
        $("#ConfirmMSGbyfloor").modal('hide');

        this._buildingService.getFloors(this.locatiomVM.buildingId, this.companyid).subscribe(x => {
          if (x.length > 0) {
            this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors = x;
            this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].showbuild = true;
            this.locatiomVM.showmsg = false;

            this._locationservice.getLocationsUpdateMinutes(this.locatiomVM.floorId).subscribe(x => {
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].totalMinuts = x[0].FloorTotalMinutes;
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].SquareFeet = x[0].FloorTotalArea;
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].SquareMeter = x[0].FloorTotalMeter;
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].totalMinuts = x[0].BuildingTotalMinutes;
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].SquareFeet = x[0].BuildingTotalArea;
              this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].SquareMeter = x[0].BuildingTotalMeter;
              this.locations[this.locatiomVM.LoIndex].totalMinuts = x[0].LocationTotalMinutes;
              this.locations[this.locatiomVM.LoIndex].SquareFeet = x[0].LocationTotalArea;
              this.locations[this.locatiomVM.LoIndex].SquareMeter = x[0].LocationTotalMeter;
            });


          }
          this.locatiomVM.showmsg = false;
        });
      }
    }, error => {
      AppConfig.DangerNotify('Something Error occurs');
    });
  }

  Recalculatebyroom(buildingId: number, floorid: number, roomid: number, index: number, bulindex: number, flrindex: number): void {

    this.locatiomVM.roomId = roomid;
    this.locatiomVM.buildingId = buildingId;
    this.locatiomVM.floorId = floorid;
    this.locatiomVM.LoIndex = index;
    this.locatiomVM.bulinx = bulindex;
    this.locatiomVM.flrinx = flrindex; 

    $("#ConfirmMSGbyroom").modal('show');
  }
  ConfirmMSGbyroom(): void {

    this.companyid = localStorage.getItem('key');
    this.locatiomVM.showmsg = true;
    this._buildingService.Recalculatebyroom(this.locatiomVM.buildingId, this.locatiomVM.roomId).subscribe(x => {
      if (x.result.status = true) {
        AppConfig.SuccessNotify('Update Succefully');
        $("#ConfirmMSGbyroom").modal('hide');
        
        this._roomService.GetroomDetails(this.locatiomVM.floorId).subscribe(x => {
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].rooms = x;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].showfloor = true;
          this.locatiomVM.showmsg = false;
       
        this._locationservice.getLocationsUpdateMinutes(this.locatiomVM.floorId).subscribe(x => {
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].totalMinuts = x[0].FloorTotalMinutes;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].SquareFeet = x[0].FloorTotalArea;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].floors[this.locatiomVM.flrinx].SquareMeter = x[0].FloorTotalMeter;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].totalMinuts = x[0].BuildingTotalMinutes;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].SquareFeet = x[0].BuildingTotalArea;
          this.locations[this.locatiomVM.LoIndex].buildings[this.locatiomVM.bulinx].SquareMeter = x[0].BuildingTotalMeter;
          this.locations[this.locatiomVM.LoIndex].totalMinuts = x[0].LocationTotalMinutes;
          this.locations[this.locatiomVM.LoIndex].SquareFeet = x[0].LocationTotalArea;
          this.locations[this.locatiomVM.LoIndex].SquareMeter = x[0].LocationTotalMeter;
          });
        });
      }
    }, error => {
        AppConfig.DangerNotify('Something Error occurs');
        this.locatiomVM.showmsg = false;
    });
  }

 MathRound(number, precision): number {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  defaultZeroIfNull(value): number {
    if (this.isNullOrEmpty(value) || isNaN(value)) return 0;
    return Number(value);
  }

  isNullOrEmpty(value): boolean {
    if (value == undefined || value == null || value.toString().trim() == '' || value.toString().length == 0) return true;
    return false
  }
 
  //ExportToPDF(): void {
  //  this.buildingreport_model.building.editMode = false;
  //  $('#pdftheme').show();
  //  $('#spnemp').hide();
  //  $(".actiontheme").hide();
  //  $(".btncontent").hide();

  //                      //let _this: any = this;
  //                      //setTimeout(() => {
  //    kendo.drawing.drawDOM($("#theme-blue"))
  //      .then(function (group) {
  //        // Render the result as a PDF file
  //        return kendo.drawing.exportPDF(group, {
  //          paperSize: "auto",
  //          margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
  //        });
  //      }).done(function (data) {
  //        // Save the PDF file
  //        kendo.saveAs({
  //          dataURI: data,
  //          fileName: "Workloading.pdf",
  //          proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
  //        });
  //        $('#pdftheme').hide();
  //        $(".actiontheme").show();
  //        $(".btncontent").show();
  //                            //  _this.buildingreport_model.building.editMode = true;
  //     });
  //                             //}, 1000)
  //}

  exportexcelurls(buildingId: number): string {
    this.companyid = localStorage.getItem('key');
    this.exportexcelurl = AppConfig.APIURL + "Location_API/BuildingReportToExcel?companyid=" + this.companyid + "&buildingId=" + buildingId + "&Metric=" + this.locatiomVM.IsMetric;
    return this.exportexcelurl;
  }

  checkUncheckAll(indx: number, locationid: number) {
    this.companyid = localStorage.getItem('key');
    if (this.locations[indx].buildings == undefined) {
      this._buildingService.GetLocationetBuildings(locationid, this.companyid).subscribe(x => {
        if (x.length > 0) {
          this.locations[indx].buildings = x;

          for (var i = 0; i < this.locations[indx].buildings.length; i++) {
            this.locations[indx].buildings[i].isbuldSelected = this.locations[indx].isSelected;
          }
          this.locations[indx].CalcuBuildIcon = true;
          this.getCheckedItemList(indx);
          }
        });
    }
    else {
      for (var i = 0; i < this.locations[indx].buildings.length; i++) {
        this.locations[indx].buildings[i].isbuldSelected = this.locations[indx].isSelected;
      }
      this.getCheckedItemList(indx);
    }
  }

  isAllSelected(indx: number) {
    this.locations[indx].isSelected = this.locations[indx].buildings.every(function (item: any) {
      return item.isbuldSelected == true;
    })
    this.getCheckedItemList(indx);
  }
  getCheckedItemList(indx: number) {
    let total: number = 0;
    let totalMtr: number = 0;
    let totalMinutes: number = 0;
    this.locations[indx].CalcuBuildIcon = false;
   
    for(var i = 0; i <this.locations[indx].buildings.length; i++) {
      if (this.locations[indx].buildings[i].isbuldSelected) {
        total += this.locations[indx].buildings[i].SquareFeet;
        totalMinutes += this.locations[indx].buildings[i].totalMinuts;
        totalMtr += this.locations[indx].buildings[i].SquareMeter;
        this.locations[indx].CalcuBuildIcon = true;
      }
    }
    this.locatiomVM.TotalSqlfutBuilding = total;
    this.locatiomVM.TotalMinutesBuilding = totalMinutes;
    this.locatiomVM.TotalSqlMtrBuilding = totalMtr;
  }

  BuildingCalculation(location: LocationViewModel) {
    //let locationmdl: LocationViewModel = new LocationViewModel();
   // locationmdl = location;
    this.Locationname = location.LocationName;
    this.Areatotal = this.locatiomVM.TotalSqlfutBuilding;
    this.SqrMtrtotal = this.locatiomVM.TotalSqlMtrBuilding;
    let request: number = location.LocationId;
    this.locatiomVM.buildingshow = true;

    this.model_showbidcalculator = new BidCalculationDetailModel();
    this.model_showbidcalculator.Location = location.LocationName;
    
    this.companyid = localStorage.getItem('key');
    
    let saveCalculation: BuildingcalculationName_request = new BuildingcalculationName_request();
    const indx = this.locations.findIndex(ids => ids.LocationId === location.LocationId);
    saveCalculation.companyid = this.companyid;
    saveCalculation.IsMetric = this.locatiomVM.IsMetric;
    saveCalculation.buildingIdList = new Array<number>();
    for (var i = 0; i < this.locations[indx].buildings.length; i++) {
      if (this.locations[indx].buildings[i].isbuldSelected) {
        saveCalculation.buildingIdList.push(this.locations[indx].buildings[i].BuildingId);
      }
    }
    this._locationservice.GetBuildingCalculationName(saveCalculation).subscribe(x => {
      this.calculationName_response = x;
      //console.log(this.calculationName_response);
    });
    
    this.model_showbidcalculator.LocationId = location.LocationId;
    this._locationservice.GetLocationCalculationDetail(location.LocationId).subscribe(x => {
      //console.log(x);
      if (x.result.status == true) {
        this.GetBuildingCalculation(location);
        this.model_showbidcalculator.SquareFeet = this.locatiomVM.TotalSqlfutBuilding;
        this.model_showbidcalculator.SquareMeter = this.locatiomVM.TotalSqlMtrBuilding;
        this.model_showbidcalculator.TotalMinutes = this.locatiomVM.TotalMinutesBuilding;
        $("#Showbidcaculator").modal('show');
      }
      else {
        this.GetBuildingCalculation(location);
        this.model_showbidcalculator.SquareFeet = this.locatiomVM.TotalSqlfutBuilding;
        this.model_showbidcalculator.SquareMeter = this.locatiomVM.TotalSqlMtrBuilding;
        this.model_showbidcalculator.TotalMinutes = this.locatiomVM.TotalMinutesBuilding;

        $("#Showbidcaculator").modal('show');
      }
    });
  }
  GetBuildingCalculation(location: LocationViewModel) {
    if (this.model_showbidcalculator.SquareFeet == null || this.model_showbidcalculator.SquareFeet == undefined) {
      this.TotalArea = 0;
      this.TotalMinutes = 0;
      this.TotalMonthlyMinutes = 0;
      this.TotalSpace = 0;
      this.TotalSqFt = 0;
      this.TotalWeeklyLaborInHours = 0;
      this.TotalMonthlyLaborInHours = 0;
      this.Monthlylbrcost = 0;
      this.suggestamount = "";

      this.model_showbidcalculator
      this.TotalMinutes = this.defaultZeroIfNull(this.locatiomVM.TotalMinutesBuilding / 4.33);// this.defaultZeroIfNull(location.totalMinuts / 4.33);
      this.TotalArea = this.locatiomVM.TotalSqlfutBuilding;// this.defaultZeroIfNull(location.SquareFeet);
      this.TotalMonthlyMinutes = this.locatiomVM.TotalMinutesBuilding;// this.defaultZeroIfNull(location.totalMinuts);
      this.TotalSpace = this.locatiomVM.TotalSqlfutBuilding;

      this.model_showbidcalculator.TotalMinutes = this.locatiomVM.TotalMinutesBuilding;
      this.model_showbidcalculator.SquareFeet = this.locatiomVM.TotalSqlfutBuilding;
      this.model_showbidcalculator.GrossMargin = 13;
      this.model_showbidcalculator.OverHeadRate = 14;
      this.model_showbidcalculator.SupplyRate = 12;
      this.model_showbidcalculator.WeeklyHours = 25;
      this.model_showbidcalculator.HourlyLaborRate = 9;// location.HourlyLaborRate;

      this.TotalWeeklyLaborInHours = this.MathRound(this.TotalMinutes / 60, 2); //* numberOfTimeInWeek;
      this.TotalMonthlyLaborInHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);
      this.model_showbidcalculator.MonthlyLaborCost = this.TotalMonthlyLaborInHours * this.model_showbidcalculator.HourlyLaborRate; //$bidVM.BidCalculatorObject.HourlyLaborRate;
      this.model_showbidcalculator.MonthlySupplyCost = this.model_showbidcalculator.MonthlyLaborCost * (this.model_showbidcalculator.SupplyRate / 100); // ($bidVM.BidCalculatorObject.SupplyRate / 100);
      this.model_showbidcalculator.MonthlyOverHeadCost = this.model_showbidcalculator.MonthlyLaborCost * (this.model_showbidcalculator.OverHeadRate / 100); //($bidVM.BidCalculatorObject.OverHeadRate / 100);
      this.model_showbidcalculator.MonthlyTotalCost = this.model_showbidcalculator.MonthlyLaborCost + this.model_showbidcalculator.MonthlySupplyCost + this.model_showbidcalculator.MonthlyOverHeadCost;
      this.model_showbidcalculator.Revenue = (100 * this.model_showbidcalculator.MonthlyTotalCost) / (100 - this.model_showbidcalculator.GrossMargin); //(100 - $bidVM.BidCalculatorObject.GrossMargin);
      this.model_showbidcalculator.MonthlyGrossMargin = this.model_showbidcalculator.Revenue * (this.model_showbidcalculator.GrossMargin / 100); //($bidVM.BidCalculatorObject.GrossMargin / 100);

      this.model_showbidcalculator.FullTimeEmployees = Math.ceil((this.TotalWeeklyLaborInHours / this.model_showbidcalculator.WeeklyHours)); //Math.ceil(($bidVM.BidCalculatorObject.TotalMonthlyLaborInHours / $bidVM.BidCalculatorObject.WeeklyHours));
      //this.model_showbidcalculator.TotalWeeklyLabor = this.MathRound(this.TotalMinutes / 60, 2);
      this.model_showbidcalculator.TotalWeeklyLabor = this.TotalWeeklyLaborInHours;
      this.model_showbidcalculator.TotalLaborHours = this.MathRound(this.TotalMonthlyMinutes / 60, 2);
    }
  }

  SaveBuildingCalculation(request: BidCalculationDetailModel): void {
    this.companyid = localStorage.getItem('key');
    request.CompanyId = this.companyid;
    let saveCalculation: SaveBuildingcalculation_request = new SaveBuildingcalculation_request();
    const indx = this.locations.findIndex(ids => ids.LocationId === request.LocationId);
    this.locations[indx].CalcuBuildIcon = true;

    saveCalculation.BidCalculationDetailModel = request;
    saveCalculation.buildingIdList = new Array<number>();
    for (var i = 0; i < this.locations[indx].buildings.length; i++) {
      if (this.locations[indx].buildings[i].isbuldSelected) {
        saveCalculation.buildingIdList.push(this.locations[indx].buildings[i].BuildingId);
      }
    }
      this._locationservice.buildingCalculation(saveCalculation).subscribe(x => {
        if (x.result.message == 'exit') {
          AppConfig.WarningNotify('Building Calculation Name already exists.');
        }
        else if (x.result.status == true) {
          AppConfig.SuccessNotify('Building Calculation Save Successfully.');
        }
      });
  }

  // SearchBuilding(loinx: number): void {
  //   if (this.locatiomVM.searchbuilding == undefined || this.locatiomVM.searchbuilding == '') {
  //     //this.Getlocation(this.companyid);
  //   }
  //   else {
  //     this.locations[loinx].buildings = this.locations[loinx].buildings.filter(x =>
  //       (x.BuildingName.toLowerCase().indexOf(this.locatiomVM.searchbuilding.toLowerCase()) != -1)
  //     );
  //   }
  // }

  // SearchFloor(loinx: number,bulinx:number): void {

  //   if (this.locatiomVM.SearchFloor == undefined || this.locatiomVM.SearchFloor == '') {
  //     //this.Getlocation(this.companyid);
  //   }
  //   else {
  //     this.locations[loinx].buildings[bulinx].floors = this.locations[loinx].buildings[bulinx].floors.filter(x =>
  //       (x.FloorName.toLowerCase().indexOf(this.locatiomVM.SearchFloor.toLowerCase()) != -1)
  //     );
  //   }
  // }

  SearchRoom(loinx: number,): void {
    if (this.locatiomVM.searchbuilding == undefined || this.locatiomVM.searchbuilding == '') {
      //this.Getlocation(this.companyid);
    }
    else {
      this.locations[loinx].buildings = this.locations[loinx].buildings.filter(x =>
        (x.BuildingName.toLowerCase().indexOf(this.locatiomVM.searchbuilding.toLowerCase()) != -1)
      );
    }
  }

}

export class LocatiomVM
{
  Segments:string;
  eLocationName:string;
  eBuildingName:string;
  eFloorName:string;
  eRoomName:string;
  AreaTemplateId:number;
  FloorTypeId:number;
  IsMetric:boolean;
  JobcarbSetting:boolean=false;
  TempSquareFeet:number;
  TempSquareMeter:number;
  search: string;
  searchbuilding: string;
  SearchFloor:string;
  buildingId: number;
  floorId: number;
  roomId: number;
  locationId: number;
  bulinx: number;
  flrinx: number;
  LoIndex: number;
  showmsg: boolean = false;
  TotalSqlfutBuilding: number;
  TotalSqlMtrBuilding: number;
  TotalMinutesBuilding: number;
  buildingshow: boolean = false;
}
