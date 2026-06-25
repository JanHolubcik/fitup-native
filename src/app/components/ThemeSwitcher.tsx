import { Button } from "heroui-native";
import { Uniwind, useUniwind } from "uniwind";
export default function ThemeSettings() {
  const { theme } = useUniwind(); // Returns 'light', 'dark', or 'system'
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    Uniwind.setTheme(nextTheme); // Manually updates the app-wide theme
  };
  return (
    <Button onPress={toggleTheme}>
      <Button.Label>Switch to {theme === "light" ? "Dark Theme" : "Light Theme"}</Button.Label>
    </Button>
  );
}
