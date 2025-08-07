import helios_server from ".";

//gets all inactive tFITs (Used By: filter_dropdown )
export async function get_3d_config(asset_name: string) {
  const response = await helios_server.post(`3d/config`, {
    asset_name: asset_name,
  });
  return response;
}
