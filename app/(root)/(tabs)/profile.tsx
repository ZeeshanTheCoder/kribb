import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

  const { signOut } = useAuth();

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.log("Error Sign Out", error)
    }
  }

  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleSignOut} >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
