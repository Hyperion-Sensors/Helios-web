import { useQuery } from "@tanstack/react-query";
import { get_problem_fibers } from "hooks/endpoints/device_services";

export default function useProblemFibers() {
  return useQuery({
    queryKey: ["problem_fibers"],
    queryFn: () => get_problem_fibers(),
  });
}
