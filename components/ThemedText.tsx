import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    highlight?: boolean;
    type?: "default" | "title" | "subTitle" | "desc";
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    highlight,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = highlight
        ? useThemeColor({ light: lightColor, dark: darkColor }, "highlight")
        : useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <Text
            style={[
                { color },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "subTitle" ? styles.subTitle : undefined,
                type === "desc" ? styles.desc : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "300",
    },
    title: {
        fontSize: 20,
        fontWeight: "300",
        lineHeight: 32,
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 30,
        marginBottom: 10,
    },
    desc: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "300",
        marginBottom: 8,
    },
});
