import { data_options, general } from "@/Types/settings_types";
import helios_server from ".";

export async function get_user_settings(user_id: string) {
  const response = await helios_server.get(`settings/general/user`, {
    params: { sub: user_id },
  });
  return response.data.settings;
}
//I am getting this error here:TypeError: Cannot read properties of undefined (reading 'helios_server')
export async function change_single_setting(
  settings_change: Record<string, unknown>,
  user_id: string
) {
  if (helios_server) {
    const response = await helios_server.patch(
      `settings/general/change-single/${user_id}`,
      { body: settings_change }
    );
    return response;
  }
}

export async function change_multiple_settings(
  settings_type: string,
  settings_changes: general | data_options,
  user_id: string
) {
  if (helios_server) {
    const response = await helios_server.patch(
      `settings/general/change-multi/${user_id}/${settings_type}`,
      { ...settings_changes }
    );
    return response;
  }
}

export async function create_user_settings(user_id: string) {
  if (helios_server) {
    const response = await helios_server.post(`settings/general/create-user`, {
      body: { user_id: user_id },
    });
    return response;
  }
}
