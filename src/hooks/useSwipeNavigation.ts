import { Gesture } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { runOnJS } from "react-native-reanimated";

type TargetRoutes = {
  leftTarget?: "/(tabs)/dashboard" | "/(tabs)/add-record" | "/(tabs)/profile";
  rightTarget?: "/(tabs)/dashboard" | "/(tabs)/add-record" | "/(tabs)/profile";
};

const useSwipeNavigation = ({ leftTarget, rightTarget }: TargetRoutes) => {
  const router = useRouter();

  const handleNavigate = (target: "/(tabs)/dashboard" | "/(tabs)/add-record" | "/(tabs)/profile") => {
    router.replace(target);
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      const threshold = 50;
      if (event.translationX < -threshold && leftTarget) {
        runOnJS(handleNavigate)(leftTarget);
      } else if (event.translationX > threshold && rightTarget) {
        runOnJS(handleNavigate)(rightTarget);
      }
    });

  return gesture;
};

export default useSwipeNavigation;
