import { Redirect } from "expo-router";
import type { JSX } from "react";

export default function IndexRedirect(): JSX.Element {
  return <Redirect href="/(tabs)/dashboard" />;
}
