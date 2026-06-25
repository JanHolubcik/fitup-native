import React from "react";
import { View, ScrollView } from "react-native";
import { Card, Skeleton, Separator } from "heroui-native";

export function ProfileSkeleton(): React.JSX.Element {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <View className="w-full max-w-lg mx-auto gap-6">
        {/* 1. Language & Theme Card Skeleton */}
        <Card className="shadow-md border border-border">
          <Card.Header className="pb-2 pt-6 px-6">
            <Skeleton className="h-6 w-48 rounded-lg bg-default-soft" />
          </Card.Header>
          <Separator className="bg-border" />
          <Card.Body className="px-6 py-2 gap-4">
            <View className="flex-row items-center justify-between py-4 border-b border-default-soft">
              <View className="gap-2 w-3/4">
                <Skeleton className="h-4 w-24 rounded-md bg-default-soft" />
                <Skeleton className="h-3 w-40 rounded-md bg-default-soft" />
              </View>
              <Skeleton className="h-8 w-14 rounded-full bg-default-soft" />
            </View>
            <View className="flex-row items-center justify-between py-4">
              <View className="gap-2 w-3/4">
                <Skeleton className="h-4 w-20 rounded-md bg-default-soft" />
                <Skeleton className="h-3 w-48 rounded-md bg-default-soft" />
              </View>
              <Skeleton className="h-8 w-24 rounded-lg bg-default-soft" />
            </View>
          </Card.Body>
        </Card>

        {/* 2. Account Details Card Skeleton */}
        <Card className="shadow-md border border-border">
          <Card.Header className="pb-2 pt-6 px-6 gap-2">
            <Skeleton className="h-6 w-36 rounded-lg bg-default-soft" />
            <Skeleton className="h-3.5 w-56 rounded-md bg-default-soft" />
          </Card.Header>
          <Separator className="bg-border" />
          <Card.Body className="px-6 py-6 gap-6 items-center">
            <View className="items-center gap-3">
              <Skeleton className="w-20 h-20 rounded-full bg-default-soft" />
              <Skeleton className="h-8 w-28 rounded-lg bg-default-soft" />
            </View>
            <View className="gap-4 w-full">
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <View className="items-end">
                <Skeleton className="h-10 w-full rounded-lg bg-default-soft" />
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* 3. Change Password Card Skeleton */}
        <Card className="shadow-md border border-border">
          <Card.Header className="pb-2 pt-6 px-6 gap-2">
            <Skeleton className="h-6 w-40 rounded-lg bg-default-soft" />
            <Skeleton className="h-3.5 w-64 rounded-md bg-default-soft" />
          </Card.Header>
          <Separator className="bg-border" />
          <Card.Body className="px-6 py-6 gap-4">
            <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
            <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
            <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
            <View className="items-end">
              <Skeleton className="h-10 w-full rounded-lg bg-default-soft" />
            </View>
          </Card.Body>
        </Card>

        {/* 4. Biometric & Goals Card Skeleton */}
        <Card className="shadow-md border border-border">
          <Card.Header className="pb-2 pt-6 px-6 gap-2">
            <Skeleton className="h-6 w-44 rounded-lg bg-default-soft" />
            <Skeleton className="h-3.5 w-60 rounded-md bg-default-soft" />
          </Card.Header>
          <Separator className="bg-border" />
          <Card.Body className="px-6 py-6 gap-4">
            <View className="gap-4">
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
              <Skeleton className="h-12 w-full rounded-xl bg-default-soft" />
            </View>
            <View className="items-end">
              <Skeleton className="h-10 w-full rounded-lg bg-default-soft" />
            </View>
          </Card.Body>
        </Card>

        {/* 5. Delete Account Card Skeleton */}
        <Card className="shadow-md border border-red-200 dark:border-red-950">
          <Card.Header className="pb-2 pt-6 px-6 gap-2">
            <Skeleton className="h-6 w-32 rounded-lg bg-red-100 dark:bg-red-950/35" />
            <Skeleton className="h-3.5 w-56 rounded-md bg-red-100 dark:bg-red-950/35" />
          </Card.Header>
          <Separator className="bg-red-200 dark:bg-red-950" />
          <Card.Body className="px-6 py-6 gap-4">
            <View className="gap-2">
              <Skeleton className="h-4 w-full rounded-md bg-red-100 dark:bg-red-950/35" />
              <Skeleton className="h-4 w-5/6 rounded-md bg-red-100 dark:bg-red-950/35" />
            </View>
            <View className="items-end">
              <Skeleton className="h-10 w-full rounded-lg bg-red-200 dark:bg-red-950/50" />
            </View>
          </Card.Body>
        </Card>
      </View>
    </ScrollView>
  );
}
