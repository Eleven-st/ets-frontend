{
    /* <DateTimePicker
    label="Date of Birth"
    // placeholder={"Placeholder"}
    mode={"date"}
/>; */
}

import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DateTimePicker, type DateTimePickerProps } from "react-native-ui-lib";

export type ThemedDateTimePickerProps = DateTimePickerProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedDateTimePicker({
    style,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedDateTimePickerProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DateTimePicker color={color} floatingPlaceholder {...otherProps} />;
}

const styles = StyleSheet.create({});
