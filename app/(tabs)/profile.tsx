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
    // .get(`/users/${userId}`, )
    .get(`/users/1`, )
      .then((res) => {
        console.log(res) // !delete
        const fetchedUser = res?.data;
        console.log(fetchedUser); // !delete
        setUserInfoList([
          {
            label: "Username",
            value: "@" + fetchedUser.username,
          },
          {
            label: "First Name",
            value: fetchedUser.firstName,
          },
          {
            label: "Last Name",
            value: fetchedUser.lastName,
          },
          {
            label: "Role",
            value: fetchedUser.role,
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
    <View className="flex-1 justify-center items-center">
      {/* User Info */}
      <View className="mb-5">
        {userInfoList.map(({ label, value }) => (
          <UserInfoCard key={label} label={label} value={value} />
        ))}
      </View>

      {/* Logout Button */}
      <Pressable className="px-6 py-3 bg-primary rounded-xl  min-w-[40vw]">
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
    <View className="flex-1 min-w-[40vw] rounded-xl justify-center items-center bg-gray-50 my-2 px-3 shadow-md max-h-24">
      <Text className="text-gray-500 text-sm mb-3">{label}</Text>
      <Text className="text-lg">{value}</Text>
    </View>
  );
}
