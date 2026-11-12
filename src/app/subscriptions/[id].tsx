import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text } from "react-native";

import { SafeAreaView } from "@/components/SafeAreaView";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Subscription Details {id}</Text>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        className="mt-4"
      >
        <Text>Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;
