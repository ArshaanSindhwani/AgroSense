import {COLOURS} from "../constants/colours"
import {useTheme} from '../context/ThemeContext'

export function useThemeColor(props = {}, colorName) {
  const {colorScheme} = useTheme()

  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return COLOURS[colorScheme][colorName];
}