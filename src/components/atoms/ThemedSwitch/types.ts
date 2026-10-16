import { type SwitchProps } from "react-native";

export type ThemedSwitchProps = Omit<
  SwitchProps,
  'value' | 'onValueChange'
> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};