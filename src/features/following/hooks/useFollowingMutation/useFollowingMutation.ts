import { useAddFollowingMutation } from "./useAddFollowingMutation";
import { useDeleteFollowingMutation } from "./useDeleteFollowingMutation";

export function useFollowingMutation() {
  const createFollowingMutation = useAddFollowingMutation();
  const deleteFollowingMutation = useDeleteFollowingMutation();

  return {
    createFollowingMutation,
    deleteFollowingMutation,
  };
}
