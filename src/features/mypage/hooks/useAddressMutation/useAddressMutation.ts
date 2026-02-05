import { useAddAddressMutation } from "./useAddAddressMutation";
import { useDefaultAddressMutation } from "./useDefaultAddressMutation";
import { useDeleteAddressMutation } from "./useDeleteAddressMutation";
import { useUpdateAddressMutation } from "./useUpdateAddressMutation";

export function useAddressMutation() {
  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const defaultAddressMutation = useDefaultAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  return {
    addAddressMutation,
    updateAddressMutation,
    defaultAddressMutation,
    deleteAddressMutation,
  };
}
