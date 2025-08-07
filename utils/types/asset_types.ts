export interface Asset {
  // description: string;
  name: string;

  region: string;
  // action: string;
  // alertLevel: string;
  device: string;
  coordinates: number[];
  id: number;
  raw_table: string;
  settings_table: string;
  diagnostics_table: string;
  capacity: number | null;
  status: boolean;
  start: number;
  end: number;
  tfit_id: number;
}

export interface Model {
  filename: string;
  id: string;
  measurement: any;
  type: string;
  color: string;
  temp: number;
}

export interface Filter {
  tfits: string[];
  regions: string[];
}

export interface Device {
  name: string;
  id: number;
}

export interface fiberTemp {
  id: number;
  time: string;
  fiber_id: number;
  max: number;
  min: number;
  avg: number;
  name: string;
  asset_id: number;
  start: number;
  end: number;
}

export interface fiberTemps {
  fiber_data: { [key: number]: fiberTemp[] } | null;
  max_fiber_id: string | null;
}

export interface location {
  id: number;
  name: string;
  coordinates: [string, string];
  region: string;
  asset: Asset[];
}

export interface tfit {
  id: number;
  name: string;
  asset: Asset[];
  location: location;
}

export interface raw_fiber {
  id: number;
  name: string;
}
