import { View } from "react-native-ui-lib";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { Pressable, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemedHeaderProps = {
    headerText: string;
    lightColor?: string;
    darkColor?: string;
    toggle?: boolean;
    setScreenState?: any;
};

export function ThemedHeader({
    headerText,
    lightColor,
    darkColor,
    toggle,
    setScreenState,
    ...otherProps
}: ThemedHeaderProps) {
    const headerBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "headerBackground"
    );

    // const toggleColor = useThemeColor(
    //     { light: lightColor, dark: darkColor },
    //     "background"
    // );

    const toggleBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "highlight"
    );

    const flexMapping = {
        "User Home": "flex-end",
        "Rescuer Home": "flex-start",
    };

    const handelToggle = async () => {
        let newHomeScreen = "";
        if (headerText.toString() == "User Home") {
            newHomeScreen = "Rescuer Home";
        }
        if (headerText.toString() == "Rescuer Home") {
            newHomeScreen = "User Home";
        }

        await AsyncStorage.setItem("home", newHomeScreen);
        setScreenState(newHomeScreen);
    };

    return (
        <View
            style={[
                { backgroundColor: headerBackgroundColor },
                styles.container,
            ]}
        >
            <ThemedText type="title">{headerText}</ThemedText>
            {toggle && Object.keys(flexMapping).includes(headerText) && (
                <Pressable
                    style={[
                        {
                            backgroundColor: toggleBackgroundColor,
                        },
                        styles.toggleContainer,
                    ]}
                    onPress={handelToggle}
                >
                    <View>
                        <View
                            style={[
                                {
                                    backgroundColor: headerBackgroundColor,
                                },
                                styles.toggleButton,
                                {
                                    alignSelf: flexMapping[headerText],
                                },
                            ]}
                        />
                    </View>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        // height: 20,
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 50,
        flexDirection: "row",
    },
    toggleContainer: {
        padding: 2,
        width: 60,
        height: 30,
        borderRadius: 25,
        borderWidth: 1,
        display: "flex",
        justifyContent: "center",
    },
    toggleButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
});
