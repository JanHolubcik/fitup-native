import React from "react";

import EnglishFlag from "./flags/EnglishFlag";
import SlovakFlag from "./flags/SlovakFlag";
import { SupportedLocale } from "@/i18n/i18n";

type FlagIconProps = {
  code: SupportedLocale;
  width?: number;
  height?: number;
};

const FlagIcon = ({ code, width = 21, height = 14 }: FlagIconProps) => {
  switch (code) {
    case "en":
      return <EnglishFlag width={width} height={height} />;
    case "sk":
      return <SlovakFlag width={width} height={height} />;
    default:
      return null;
  }
};

export default FlagIcon;
