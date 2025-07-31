// Importing themed UI components for consistent dark/light mode support
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";

// External libraries and hooks
import axios from "axios";
import { useState } from "react";
import { StyleSheet, ToastAndroid, ScrollView, ActivityIndicator } from "react-native"; // Added ActivityIndicator
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Custom components for Date and Picker input
import { ThemedDateTimePicker } from "@/components/ThemedDatePicker";
import { ThemedPicker } from "@/components/ThemedPicker";

// Main SignUpScreen component
export default function SignUpScreen() {
    // Gender and blood type dropdown options
    const genderData = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
    ];

    const bloodTypeData = [
        { label: "A+", value: "A+" },
        { label: "A-", value: "A-" },
        { label: "B+", value: "B+" },
        { label: "B-", value: "B-" },
        { label: "AB+", value: "AB+" },
        { label: "AB-", value: "AB-" },
        { label: "O+", value: "O+" },
        { label: "O-", value: "O-" },
    ];

    // States to track form data and loading status
    const [personalDetails, setPersonalDetails] = useState<any>({});
    const [emegencyDetails, setEmergencyDetails] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state

    // Updates personalDetails state dynamically for all fields
    const handlePersonalDetailChange = (label: string, text: string) => {
        setPersonalDetails((prevDetails: any) => {
            // If DOB is being changed, convert to ISO string
            if (label === "dob") {
                const ISOString = new Date(text).toISOString();
                return {
                    ...prevDetails,
                    [label]: ISOString,
                };
            }

            return {
                ...prevDetails,
                [label]: text,
            };
        });
    };

    // Updates emergency contact details
    const handleEmegencyDetailChange = (label: string, text: string) => {
        setEmergencyDetails((prevDetails: any) => ({
            ...prevDetails,
            [label]: text,
        }));
    };

    // Sends OTP to user's phone number using backend API
    const sendOTP = async () => {
        // Basic validation for phone number
        if (!personalDetails.phone_no || personalDetails.phone_no.length < 10) {
            ToastAndroid.show("Please enter a valid phone number for personal details.", ToastAndroid.SHORT);
            return;
        }
        // Add more validation for other required fields if necessary
        // Ensure all required fields for initiate_signup are present in personalDetails and emergencyDetails

        setIsLoading(true); // Start loading indicator
        try {
            // Merge personal and emergency details for the full signup payload
            const dataToSend = {
                ...personalDetails,
                emergency_contact: emegencyDetails, // Corrected typo: 'emegency_contact' to 'emergency_contact' if backend expects it
            };

            console.log("Sign Up Payload:", dataToSend); // Log full data for debugging

            // Make POST request to back-end to trigger OTP for signup
            // Corrected API endpoint for initiating signup, and sending full dataToSend
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_API_URL}/api/auth/initiate-signup`, // <-- CORRECTED ENDPOINT
                dataToSend // <-- Sending the full data object
            );

            console.log("OTP Send Response (SignUpScreen):", res.data);

            // Assuming a successful OTP request returns a 2xx status and success: true
            if (res.data && res.data.success) {
                ToastAndroid.showWithGravityAndOffset(
                    `OTP sent to ${personalDetails.phone_no}. Please verify.`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );

                // Temporarily store signup details in local storage for later OTP verification
                await AsyncStorage.setItem(
                    "loginDetails",
                    JSON.stringify({ ...personalDetails, is_sign_up: true }) // Indicate this is a signup attempt
                );

                // Navigate to OTP verification screen
                router.navigate("/(authFragments)/VerifyOTP");
            } else {
                 ToastAndroid.showWithGravityAndOffset(
                    `Sign-up failed: ${res.data?.message || 'Unexpected response.'}`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
            }
        } catch (err: any) { // Catch block specifically for Axios errors or network issues
            // Handle errors from backend/API call
            console.error("Error sending OTP (SignUpScreen):", err); // Use console.error for errors
            let errorMessage = "Could not connect to backend.";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "No response from backend. Check network or server status.";
            } else {
                errorMessage = err.message || "An unknown error occurred.";
            }

            ToastAndroid.showWithGravityAndOffset(
                `Sign-up failed: ${errorMessage}`,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                500
            );
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
            >
                <ThemedView
                    style={styles.signInContainer}
                    lightColor="#FFFCF2"
                    darkColor="#252422"
                >
                    {/* Section Header */}
                    <ThemedText type="title">Sign Up !</ThemedText>

                    {/* ----- Personal Details Section ----- */}
                    <ThemedText style={{ marginTop: 20 }}>
                        Personal Details :
                    </ThemedText>

                    {/* Input fields for personal details */}
                    <ThemedTextField
                        placeholder={"First Name"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handlePersonalDetailChange("first_name", text)
                        }
                    />
                    <ThemedTextField
                        placeholder={"Last Name"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handlePersonalDetailChange("last_name", text)
                        }
                    />
                    <ThemedTextField
                        placeholder={"Phone no."}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handlePersonalDetailChange("phone_no", text)
                        }
                        keyboardType="phone-pad"
                    />
                    <ThemedDateTimePicker
                        placeholder="Date of Birth"
                        mode="date"
                        onChange={(date) =>
                            handlePersonalDetailChange("dob", date.toString())
                        }
                    />
                    <ThemedPicker
                        value={personalDetails.gender ?? null}
                        placeholder={"Gender"}
                        floatingPlaceholder
                        onChange={(text: any) => {
                            handlePersonalDetailChange("gender", text);
                        }}
                        items={genderData}
                        useDialog
                        customPickerProps={{
                            migrateDialog: true,
                            dialogProps: {
                                bottom: true,
                                width: "100%",
                                height: "45%",
                            },
                        }}
                    />
                    <ThemedTextField
                        placeholder={"Address"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handlePersonalDetailChange("address", text)
                        }
                    />
                    <ThemedPicker
                        value={personalDetails.blood_type ?? null}
                        placeholder={"Blood Type"}
                        floatingPlaceholder
                        onChange={(text: any) => {
                            handlePersonalDetailChange("blood_type", text);
                        }}
                        items={bloodTypeData}
                        useDialog
                        customPickerProps={{
                            migrateDialog: true,
                            dialogProps: {
                                bottom: true,
                                width: "100%",
                                height: "45%",
                            },
                        }}
                    />

                    {/* ----- Emergency Contact Section ----- */}
                    <ThemedText style={{ marginTop: 40 }}>
                        Emergency Contact :
                    </ThemedText>
                    <ThemedTextField
                        placeholder={"First Name"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handleEmegencyDetailChange("first_name", text)
                        }
                    />
                    <ThemedTextField
                        placeholder={"Last Name"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handleEmegencyDetailChange("last_name", text)
                        }
                    />
                    <ThemedTextField
                        placeholder={"Phone no."}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handleEmegencyDetailChange("phone_no", text)
                        }
                        keyboardType="phone-pad"
                    />
                    <ThemedTextField
                        placeholder={"Relation"}
                        floatingPlaceholder
                        onChangeText={(text) =>
                            handleEmegencyDetailChange("relation", text)
                        }
                    />

                    {/* Button to send OTP */}
                    <ThemedButton
                        style={styles.signInButton}
                        label="Send OTP"
                        onPress={sendOTP}
                        disabled={isLoading}
                    />
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

// Style definitions for layout and appearance
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    scrollContentContainer: {
        padding: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    signInContainer: {
        width: "100%",
        borderRadius: 20,
        padding: 30,
    },

    signInButton: {
        width: "100%",
        borderRadius: 10,
        marginTop: 20,
    },
});
