import { Button, type ButtonProps } from "react-native-ui-lib";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ButtonProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedButton({
    style,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedViewProps) {
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "highlight"
    );

    return <Button style={[{ backgroundColor }, style]} {...otherProps} />;
}
