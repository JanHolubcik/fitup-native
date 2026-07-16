import React from "react";
import { View } from "react-native";
import { Separator, Typography, Switch, Select } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind, Uniwind } from "uniwind";
import { useTranslation } from "../../../../hooks/useTranslation";
import { FlagIcon } from "../../common/FlagIcon";
import CardUniversal from "../../common/CardUniversal";

const LanguageAndThemeCard = () => {
  const { t, locale, changeLanguage, supportedLanguages } = useTranslation("profile");
  const { theme } = useUniwind();

  const isDark = theme === "dark";

  const handleThemeChange = (checked: boolean) => {
    Uniwind.setTheme(checked ? "dark" : "light");
  };

  const currentLang = supportedLanguages.find((lang) => lang.code === locale);
  const selectedLangOption = {
    value: locale,
    label: currentLang ? currentLang.name : locale.toUpperCase(),
  };

  const handleLanguageChange = (opt: { value: string; label: string } | undefined) => {
    if (opt && opt.value) {
      changeLanguage(opt.value);
    }
  };

  return (
    <CardUniversal>
      <CardUniversal.Header className="pb-2 pt-6 px-6">
        <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
          {t("languageAndTheme")}
        </Typography.Heading>
      </CardUniversal.Header>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />
      <CardUniversal.Body className="px-6 py-2">
        {/* Appearance Row */}
        <View className="flex-row items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-800/50">
          <View className="flex-row items-center gap-3 flex-1 pr-4">
            <View className="p-2 rounded-xl bg-accent/15">
              <Ionicons
                name={isDark ? "moon-outline" : "sunny-outline"}
                size={22}
                color={isDark ? "#38bdf8" : "#0284c7"}
              />
            </View>
            <View className="flex-1">
              <Typography.Heading type="h5" className="font-bold text-zinc-900 dark:text-white">
                {t("appearance")}
              </Typography.Heading>
              <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t("appearanceDesc")}
              </Typography.Paragraph>
            </View>
          </View>
          <Switch isSelected={isDark} onSelectedChange={handleThemeChange}>
            <Switch.Thumb />
          </Switch>
        </View>

        {/* Language Row */}
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3 flex-1 pr-4">
            <View className="p-2 rounded-xl bg-accent/15">
              <Ionicons name="globe-outline" size={22} color={isDark ? "#38bdf8" : "#0284c7"} />
            </View>
            <View className="flex-1">
              <Typography.Heading type="h5" className="font-bold text-zinc-900 dark:text-white">
                {t("language")}
              </Typography.Heading>
              <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t("languageDesc")}
              </Typography.Paragraph>
            </View>
          </View>
          <View className="w-[72px]">
            <Select
              value={selectedLangOption}
              onValueChange={handleLanguageChange}
              presentation="dialog"
            >
              <Select.Trigger className="flex-row items-center justify-between border border-zinc-200 dark:border-zinc-800 px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 h-10 w-full">
                <FlagIcon code={locale as "en" | "sk"} width={22} height={15} />
                <Select.TriggerIndicator />
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay className="bg-black/50" />
                <Select.Content
                  presentation="dialog"
                  className={`bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-[75%] max-w-[240px] self-center ${isDark ? "dark" : ""}`}
                >
                  <Select.ListLabel className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3 px-2">
                    {t("language")}
                  </Select.ListLabel>
                  {supportedLanguages.map((lang, index) => (
                    <Select.Item
                      key={lang.code}
                      value={lang.code}
                      label={lang.name}
                      className={`flex-row items-center justify-between py-3 px-3 rounded-xl active:bg-zinc-100 dark:active:bg-zinc-800 ${index > 0 ? "mt-1" : ""}`}
                    >
                      <View className="flex-row items-center gap-2.5">
                        <FlagIcon code={lang.code as "en" | "sk"} width={20} height={13} />
                        <Select.ItemLabel className="text-zinc-900 dark:text-white font-semibold text-sm" />
                      </View>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
          </View>
        </View>
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default LanguageAndThemeCard;

