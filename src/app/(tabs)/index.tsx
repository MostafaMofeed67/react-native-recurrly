import { Link } from "expo-router";
import { Text } from "react-native";

import { SafeAreaView } from "@/components/SafeAreaView";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 font-sans-bold rounded bg-primary p-4 text-white"
      >
        Go to onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 font-sans-bold rounded bg-primary p-4 text-white"
      >
        Go to signin
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 font-sans-bold rounded bg-primary p-4 text-white"
      >
        Go to signup
      </Link>
    </SafeAreaView>
  );
}
