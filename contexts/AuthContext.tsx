import { axiosBase } from "@/services/axiosBase";
import { showToast } from "@/utils/helpers";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { RootSiblingParent } from "react-native-root-siblings";

type AuthStateType = {
  userId: number | null;
  username: string | null;
  token: string | null;
  authenticated: boolean | null;
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

export type AuthProps = {
  authState: AuthStateType;
  register: (credentials: RegisterType) => Promise<any>;
  login: (credentials: LoginType) => Promise<any>;
  logout: () => Promise<any>;
};

export const AuthContext = createContext<AuthProps>({
  authState: {
    userId: null,
    username: "",
    authenticated: null,
    token: null,
  },
  register: () => new Promise(async () => {}),
  login: () => new Promise(async () => {}),
  logout: () => new Promise(async () => {}),
});

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthStateType>({
    userId: null,
    username: null,
    authenticated: null,
    token: null,
  });

  useEffect(() => {
    checkToken();
  }, [authState.authenticated]);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    await axiosBase
      .post(
        "/auth/jwt-check",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res?.status === 200) {
          axiosBase.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          setAuthState(() => ({
            userId: res?.data?.userId,
            username: res?.data?.username,
            authenticated: true,
            token: token,
          }));
        }
      })
      .catch(() => {
        logout();
      });
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
          const token = res?.data?.token;
          const userId = res?.data?.userId;
          const username = res?.data?.username;
          setAuthState(() => ({
            userId,
            username,
            token,
            authenticated: true,
          }));
          await SecureStore.setItemAsync("token", token);
          router.replace("/(tabs)/");
          showToast(`${res?.data?.message}\nWelcome ${username}`);
        }
      })
      .catch((err) => {
        showToast(err?.response?.data?.message);
      });
  };

  const logout = async () => {
    setAuthState({
      userId: null,
      username: null,
      token: null,
      authenticated: false,
    });
    router.replace("/(auth)/login");
    showToast("Please Login / Sign up to continue!");
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
