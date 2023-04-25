import { Redirect } from "expo-router";
import type { FC } from "react";

export default (() => {
  return <Redirect href="/dashboard" />;
}) satisfies FC; // new comment
