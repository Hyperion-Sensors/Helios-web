import axios, { AxiosInstance } from "axios";
import { useQuery } from "@tanstack/react-query";
let addr = process.env.NEXT_PUBLIC_SERVER_ADDR; //this is the main server address

import { Asset_Services } from "./asset_services_new";
import Notification_Service from "./notifications_services_new";

export default class Data_Services {
  access_token: string;
  headers: { accesstoken: string };
  helios_server: any;
  Asset_Services: Asset_Services;
  Notification_Services: Notification_Service;

  constructor(helios_server: any) {
    this.Asset_Services = new Asset_Services(helios_server);
    this.Notification_Services = new Notification_Service(helios_server);
  }

  /*------------------------Asset Services-------------------------*/

  AssetQueryWrapped(queryType: string, args: []) {
    let assetFunction = this.Asset_Services.function_list[queryType]; //gets the function from the asset_services object
    return useQuery({ queryKey: [queryType], queryFn: assetFunction(...args) }); //returns the query_instance
  }

  AssetQuery(queryType: string, args: []) {
    return this.Asset_Services.function_list[queryType]; //gets the function from the asset_services object
  }

  /*------------------------Notification Services-------------------------*/

  get_notification_services() {
    return this.Notification_Services;
  }

  NotificationsQueryWrapped(queryType: string, args: []) {
    let notificationFunction =
      this.Notification_Services.get_function_list[queryType]; //gets the function from the notification_services object
    return useQuery({
      queryKey: [queryType],
      queryFn: notificationFunction(...args),
    }); //returns the query_instance
  }

  NotificationsQuery(queryType: string, args: []) {
    return this.Notification_Services.function_list[queryType]; //gets the function from the notification_services object
  }
}
//   /*------------------------Device Services-------------------------*/

//   //gets all tFITs (Used By: filter_dropdown )
//   async get_all_tfits() {
//     const response = await helios_server.get(`devices/tfits`, {
//       timeout: 1500,
//     });
//     return response;
//   }

//   async get_all_regions() {
//     //gets all client asset regions (Used By: filter_dropdown )
//     const response = await helios_server.get(`devices/regions`, {
//       timeout: 1500,
//     });
//     return response;
//   }

//   async get_all_capacities() {
//     const response = await helios_server.get(`caps/most-recent`, {
//       timeout: 1500,
//     });
//     return response;
//   }

//   async get_device_status(tfit_id: number) {
//     const response = await helios_server.get(`devices/status`, {
//       timeout: 1500,
//       params: {
//         id: tfit_id,
//       },
//     });
//     return response;
//   }

//   //gets all tFITs (Used By: filter_dropdown )
//   async get_device_interval() {
//     const response = await helios_server.get(`devices/tfits`, {
//       timeout: 1500,
//     });
//     return response;
//   }

//   /*------------------------Interval Services-------------------------*/

//   //calls /helios-server/temps/assets/most-recent-temps?id=1
//   async get_asset_data_interval(asset_id: number) {
//     //gets all client asset regions (Used By: filter_dropdown )
//     const response = await helios_server.get(
//       `/temps/assets/most-recent-temps`,
//       {
//         timeout: 1500,
//         params: {
//           id: asset_id,
//         },
//       }
//     );
//     return response;
//     helios_server;
//   }

//   //calls /helios-server/temps/assets/most-recent-temps?id=1
//   async get_all_capacities_interval() {
//     //gets all client asset regions (Used By: filter_dropdown )
//     const response = await helios_server.get(`/caps/most-recent`, {
//       timeout: 1500,
//     });
//     return response;
//   }

//   async avg_capacity_hour_aggregate(interval: number, limit: number) {
//     //gets all client asset regions (Used By: filter_dropdown )
//     const response = await helios_server.get(`/caps/capacity-hour-aggregate`, {
//       timeout: 1500,
//       params: {
//         time_interval: interval,
//         limit: limit,
//       },
//     });
//     return response;
//   }

//   /*------------------------Temperature Services-------------------------*/

//   /*
//   // returns three time series arrays of aggregates for max, min, and avg readings
// */
//   async get_aggregate(
//     bucket_type: string,
//     bucket_number: number,
//     asset_number: number
//   ) {
//     /*

//     bucket_type: interval in pg database('1 hour', '1 week', '2 year', etc...)

//   */
//     const response = await helios_server.post(`temps/assets/aggregate`, {
//       bucket_type: bucket_type,
//       bucket_number: bucket_number,
//       asset_number: asset_number,
//     });
//     return response;
//   }
//   async get_range_aggregate(
//     asset_id: number,
//     start_date: string,
//     end_date: string
//   ) {
//     /*

//     bucket_type: interval in pg database('1 hour', '1 week', '2 year', etc...)

//   */
//     const response = await helios_server.post(`temps/assets/range-aggregate`, {
//       //make call using body params
//       asset_id: asset_id,
//       start_date: start_date,
//       end_date: end_date,
//     });
//     return response;
//   }

//   async get_fiber_range(start: number, end: number, tfit: string) {
//     /*

//     start: start point in meters
//     end: end point in meters

//   */
//     const response = await helios_server.post(`temps/fiber/range`, {
//       start: start,
//       end: end,
//       tfit: tfit,
//     });
//     return response;
//   }

//   async get_segment_temps(
//     asset_id: number,
//     raw_table: string,
//     settings_table: string
//   ) {
//     const response = await helios_server.post(`temps/fiber/segment`, {
//       asset_id: asset_id,
//       raw_table: raw_table,
//       settings_table: settings_table,
//     });
//     return response;
//   }

//   // Temporary function to get threshold data
//   // May be replaced later by more specific query route
//   async get_threshold(asset_number: number) {
//     const response = await helios_server.post("temps/assets/aggregate", {
//       bucket_type: "1 hour",
//       bucket_number: 48,
//       asset_number: asset_number,
//     });
//     return response;
//   }

//   async get_max_fiber(asset_id: number) {
//     const response = await helios_server.post(
//       "temps/assets/highest-temperature",
//       {
//         asset_id: asset_id,
//       }
//     );
//     return response;
//   }

//   async get_fiber_aggregate(
//     aggregate_type: string,
//     fiber_id: number,
//     interval: string,
//     start: string,
//     end: string
//   ) {
//     /*
//     aggregate_type: 'max', 'avg'
//     interval: '1 hour', '1 day'
//   */
//     const response = await helios_server.post("temps/fiber/range-aggregate", {
//       aggregate_type: aggregate_type,
//       fiber_id: fiber_id,
//       interval: interval,
//       start: start,
//       end: end,
//     });
//     return response;
//   }

//   async get_hot_assets(startDate: string) {
//     const response = await helios_server.post("temps/assets/hot-assets", {
//       startDate: startDate,
//     });
//     return response;
//   }
