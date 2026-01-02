import { useRegisterMutation } from "@/features/auth/hooks/useRegisterMutation";
import { useSocialLoginMutation } from "@/features/auth/hooks/useSocialLoginMutation";

export function useAuth() {
  const socialLoginMutation = useSocialLoginMutation();
  const registerMutation = useRegisterMutation();

  return { socialLoginMutation, registerMutation };
}
