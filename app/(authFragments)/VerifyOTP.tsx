// File: ets-frontend/app/(authFragments)/verifyOTP.tsx

// Import custom themed components for consistent styling
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";

import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

import { useEffect, useState, useCallback } from "react";
import { StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function VerifyOTPScreen() {
    const [OTP, setOTP] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    const verifyOTP = useCallback(async () => {
        console.log("verifyOTP function called.");
        console.log("Current state: isLoading =", isLoading, ", isVerified =", isVerified);
        if (isLoading || isVerified) {
            console.log("OTP verification blocked by guard due to ongoing request or already verified.");
            return;
        }

        if (!OTP || OTP.length !== 6) {
            ToastAndroid.show("Please enter a valid 6-digit OTP", ToastAndroid.SHORT);
            return;
        }

        setIsLoading(true);
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

            const isSignUp = userDetails.is_sign_up;
            const endpoint = isSignUp
                ? `/api/auth/verify-signup`
                : `/api/auth/verify-login`;

            const payload = { phone_no: userDetails.phone_no, otp: OTP };

            console.log("Verification Payload:", payload);
            console.log("Verification Endpoint (relative):", endpoint);

            const res = await axiosInstance.post(endpoint, payload);

            console.log("Backend response (verify-otp):", res.data);

            if (res.data && res.data.success && res.data.user_details && (res.data.user_details._id || res.data.user_details.id) && res.data.access_token) {
                console.log("Entering SUCCESS block.");
                const userIdToStore = res.data.user_details._id || res.data.user_details.id;
                await AsyncStorage.setItem("userId", userIdToStore);
                console.log("VerifyOTPScreen: Stored userId in AsyncStorage:", userIdToStore); 
                await AsyncStorage.setItem("jwtToken", res.data.access_token);
                console.log("VerifyOTPScreen: Stored jwtToken in AsyncStorage.");

                ToastAndroid.showWithGravityAndOffset(
                    "OTP verified successfully!",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
                setIsVerified(true);
                // --- CRITICAL CHANGE: Navigate directly to /mainFragments/profile with userId parameter ---
                router.navigate({
                    pathname: "/(mainFragments)/profile", // Explicitly target the profile screen
                    params: { userId: userIdToStore } // Pass the newly verified userId as a parameter
                });
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
            if (axios.isAxiosError(err) && err.response) {
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
    }, [OTP, isLoading, isVerified, router]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.signInContainer} lightColor="#FFFCF2" darkColor="#252422">
                <ThemedTextField
                    placeholder={"OTP"}
                    floatingPlaceholder
                    onChangeText={(text) => setOTP(text.replace(/[^0-9]/g, ""))}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={OTP}
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
