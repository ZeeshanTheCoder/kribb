import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

// android tabs
function AndroidLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#007AFF", headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", tabBarIcon: ({ color, size }) =>
            <Ionicons name="home" size={size || 24} color={color} />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search", tabBarIcon: ({ color, size }) =>
            <Ionicons name="search" size={size || 24} color={color} />
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Property", href: isAdmin ? undefined : null, tabBarIcon: ({ color, size }) =>
            <Ionicons name="add-circle" size={size || 24} color={color} />
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved", tabBarIcon: ({ color, size }) =>
            <Ionicons name="heart" size={size || 24} color={color} />
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile", tabBarIcon: ({ color, size }) =>
            <Ionicons name="person" size={size || 24} color={color} />
        }}
      />
    </Tabs>
  );
}

// ios tabs
function IOSLayout() {

  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saved">
        <Icon sf="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      {/* Create Property */}
      {isAdmin && (
        <NativeTabs.Trigger name="create">
          <Icon sf="plus.circle.fill" />
          <Label>Add Property</Label>
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

// tabs layout
export default function TabsLayout() {
  return Platform.OS === "ios" ? <IOSLayout /> : <AndroidLayout />;
}