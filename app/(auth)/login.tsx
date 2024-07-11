import useAuth from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type LoginFormType = {
  username: string;
  password: string;
};

export default function Login() {
  const authContext = useAuth();
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);
  const [formState, setFormState] = useState<LoginFormType>({
    username: "",
    password: "",
  });

  const handlePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  const handleInputChange = (name: keyof LoginFormType, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (typeof authContext?.login === "function") {
      await authContext.login(formState);
    }
  };

  return (
    <View className="flex-1 gap-2 justify-start items-center mt-16">
      {/* Title */}
      <View className="mb-10">
        <Text className="text-4xl font-bold">Login</Text>
      </View>

      {/* Login Form */}
      <View className="grid gap-2 mb-8">
        {/* Username */}
        <View className="w-[70vw]">
          <Text className="mb-1 text-lg font-light">Username</Text>
          <TextInput
            id="login-username"
            className="py-2 px-3 rounded-xl w-full bg-white focus:border-primary focus:border-2"
            value={formState.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />
        </View>
        {/* Password */}
        <View className="w-[70vw] relative">
          <Text className="mb-1 text-lg font-light">Password</Text>
          <TextInput
            className="py-2 px-3 pr-11 rounded-xl w-full bg-white focus:border-primary focus:border-2"
            id="login-password"
            value={formState.password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry={!isPassVisible}
            autoCapitalize="none"
          />
          <Pressable
            className="absolute right-0 bottom-0 p-3"
            onPress={handlePasswordVisibility}
          >
            <Ionicons
              name={isPassVisible ? "eye-off" : "eye"}
              size={24}
              color="#ccc"
            />
          </Pressable>
        </View>
      </View>

      {/* Login Button */}
      <Pressable
        className="bg-primary rounded-xl py-3 w-[70vw] mb-2"
        onPress={handleLogin}
      >
        <Text className="text-2xl text-white text-center">Login</Text>
      </Pressable>

      {/* Sign Up Route */}
      <Text>
        Don't have an account?{" "}
        <Link href="/(auth)/register" className="text-primary font-semibold">
          Sign Up
        </Link>
      </Text>
    </View>
  );
}
