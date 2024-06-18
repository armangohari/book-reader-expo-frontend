import { AuthContext, AuthProps } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function useAuth() {
  return useContext<AuthProps>(AuthContext);
}
