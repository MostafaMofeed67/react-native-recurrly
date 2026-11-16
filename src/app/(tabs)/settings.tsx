import { useClerk, useUser } from "@clerk/expo";
import images from "@/constants/images";
import { clsx } from "clsx";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

import { SafeAreaView } from "../../../components/SafeAreaView";
import { getAuthErrorMessage } from "../../../lib/auth";

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName || email?.split("@")[0] || "Your account";

  const performSignOut = async () => {
    setIsSigningOut(true);
    try {
      // The root route guard sends the user back to sign-in once the session ends.
      await signOut();
    } catch (error) {
      setIsSigningOut(false);
      Alert.alert("Couldn't sign out", getAuthErrorMessage(error) ?? undefined);
    }
  };

  const confirmSignOut = () => {
    Alert.alert("Sign out?", "You'll need to sign in again to see your subscriptions.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: performSignOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title mb-5">Settings</Text>

      <View className="sub-card flex-row items-center gap-4 bg-card">
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
          className="size-14 rounded-full"
        />
        <View className="min-w-0 flex-1">
          <Text className="sub-title" numberOfLines={1}>
            {name}
          </Text>
          {email ? (
            <Text className="sub-meta" numberOfLines={1}>
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        onPress={confirmSignOut}
        disabled={isSigningOut}
        className={clsx("sub-cancel mt-6", isSigningOut && "sub-cancel-disabled")}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
      >
        <Text className="sub-cancel-text">
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
