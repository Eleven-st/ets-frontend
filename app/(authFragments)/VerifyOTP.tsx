// File: ets-frontend/app/(authFragments)/verifyOTP.tsx

// Import custom themed components for consistent styling
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";

// --- IMPORTANT CHANGE 1: Update Axios imports ---
import axios from "axios"; // Keep this for axios.isAxiosError
import axiosInstance from "../../utils/axiosInstance"; // <-- NEW: Import your custom axios instance

import { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function VerifyOTPScreen() {
    const [OTP, setOTP] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // New state to prevent multiple successful verifications
    const [isVerified, setIsVerified] = useState<boolean>(false);

    const verifyOTP = async () => {
        console.log("verifyOTP function called.");
        console.log("Current state: isLoading =", isLoading, ", isVerified =", isVerified);
        // --- START OF GUARD ---
        // If an operation is already in progress (isLoading) or if verification has already succeeded (isVerified),
        // exit the function immediately to prevent duplicate submissions.
        if (isLoading || isVerified) {
            console.log("OTP verification blocked by guard due to ongoing request or already verified.");
            return;
        }
        // --- END OF GUARD ---

        if (!OTP || OTP.length !== 6) {
            ToastAndroid.show("Please enter a valid 6-digit OTP", ToastAndroid.SHORT);
            return;
        }

        setIsLoading(true); // Start loading indicator
        try {
            const userDetailsString = await AsyncStorage.getItem("loginDetails");
            if (!userDetailsString) {
                ToastAndroid.showWithGravityAndOffset(
                    "Login details not found. Please sign in again.",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
                router.replace({ pathname: "/(authFragments)" });
                setIsLoading(false);
                return;
            }
            const userDetails = JSON.parse(userDetailsString);

            // Determine which verification endpoint to hit based on is_sign_up flag
            const isSignUp = userDetails.is_sign_up;
            const endpoint = isSignUp
                ? `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-signup`
                : `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-login`;

            const payload = { phone_no: userDetails.phone_no, otp: OTP };

            console.log("Verification Payload:", payload);
            console.log("Verification Endpoint:", endpoint);

            // --- IMPORTANT CHANGE 2: Use axiosInstance for the API call ---
            // OLD: const res = await axios.post(endpoint, payload);
            const res = await axiosInstance.post(endpoint, payload); // <-- NEW: Use axiosInstance

            console.log("Backend response (verify-otp):", res.data);

            // !!! CRITICAL CHANGE HERE !!!
            // Check for success, user_details, and the presence of either _id or id for the user, AND the token
            if (res.data && res.data.success && res.data.user_details && (res.data.user_details._id || res.data.user_details.id) && res.data.token) { // <-- ADDED res.data.token check
                console.log("Entering SUCCESS block.");
                // Use the ID that exists
                const userIdToStore = res.data.user_details._id || res.data.user_details.id;
                await AsyncStorage.setItem("userId", userIdToStore);
                
                // --- IMPORTANT CHANGE 3: Store the JWT Token ---
                await AsyncStorage.setItem("jwtToken", res.data.token); // <-- NEW: Store the JWT token

                ToastAndroid.showWithGravityAndOffset(
                    "OTP verified successfully!",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
                setIsVerified(true);
                router.navigate("/(mainFragments)");
            } else {
                console.log("Entering FAILURE block after backend response.");
                ToastAndroid.showWithGravityAndOffset(
                    `Verification failed: ${res.data?.message || 'Invalid OTP or data.'}`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
            }
        } catch (err: any) {
            console.error("Error requesting backend (Verify OTP):", err);
            let errorMessage = "Could not verify OTP.";
            // --- IMPORTANT CHANGE 4: Use axios.isAxiosError ---
            if (axios.isAxiosError(err) && err.response) { // Use 'axios.isAxiosError'
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
                console.log("Axios error response data:", err.response.data);
            } else if (err.request) {
                errorMessage = "No response from backend. Check network or server status.";
            } else {
                errorMessage = err.message || "An unknown error occurred.";
            }

            ToastAndroid.showWithGravityAndOffset(
                `OTP verification failed: ${errorMessage}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                500
            );
        } finally {
            setIsLoading(false);
        }
    };


    // --- ENHANCEMENT 1: Add OTP Auto Submit ---
    // This useEffect will run whenever the 'OTP' state changes.
    // If the OTP reaches 6 digits AND we're not already loading/verified, it will call verifyOTP.
    useEffect(() => {
        if (OTP.length === 6 && !isLoading && !isVerified) {
            console.log("OTP length is 6, attempting auto-verify.");
            verifyOTP();
        }
    }, [OTP, isLoading, isVerified]); // Dependencies: re-run if OTP, isLoading, or isVerified changes

    // --- useEffect for auto-focus OTP field or initial checks (if any) ---
    // You might want to add a useEffect here if you plan to fetch loginDetails on component mount
    // to pre-fill phone number, or check if an OTP was recently sent.
    // For now, if the user manually navigates here, it relies on 'loginDetails' being in AsyncStorage.

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.signInContainer} lightColor="#FFFCF2" darkColor="#252422">
                <ThemedTextField
                    placeholder={"OTP"}
                    floatingPlaceholder
                    // --- ENHANCEMENT 2: Sanitize Number Input ---
                    // This ensures only digits are kept in the input.
                    onChangeText={(text) => setOTP(text.replace(/[^0-9]/g, ""))} // <-- MODIFIED LINE
                    keyboardType="number-pad"
                    maxLength={6}
                    value={OTP} // <-- Make sure to bind the value to the OTP state for proper control
                />
                <ThemedButton
                    style={styles.signInButton}
                    label="Verify OTP"
                    onPress={verifyOTP}
                    disabled={isLoading || isVerified}
                />
                {isLoading && <ActivityIndicator size="large" color="#999" style={{ marginTop: 20 }} />}
            </ThemedView>
        </ThemedView>
    );
}

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
});
