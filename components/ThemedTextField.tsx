import { type TextFieldProps } from "react-native-ui-lib";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextField } from "react-native-ui-lib";

export type ThemedTextFieldProps = TextFieldProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextField({
    style,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedTextFieldProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    return <TextField {...otherProps} color={color} />;
}
