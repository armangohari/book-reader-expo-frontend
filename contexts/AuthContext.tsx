import axiosBase from "@/services/axiosBase";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ToastAndroid } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

export type AuthProps = {
  authState?: {
    userId: number | null;
    token: string | null;
    authenticated: boolean | null;
  };
  register?: (credentials: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role: "admin" | "user";
  }) => Promise<any>;
  login?: (credentials: { username: string; password: string }) => Promise<any>;
  logout?: () => Promise<any>;
};

type RegisterType = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "user";
};

type LoginType = {
  username: string;
  password: string;
};

export const AuthContext = createContext<AuthProps>({
  authState: {
    userId: null,
    token: null,
    authenticated: null,
  },
  register: () => new Promise(async () => {}),
  login: () => new Promise(async () => {}),
  logout: () => new Promise(async () => {}),
});

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  const [authState, setAuthState] = useState<{
    userId: number | null;
    token: string | null;
    authenticated: boolean | null;
  }>({
    userId: null,
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    await axiosBase
      .post(
        "/auth/jwt-check",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res?.status == 200) {
          axiosBase.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          setAuthState({
            userId: res?.data?.userId,
            token: token,
            authenticated: true,
          });
          router.replace("/(tabs)/");
        }
      })
      .catch(() => {
        logout();
      });
  };

  const showToast = (message: string) => {
    if (message) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.error("Attempted to show a toast with an empty or null message");
    }
  };

  const register = async ({
    username,
    firstName,
    lastName,
    password,
    role,
  }: RegisterType) => {
    await axiosBase
      .post("/auth/register", {
        username,
        firstName,
        lastName,
        password,
        role,
      })
      .then((res) => {
        if (res?.status === 201) {
          router.replace("/(auth)/login");
          showToast(res?.data?.message);
        }
      })
      .catch((err) => {
        showToast(err?.response?.data?.message);
      });
  };

  const login = async ({ username, password }: LoginType) => {
    await axiosBase
      .post("/auth/login", { username, password })
      .then(async (res) => {
        if (res?.status === 200) {
          showToast(`${res?.data?.message}\nWelcome ${username}`);
          router.replace("/(tabs)/");
          const token = res?.data?.token;
          const userId = res?.data?.userId;
          setAuthState({ userId, token, authenticated: true });
          await SecureStore.setItemAsync("token", token);
        }
      })
      .catch((err) => {
        showToast(err?.response?.data?.message);
      });
  };

  const logout = async () => {
    router.replace("/(auth)/login");
    showToast("Please Login / Sign up to continue!");
    setAuthState({ userId: null, token: null, authenticated: false });
    await SecureStore.deleteItemAsync("token");
  };

  const authValue: AuthProps = {
    authState: authState,
    register: register,
    login: login,
    logout: logout,
  };

  return (
    <RootSiblingParent>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </RootSiblingParent>
  );
}

export const useAuth = () => {
  return useContext<AuthProps>(AuthContext);
};
