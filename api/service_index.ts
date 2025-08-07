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
