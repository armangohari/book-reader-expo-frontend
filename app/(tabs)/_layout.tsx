import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.background,
          height: 72,
          borderTopStartRadius: 72,
          borderTopEndRadius: 72,
          marginTop: -72,
          paddingHorizontal: 32,
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabIconInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="library" size={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <View className="bg-primary rounded-2xl p-1.5">
              <Ionicons name="add" size={36} color={Colors.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={36} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
