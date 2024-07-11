import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/axiosBase";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type UserType = {
  userId: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  role: "admin" | "user" | null;
};

type UserInfoListType = UserInfoCardProps[];

export default function Profile() {
  const authContext = useAuth();
  const [userInfoList, setUserInfoList] = useState<UserInfoListType>([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userId = authContext.authState?.userId;
    await axiosBase
      .get(`/users/${userId}`)
      .then((res) => {
        const user = res?.data?.user;
        setUserInfoList([
          {
            label: "Username",
            value: "@" + user.username,
          },
          {
            label: "First Name",
            value: user.firstName,
          },
          {
            label: "Last Name",
            value: user.lastName,
          },
          {
            label: "Role",
            value: user.role,
          },
        ]);
      })
      .catch((err) => {
        console.error(
          "Error in fetching user data, Error:",
          err?.response?.data
        );
      });
  };

  const handleLogout = async () => {
    if (typeof authContext?.logout === "function") {
      await authContext.logout();
    }
  };

  return (
    <View className="flex-1 gap-2 mt-6 justify-start items-center">
      {/* Header */}
      <Text className="text-3xl font-bold text-center mb-6">Profile</Text>

      {/* User Info */}
      <View>
        {userInfoList.map(({ label, value }) => (
          <UserInfoCard key={label} label={label} value={value} />
        ))}
      </View>

      {/* Logout Button */}
      <Pressable className="px-6 py-3 bg-primary rounded-xl min-w-[40vw]">
        <Text className="text-white text-xl text-center" onPress={handleLogout}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}

type UserInfoCardProps = {
  label: string;
  value: string;
};

function UserInfoCard({ label, value }: UserInfoCardProps) {
  return (
    <View className="flex-1 min-w-[40vw] rounded-xl justify-center items-center bg-gray-50 mb-3 px-3 shadow-xl max-h-24">
      <Text className="text-gray-500 text-xs mb-3">{label}</Text>
      <Text className="text-lg">{value}</Text>
    </View>
  );
}
