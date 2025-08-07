import helios_server from ".";

//gets all tFITs (Used By: filter_dropdown )
export async function get_device_interval() {
  const response = await helios_server.get(`devices/tfits`, { timeout: 1500 });
  return response;
}

//calls /helios-server/temps/assets/most-recent-temps?id=1
export async function get_asset_data_interval(asset_id: number) {
  const response = await helios_server.get(`/temps/assets/most-recent-temps`, {
    timeout: 10000,
    params: {
      id: asset_id,
    },
  });
  return response;
}

//calls /helios-server/temps/assets/most-recent-temps?id=1
export async function get_all_capacities_interval() {
  const response = await helios_server.get(`/caps/most-recent`, {
    timeout: 10000,
  });
  return response;
}

export async function avg_capacity_hour_aggregate(
  interval: number,
  limit: number
) {
  const response = await helios_server.get(`/caps/capacity-hour-aggregate`, {
    timeout: 1500,
    params: {
      time_interval: interval,
      limit: limit,
    },
  });
  return response;
}
