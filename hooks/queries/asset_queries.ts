import { get_all_regions, get_all_tfits } from "@/API/device_services";
import {
  get_all_capacities_interval,
  get_asset_data_interval,
} from "@/API/interval_service";
import { useQuery } from "@tanstack/react-query";
import { get_all_assets, get_fibers } from "hooks/endpoints/asset_services";

export default function useAssets() {
  return useQuery({ queryKey: ["assets"], queryFn: () => get_all_assets() });
}

export function useAssetCapacity() {
  return useQuery({
    queryKey: ["asset_capacity"],
    queryFn: () => get_all_capacities_interval(),
    refetchInterval: 30 * 1000,
  });
}

export function useAssetFiberTemperatures(asset_id: number) {
  return useQuery({
    queryKey: ["asset_fiber_temps", asset_id],
    queryFn: () => get_asset_data_interval(asset_id),
    refetchInterval: 30 * 1000,
  });
}

//get fibers by asset
export function useFibers(asset_id: number) {
  return useQuery({
    queryKey: ["asset_fibers", asset_id],
    queryFn: () => get_fibers(asset_id),
  });
}

export function useTfits() {
  return useQuery({
    queryKey: ["all_tfits"],
    queryFn: () => get_all_tfits(),
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ["all_regions"],
    queryFn: () => get_all_regions(),
  });
}
