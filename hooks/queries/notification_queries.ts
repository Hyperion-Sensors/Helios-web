import { get_recent_notifications } from "@/API/notification_services";
import { get_segment_temps } from "@/API/temperature_services";
import { Asset } from "@/Types/asset_types";
import { useQuery } from "@tanstack/react-query";

export function getNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await get_recent_notifications()).data,
    refetchInterval: 30 * 1000, //REMEMBER
  });
}
