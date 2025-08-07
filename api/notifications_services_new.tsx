export default class Notification_Services {
  helios_server: any;
  function_list: any;

  constructor(axios_instance: any) {
    this.helios_server = axios_instance;
  }
  async get_all_notifications() {
    if (this.helios_server != undefined) {
      const response = await this.helios_server.get(`notifications/all`);
      return response;
    }
  }
  //I am getting this error here:TypeError: Cannot read properties of undefined (reading 'helios_server')
  async get_recent_notifications() {
    if (this.helios_server) {
      const response = await this.helios_server.get(`notifications/all`);
      return response;
    }
  }

  get_function_list() {
    return {
      get_all_notifications: this.get_all_notifications,
      get_recent_notifications: this.get_recent_notifications,
    };
  }
}
