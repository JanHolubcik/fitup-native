import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import { Button, Typography } from "heroui-native";

type YesNoModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  confirmColor?: "primary" | "danger";
  isLoading?: boolean;
};

const YesNoModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  confirmColor = "primary",
  isLoading = false,
}: YesNoModalProps) => {
  return (
    <Modal
      transparent
      visible={isOpen}
      onRequestClose={() => onOpenChange(false)}
      animationType="fade"
    >
      <Pressable 
        style={StyleSheet.absoluteFill} 
        className="bg-black/50 justify-center items-center px-6"
        onPress={() => !isLoading && onOpenChange(false)}
      >
        <Pressable 
          className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl gap-4"
          onPress={(e) => e.stopPropagation()}
        >
          <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
            {title}
          </Typography.Heading>
          
          <Typography.Paragraph className="text-zinc-600 dark:text-zinc-400 text-sm">
            {description}
          </Typography.Paragraph>

          <View className="flex-row justify-end gap-3 mt-2">
            <Button
              variant="outline"
              className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-10 justify-center items-center"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              <Button.Label className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                {cancelText}
              </Button.Label>
            </Button>
            
            <Button
              variant={confirmColor === "danger" ? "danger" : "primary"}
              className="py-2.5 px-4 rounded-xl h-10 justify-center items-center"
              onPress={onConfirm}
              isDisabled={isLoading}
            >
              <Button.Label className="text-white text-sm font-semibold">
                {confirmText}
              </Button.Label>
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default YesNoModal;
