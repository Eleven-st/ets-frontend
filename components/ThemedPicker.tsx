// {<Picker
//     value={personalDetails.gender ? personalDetails.gender : null}
//     placeholder={"Gender"}
//     floatingPlaceholder
//     onChange={(text: any) => {
//         handlePersonalDetailChange("gender", text);
//     }}
//     items={genderData}
// />;

import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Picker, type PickerProps } from "react-native-ui-lib";

export type ThemedPickerProps = PickerProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedPicker({
    style,
    lightColor,
    darkColor,
    ...otherProps
}: ThemedPickerProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <Picker color={color} floatingPlaceholder {...otherProps} />;
}

const styles = StyleSheet.create({});
