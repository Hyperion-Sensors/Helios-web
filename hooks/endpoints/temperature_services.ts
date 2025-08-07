import helios_server from ".";

// returns three time series arrays of aggregates for max, min, and avg readings
/*

*/
export async function get_aggregate(
  bucket_type: string,
  bucket_number: number,
  asset_number: number
) {
  /*

    bucket_type: interval in pg database('1 hour', '1 week', '2 year', etc...)

  */
  const response = await helios_server.post(`temps/assets/aggregate`, {
    bucket_type: bucket_type,
    bucket_number: bucket_number,
    asset_number: asset_number,
  });
  return response;
}

/*
Purpose: Get the aggregate data for a given fiber segment
*/
export async function get_last_day_segment(
  bucket_type: string,
  bucket_number: number,
  fiber_name: string
) {
  /*

    bucket_type: interval in pg database('1 hour', '1 week', '2 year', etc...)

  */
  const response = await helios_server.post(`temps/fiber/aggregate`, {
    bucket_type: bucket_type,
    bucket_number: bucket_number,
    fiber_name: fiber_name,
  });
  return response;
}
export async function get_range_aggregate(
  asset_id: number,
  start_date: string,
  end_date: string
) {
  /*

    bucket_type: interval in pg database('1 hour', '1 week', '2 year', etc...)

  */
  const response = await helios_server.post(`temps/assets/range-aggregate`, {
    //make call using body params
    asset_id: asset_id,
    start_date: start_date,
    end_date: end_date,
  });
  return response;
}

export async function get_fiber_range(
  start: number,
  end: number,
  tfit: string
) {
  /*

    start: start point in meters
    end: end point in meters

  */
  const response = await helios_server.post(`temps/fiber/range`, {
    start: start,
    end: end,
    tfit: tfit,
  });
  return response;
}

export async function get_segment_temps(
  asset_id: number,
  raw_table: string,
  settings_table: string,
  imperial?: boolean
) {
  const response = await helios_server.post(`temps/fiber/segment`, {
    asset_id: asset_id,
    raw_table: raw_table,
    settings_table: settings_table,
    imperial: imperial,
  });
  return response;
}

// Temporary function to get threshold data
// May be replaced later by more specific query route
export async function get_threshold(asset_number: number) {
  const response = await helios_server.post("temps/assets/aggregate", {
    bucket_type: "1 hour",
    bucket_number: 48,
    asset_number: asset_number,
  });
  return response;
}

export async function get_max_fiber(asset_id: number) {
  const response = await helios_server.post(
    "temps/assets/highest-temperature",
    {
      asset_id: asset_id,
    }
  );
  return response;
}

export async function get_fiber_aggregate(
  aggregate_type: string,
  fiber_id: number,
  interval: string,
  start: string,
  end: string
) {
  /*
    aggregate_type: 'max', 'avg'
    interval: '1 hour', '1 day'
  */
  const response = await helios_server.post("temps/fiber/range-aggregate", {
    aggregate_type: aggregate_type,
    fiber_id: fiber_id,
    interval: interval,
    start: start,
    end: end,
  });
  return response;
}

export async function get_hot_assets(startDate: string) {
  const response = await helios_server.post("temps/assets/hot-assets", {
    startDate: startDate,
  });
  return response;
}
