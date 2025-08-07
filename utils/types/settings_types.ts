export interface settings {
  general: general;
  data_options: data_options;
}

export interface user_settings {
  settings: settings;
  saved_at: Date;
}

export interface general {
  Theme: string;
  Color_Blind_Mode: boolean;
  Side_Panel_Default: boolean;
}

export interface data_options {
  Pinned_Assets: string[];
  Favorite_Widgets: string[];
  Data_Refresh_Rate: number;
}

export interface settings_action {
  type?: string;
  payload: {
    settings_type: string | null;
    settings_change:
      | {
          [key: string]:
            | string
            | number
            | boolean
            | string[]
            | number[]
            | boolean[];
        }
      | settings;
  };
}
export interface settings_tab {
  name: string;
  description: string;
  settings: settings_row[];
  no_access: boolean;
}

export interface settings_row {
  name: string;
  type: string;
}
