import { useAddFollowingMutation } from "./useAddFollowingMutation";
import { useDeleteFollowingMutation } from "./useDeleteFollowingMutation";

export function useFollowingMutation() {
  const addFollowingMutation = useAddFollowingMutation();
  const deleteFollowingMutation = useDeleteFollowingMutation();

  return {
    addFollowingMutation,
    deleteFollowingMutation,
  };
}
