import { AxiosInstance } from "axios";
import { Filter } from "@/Types/asset_types";

export class Asset_Services {
  helios_server: AxiosInstance;
  function_list: any;

  constructor(axios_instance: AxiosInstance) {
    this.helios_server = axios_instance;
    this.function_list = {
      all_assets: this.get_all_assets,
      active_assets: this.get_active,
      inactive_assets: this.get_inactive,
      filtered_assets: this.get_filtered_assets,
      asset_by_device: this.get_by_device,
      asset_fibers: this.get_fibers,
    };
  }

  //gets all inactive tFITs (Used By: filter_dropdown )
  async get_all_assets() {
    const response = await this.helios_server.get(`assets/all`, {
      timeout: 1500,
    });
    return response;
  }

  //gets all active tFITs (Used By: filter_dropdown )
  async get_active() {
    const response = await this.helios_server.get(`assets/active`, {
      timeout: 1500,
    });
    return response;
  }

  //gets all inactive tFITs (Used By: filter_dropdown )
  async get_inactive() {
    const response = await this.helios_server.get(`assets/inactive`, {
      timeout: 1500,
    });
    return response;
  }

  //gets all inactive tFITs (Used By: filter_dropdown )
  async get_filtered_assets(filter: Filter) {
    const response = await this.helios_server.post(`assets/filtered`, filter);
    return response;
  }

  async get_by_device(tfit_id: number) {
    const response = await this.helios_server.post(`assets/device`, {
      tfit_id: tfit_id,
    });
    return response;
  }

  async get_fibers(asset_id: number) {
    const response = await this.helios_server.post(`assets/fibers`, {
      asset_id: asset_id,
    });
    return response;
  }
}
