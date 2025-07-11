import { useMutation } from "@tanstack/react-query";
import { confirmEmail } from "../services/apiAuth";

export const useConfirmEmail = () => {
  return useMutation({
    mutationFn: (data) => confirmEmail(data),
  });
};
