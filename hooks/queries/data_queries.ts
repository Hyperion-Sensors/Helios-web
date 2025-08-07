import { get_segment_temps } from "@/API/temperature_services";
import { getAllFiles } from "@/API/file_services";
import { Asset } from "@/Types/asset_types";
import { useQuery } from "@tanstack/react-query";

export function getSegmentChartData(currentAsset: Asset, imperial?: boolean) {
  return useQuery({
    queryKey: ["segment_chart_data", currentAsset, imperial],
    queryFn: () =>
      get_segment_temps(
        currentAsset.id,
        currentAsset.raw_table,
        currentAsset.settings_table,
        imperial
      ),
    refetchInterval: 30 * 1000, //REMEMBER
  });
}

export function useS3Files() {
  return useQuery({
    queryKey: ["all_s3_files"],
    queryFn: () => getAllFiles(),
    refetchInterval: 30 * 1000, //REMEMBER
  });
}
