import helios_server from ".";
import { Filter } from "@/Types/asset_types";

//gets all inactive tFITs (Used By: filter_dropdown )
export async function get_all_assets() {
  const response = await helios_server.get(`assets/all`, { timeout: 1500 });
  return response.data;
}

//gets all active tFITs (Used By: filter_dropdown )
export async function get_active() {
  const response = await helios_server.get(`assets/active`, { timeout: 1500 });
  return response;
}

//gets all inactive tFITs (Used By: filter_dropdown )
export async function get_inactive() {
  const response = await helios_server.get(`assets/inactive`, {
    timeout: 1500,
  });
  return response;
}

//gets all inactive tFITs (Used By: filter_dropdown )
export async function get_filtered_assets(filter: Filter) {
  const response = await helios_server.post(`assets/filtered`, filter);
  return response;
}

export async function get_by_device(tfit_id: number) {
  const response = await helios_server.post(`assets/device`, {
    tfit_id: tfit_id,
  });
  return response;
}

export async function get_fibers(asset_id: number) {
  const response = await helios_server.post(`assets/fibers`, {
    asset_id: asset_id,
  });
  return response;
}
