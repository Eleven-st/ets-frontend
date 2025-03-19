import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [logedIn, setLogedIn] = useState(null);

    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack>
                <Stack.Screen
                    name="(authFragments)/index"
                    options={{ title: "Login" }}
                />
                <Stack.Screen
                    name="(authFragments)/SignUpScreen"
                    options={{ title: "Sign Up" }}
                />
                <Stack.Screen
                    name="(authFragments)/VerifyOTP"
                    options={{ title: "Verify OTP" }}
                />
                <Stack.Screen
                    name="(mainFragments)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
        </ThemeProvider>
    );
}
