import useAuth from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type RegisterFormType = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "user";
};

export default function Register() {
  const authContext = useAuth();
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);
  const [formState, setFormState] = useState<RegisterFormType>({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "user",
  });

  const handlePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  const handleInputChange = (name: keyof RegisterFormType, value: string) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSignup = async () => {
    if (typeof authContext?.register === "function") {
      await authContext.register(formState);
    }
  };

  return (
    <View className="flex-1 gap-2 justify-center items-center">
      {/* Title */}
      <View className="mb-10">
        <Text className="text-4xl font-bold">Register</Text>
      </View>

      {/* Register Form */}
      <View className="grid gap-2 mb-8">
        <View className="w-[70vw]">
          <Text className="mb-1 text-lg font-light">Username</Text>
          <TextInput
            id="register-username"
            className="border-1 py-2 px-3 rounded-xl w-full border focus:border-primary focus:border-2"
            value={formState.username}
            onChangeText={(text) => handleInputChange("username", text)}
          />
        </View>
        <View className="w-[70vw]">
          <Text className="mb-1 text-lg font-light">First Name</Text>
          <TextInput
            id="firstName"
            className="border-1 py-2 px-3 rounded-xl w-full border focus:border-primary focus:border-2"
            value={formState.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
          />
        </View>
        <View className="w-[70vw]">
          <Text className="mb-1 text-lg font-light">Last Name</Text>
          <TextInput
            id="lastName"
            className="border-1 py-2 px-3 rounded-xl w-full border focus:border-primary focus:border-2"
            value={formState.lastName}
            onChangeText={(text) => handleInputChange("lastName", text)}
          />
        </View>
        <View className="w-[70vw]">
          <Text className="mb-1 text-lg font-light">Password</Text>
          <TextInput
            className="border-1 py-2 px-3 pr-11 rounded-xl w-full border focus:border-primary focus:border-2"
            id="register-password"
            value={formState.password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry={!isPassVisible}
          />
          <Pressable
            className="absolute right-0 bottom-0 p-3"
            onPress={handlePasswordVisibility}
          >
            <Ionicons
              name={isPassVisible ? "eye-off" : "eye"}
              size={24}
              color="#bbb"
            />
          </Pressable>
        </View>
      </View>

      {/* Sign Up Button */}
      <Pressable
        className="bg-primary rounded-xl py-3 w-[70vw] mb-2"
        onPress={handleSignup}
      >
        <Text className="text-2xl text-white text-center">Sign Up</Text>
      </Pressable>

      {/* Login Route */}
      <Text>
        Already have an account?{" "}
        <Link href="/(auth)/login" className="text-primary font-semibold">
          Login
        </Link>
      </Text>
    </View>
  );
}
