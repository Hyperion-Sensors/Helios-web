import { data_options, general } from "@/Types/settings_types";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  change_multiple_settings,
  get_user_settings,
} from "hooks/endpoints/settings_services";

export function useSettings(user_id: string) {
  return useQuery({
    queryKey: ["user_settings"],
    queryFn: () => get_user_settings(user_id),
  });
}

// export function mutateSettings() {
//   return useMutation({
//     mutationKey: ["change_single_setting"],
//     mutationFn: (
//       settings_type: string,
//       settings_changes: general | data_options,
//       user_id: string = "5599837b-fda5-4725-9708-dc93118663d0"
//     ) => change_multiple_settings(settings_type, settings_changes, user_id),
//   });
// }
