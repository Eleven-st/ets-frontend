// File: ets-frontend/app/(authFragments)/index.tsx

// Import custom themed components for consistent styling
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";

// Axios for making HTTP requests
import axios from "axios"; // Keep this for axios.isAxiosError
import axiosInstance from "../../utils/axiosInstance";

// React hooks
import { useEffect, useState } from "react";

// React Native components for styling, layout, and feedback
import { StyleSheet, View, Text, ToastAndroid, Pressable, ActivityIndicator } from "react-native";

// AsyncStorage for local data persistence
import AsyncStorage from "@react-native-async-storage/async-storage";

// Router for navigation
import { router } from "expo-router";

// Main Login Screen Component
export default function LoginScreen() {
    // State to store logged-in userId (null means not logged in)
    const [userId, setUserId] = useState<string | null>(null);
    // State to manage loading status during async operations (e.g., checking login, sending OTP)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State to store phone number input
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    // Function to send OTP to backend for login
    const sendOTP = async () => {
        // Basic validation for phone number
        if (!phoneNumber || phoneNumber.length < 10) { // Assuming 10-digit phone numbers
            ToastAndroid.show("Please enter a valid phone number", ToastAndroid.SHORT);
            return;
        }

        setIsLoading(true); // Start loading indicator
        try {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/api/auth/initiate-login`;
            const payload = { phone_no: phoneNumber };

            // 🔍 Log the full request for debugging
            console.log("🔄 Sending login request to:", url);
            console.log("📤 Payload:", payload);

            // Corrected API endpoint for initiating login
            const res = await axiosInstance.post(
                `${process.env.EXPO_PUBLIC_API_URL}/api/auth/initiate-login`, // <-- CORRECTED ENDPOINT
                { phone_no: phoneNumber } // Backend expects 'phone_no'
            );

            // Log response for debugging
            console.log("OTP Send Response (LoginScreen):", res.data);

            // Assuming a successful OTP request returns a 2xx status and success: true
            if (res.data && res.data.success) {
                ToastAndroid.showWithGravityAndOffset(
                    `OTP sent to ${phoneNumber}. Please verify.`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );

                // Save login details to local storage for later verification
                await AsyncStorage.setItem(
                    "loginDetails",
                    JSON.stringify({
                        phone_no: phoneNumber, // Store phone_no
                        is_sign_up: false, // Indicate this is a login attempt
                    })
                );

                // Navigate to OTP verification screen
                router.navigate("/(authFragments)/VerifyOTP");
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    `Login failed: ${res.data?.message || 'Unexpected response.'}`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
            }
        } catch (err: any) { // Catch block specifically for Axios errors or network issues
            // Show error toast if backend request fails
            console.error("Error sending OTP (LoginScreen):", err); // Use console.error for errors
            let errorMessage = "Could not connect to backend.";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "No response from backend. Check network or server status.";
            } else {
                errorMessage = err.message || "An unknown error occurred.";
            }

            ToastAndroid.showWithGravityAndOffset(
                `Login failed: ${errorMessage}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                500
            );
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    // Navigate to the SignUp screen
    const navigateToSignUp = () => {
        router.push("/(authFragments)/SignUpScreen");
    };

    // This function is for development purposes only. It currently bypasses login.
    const navigateToHomeDirectly = async () => {
        // DEVELOPMENT ONLY: Simulates a user login by setting a dummy userId.
        await AsyncStorage.setItem("userId", "dev_user_id_123");
        // Navigates directly to the main app, replacing the login screen to prevent going back.
        router.replace("/(mainFragments)");
    };

    // Function to check if a user is already logged in from AsyncStorage
    const checkUserLoggedIn = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId); // Update state to reflect logged-in user
                console.log("User already logged in:", storedUserId);
                // Replace the current screen with the main application stack
                router.replace("/(mainFragments)");
            }
        } catch (error) {
            console.error("Error checking user ID from AsyncStorage:", error);
        } finally {
            setIsLoading(false); // Finished checking login status, now safe to render the form (or redirect)
        }
    };

    // useEffect hook to run `checkUserLoggedIn` once when the component mounts
    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    // Render a loading screen while checking login status
    if (isLoading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Checking login status...</ThemedText>
                <ActivityIndicator size="large" color="#999" style={{ marginTop: 20 }} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Conditional rendering: If no userId found (and not loading), show the login form */}
            {userId === null ? (
                <>
                    <ThemedView
                        style={styles.signInContainer}
                        lightColor="#FFFCF2"
                        darkColor="#252422"
                    >
                        {/* Phone number input field */}
                        <ThemedTextField
                            placeholder={"Phone no."}
                            floatingPlaceholder
                            onChangeText={(text) => setPhoneNumber(text)}
                            keyboardType="phone-pad"
                        />

                        {/* Button to trigger OTP sending */}
                        <ThemedButton
                            style={styles.signInButton}
                            label="Send OTP"
                            onPress={sendOTP}
                            disabled={isLoading}
                        />
                    </ThemedView>

                    {/* Pressable link to sign-up screen */}
                    <Pressable
                        style={styles.signUpContainer}
                        onPress={navigateToSignUp}
                    >
                        <ThemedText highlight>Sign Up instead</ThemedText>
                    </Pressable>

                    {/* Pressable link to directly go home (for development purposes only) */}
                    <Pressable
                        style={styles.signUpContainer}
                        onPress={navigateToHomeDirectly}
                    >
                        <ThemedText highlight>Go to home (Dev Only)</ThemedText>
                    </Pressable>
                </>
            ) : (
                <ThemedText>Redirecting to home...</ThemedText>
            )}
        </ThemedView>
    );
}

// Stylesheet for styling the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },

    signInContainer: {
        width: "80%",
        borderRadius: 20,
        padding: 30,
    },

    signInButton: {
        width: "100%",
        marginTop: 20,
    },

    signUpContainer: {
        marginTop: 20,
    },
});
