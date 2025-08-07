import helios_server from ".";

//gets all tFITs (Used By: filter_dropdown )
export async function get_all_tfits() {
  const response = await helios_server.get(`devices/tfits`, { timeout: 1500 });
  return response;
}

export async function get_all_regions() {
  //gets all client asset regions (Used By: filter_dropdown )
  const response = await helios_server.get(`devices/regions`, {
    timeout: 1500,
  });
  return response;
}

export async function get_all_capacities() {
  const response = await helios_server.get(`caps/most-recent`, {
    timeout: 10000,
  });
  return response;
}

export async function get_device_status(tfit_id: number) {
  const response = await helios_server.get(`devices/status`, {
    timeout: 1500,
    params: {
      id: tfit_id,
    },
  });
  return response;
}
export async function get_problem_fibers() {
  const response = await helios_server.get(`devices/problem-fibers`, {
    timeout: 10000,
  });
  return response.data;
}
