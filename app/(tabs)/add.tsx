import { View, Text } from "react-native";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export default function Add() {
  const authContext = useAuth();

  useEffect(() => {}, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
}
