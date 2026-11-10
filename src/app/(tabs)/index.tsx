import { Link } from "expo-router";
import { Text } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSaveAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSaveAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to onboarding</Text>
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to signin</Text>
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to signup</Text>
      </Link>
      <Link
        href="/subscriptions/shopify"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Shopify Subscription</Text>
      </Link>
    </SafeAreaView>
  );
}
