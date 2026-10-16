import { type ViewProps } from "react-native";

export type SettingRowProps = ViewProps & {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};