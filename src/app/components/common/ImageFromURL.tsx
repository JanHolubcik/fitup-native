import React, { useState } from "react";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind } from "uniwind";

type ImageFromURLProps = {
  url: string | undefined;
  macroName: string;
  width?: number;
  height?: number;
};

const ImageFromURL = ({
  url,
  macroName,
  width = 75,
  height = 75,
}: ImageFromURLProps) => {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const [hasError, setHasError] = useState(false);

  const sourceUrl = !url
    ? `https://www.themealdb.com/images/ingredients/${encodeURIComponent(macroName)}.png`
    : url;

  if (hasError || !sourceUrl) {
    return (
      <View
        style={{ width, height, borderCurve: "continuous" }}
        className="rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 items-center justify-center border border-zinc-200 dark:border-zinc-800"
      >
        <Ionicons
          name="nutrition-outline"
          size={Math.min(width, height) * 0.4}
          color={isDark ? "#52525b" : "#a1a1aa"}
        />
      </View>
    );
  }

  return (
    <View
      style={{ width, height, borderCurve: "continuous" }}
      className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800"
    >
      <Image
        source={{ uri: sourceUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
        onError={() => setHasError(true)}
      />
    </View>
  );
};

export default ImageFromURL;
