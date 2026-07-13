import React from "react";
import { View } from "react-native";
import { Dialog, Typography, Button } from "heroui-native";
import { GestureDetector } from "react-native-gesture-handler";

import FoodRecordModal from "../components/dashboard/FoodRecordModal";
import useAddRecord from "@/hooks/useAddRecord";
import SelectModeView from "../components/add-record/SelectModeView";
import ManualSearchModeView from "../components/add-record/ManualSearchModeView";
import ScannerModeView from "../components/add-record/ScannerModeView";

const AddRecordScreen = () => {
  const {
    t,
    isDark,
    searchMode,
    setSearchMode,
    searchTerm,
    setSearchTerm,
    selectedFood,
    isRecordModalOpen,
    setIsRecordModalOpen,
    isNotFoundOpen,
    setIsNotFoundOpen,
    swipeGesture,
    foodOptions,
    debouncedSearchTerm,
    isScanningProduct,
    showSkeleton,
    paddingTop,
    handleClear,
    handleFoodSelect,
    getMacroLabel,
    handleScan,
    handleNotFoundYes,
    activeTimeFrame,
    error,
    refetch,
  } = useAddRecord();

  return (
    <>
      <GestureDetector gesture={swipeGesture}>
        <View className="flex-grow flex-1 bg-zinc-50 dark:bg-zinc-950 px-4" style={{ paddingTop }}>
          {searchMode === "select" && (
            <SelectModeView onSelectModeChange={setSearchMode} t={t} />
          )}

          {searchMode === "manual" && (
            <ManualSearchModeView
              onSelectModeChange={setSearchMode}
              t={t}
              isDark={isDark}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showSkeleton={showSkeleton}
              handleClear={handleClear}
              foodOptions={foodOptions}
              error={error}
              refetch={refetch}
              debouncedSearchTerm={debouncedSearchTerm}
              handleFoodSelect={handleFoodSelect}
              getMacroLabel={getMacroLabel}
            />
          )}

          {searchMode === "scanner" && (
            <ScannerModeView
              onSelectModeChange={setSearchMode}
              t={t}
              isDark={isDark}
              isRecordModalOpen={isRecordModalOpen}
              isNotFoundOpen={isNotFoundOpen}
              handleScan={handleScan}
              isScanningProduct={isScanningProduct}
            />
          )}
        </View>
      </GestureDetector>

      <FoodRecordModal
        key={selectedFood ? `new-${selectedFood.id}-${activeTimeFrame}` : "new-none"}
        isOpen={isRecordModalOpen}
        onOpenChange={setIsRecordModalOpen}
        food={selectedFood}
        timeOfDay={activeTimeFrame}
        mode="new"
        onCloseAll={() => {
          setIsRecordModalOpen(false);
          setSearchMode("select");
        }}
      />

      <Dialog isOpen={isNotFoundOpen} onOpenChange={setIsNotFoundOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50" />
          <Dialog.Content className={`w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl gap-4 ${isDark ? "dark" : ""}`}>
            <View className="flex-col gap-1 items-start">
              <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
                {t("modalBarcodeScan.addNewFood")}
              </Typography.Heading>
              <Typography.Paragraph className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {t("modalBarcodeScan.notFoundPrompt")}
              </Typography.Paragraph>
            </View>
            <View className="flex-row justify-end gap-3 mt-4">
              <Button
                variant="outline"
                className="py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-10 justify-center items-center"
                onPress={() => {
                  setIsNotFoundOpen(false);
                  setSearchMode("select");
                }}
              >
                <Button.Label className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                  {t("modalBarcodeScan.cancel")}
                </Button.Label>
              </Button>
              <Button
                variant="primary"
                className="py-2 px-4 rounded-xl bg-blue-600 h-10 justify-center items-center"
                onPress={handleNotFoundYes}
              >
                <Button.Label className="text-white text-sm font-semibold">
                  {t("modalBarcodeScan.yes")}
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};

export default AddRecordScreen;
