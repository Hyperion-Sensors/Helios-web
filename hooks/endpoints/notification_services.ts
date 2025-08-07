import helios_server from ".";

export async function get_all_notifications() {
  const response = await helios_server.get(`notifications/all`);
  return response;
}

export async function get_recent_notifications() {
    const response = await helios_server.get(`notifications/all`);
    return response;
  }