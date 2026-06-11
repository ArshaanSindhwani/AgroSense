import { theme as appTheme } from "../constants/theme";
import { useColorScheme } from "./useColorScheme";

export function useThemeColor(props = {}, colorName) {
  const colourScheme = useColorScheme() ?? "light";

  const colorFromProps = props[colourScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return appTheme.colours[colorName];
}