import React, { createContext, useEffect, useState } from "react";

/*-----------------------------API ENDPOINT SERVICE Imports---------------------------------- */
import Data_Services from "../api/service_index";
import { useSession } from "next-auth/react";
import axios, { AxiosInstance } from "axios";
import { useQuery } from "@tanstack/react-query";

type DataContextType = {
  DataServices: any;
};

const DataContext = createContext<DataContextType | null>(null);

//define types of props for main function provider
type Props = {
  children?: React.ReactNode;
  asset_token?: string;
};

// main function provider
const DataProvider: React.FC<Props> = ({ children }) => {
  const { data: session } = useSession();

  if (!session) return null;

  const helios_server: AxiosInstance = axios.create({
    // Axios client for
    baseURL: `http://localhost:8000/helios-server`, //server address must not end in a slash
    timeout: 2000,
    headers: {
      accesstoken: `${session?.accessToken}`,
    },
  });

  const DataServices = new Data_Services(helios_server);
  
  function AssetQueryWrapped(queryType: string, args: []) {
    let assetFunction = this.Asset_Services.function_list[queryType]; //gets the function from the asset_services object
    return useQuery({ queryKey: [queryType], queryFn: assetFunction(...args) }); //returns the query_instance
  }

  function AssetQuery(queryType: string, args: []) {
    return this.Asset_Services.function_list[queryType]; //gets the function from the asset_services object
  }

  /*------------------------Notification Services-------------------------*/

  function NotificationsQueryWrapped(queryType: string, args: []) {
    let notificationFunction =
      this.Notification_Services.function_list[queryType]; //gets the function from the notification_services object
    return useQuery({
      queryKey: [queryType],
      queryFn: notificationFunction(...args),
    }); //returns the query_instance
  }

  function NotificationsQuery(queryType: string, args: []) {
    return this.Notification_Services.function_list[queryType]; //gets the function from the notification_services object
  }

  return (
    <DataContext.Provider
      value={{
        DataServices,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider, DataContext };
