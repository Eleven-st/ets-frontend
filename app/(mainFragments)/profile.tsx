// ets-frontend/app/mainFragments/profile.tsx

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
// --- IMPORTANT CHANGE 1: Update Axios imports ---
import axios from "axios"; // Keep this for axios.isAxiosError
import axiosInstance from "../../utils/axiosInstance"; // <-- NEW: Import your custom axios instance

import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedHeader } from "@/components/ThemedHeader";
import { Image } from "react-native-ui-lib";
import CarPNG from "../../assets/images/car.png";
import { router } from "expo-router"; // <-- Add this import for potential redirection

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null); // Initialize as null or undefined
    const [userId, setUserId] = useState<string | null>(null); // Initialize as null

    // Removed inputUserId and handleChange as they didn't seem to be used for actual input fields

    const fetchUserData = async (id: string) => {
        try {
            console.log("Fetching user data for ID:", id);
            // --- IMPORTANT CHANGE 2: Use axiosInstance for the API call ---
            const res = await axiosInstance.get( // <-- NEW: Use axiosInstance
                `/api/user?user_id=${id}`
            );
            setUser(res.data);
        } catch (err: any) { // Catch block specifically for Axios errors or network issues
            console.error("Error fetching user data:", err); // Using console.error for errors
            let errorMessage = "Unable to load user profile.";

            // --- IMPORTANT CHANGE 3: Add robust Axios error handling ---
            if (axios.isAxiosError(err) && err.response) { // Use 'axios.isAxiosError'
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
                if (err.response.status === 401 || err.response.status === 403) {
                    // Token expired or invalid, redirect to login
                    ToastAndroid.show("Session expired. Please log in again.", ToastAndroid.LONG);
                    await AsyncStorage.removeItem("jwtToken"); // Clear invalid token
                    await AsyncStorage.removeItem("userId"); // Clear user ID
                    router.replace("/(authFragments)"); // Redirect to login
                    return; // Exit function after redirect
                }
            } else if (err.request) {
                errorMessage = "No response from backend. Check network or server status.";
            } else {
                errorMessage = err.message || "An unknown error occurred.";
            }

            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }
    };

    const fetchUserIdFromStorage = async (): Promise<string | null> => {
        try {
            const storedUserId: string | null = await AsyncStorage.getItem("userId");
            if (storedUserId == null) {
                console.warn("userId is null in AsyncStorage. User might not be logged in.");
                router.replace("/(authFragments)"); // <-- Redirect if no userId found
                return null;
            }
            setUserId(storedUserId); // Update the component's state with the fetched ID
            return storedUserId;
        } catch (err) {
            console.error("Error fetching userId from AsyncStorage:", err);
            ToastAndroid.show("Error accessing stored user data.", ToastAndroid.LONG); // <--- ADD THIS
            router.replace("/(authFragments)"); // <-- Redirect on error
            return null; // Return null on error
        }
    };

    // New function to orchestrate fetching both the userId and then the user data
    const loadUserProfile = async () => {
        const storedId = await fetchUserIdFromStorage(); // Get the actual ID from AsyncStorage
        if (storedId) {
            await fetchUserData(storedId); // Use the fetched ID to get user data
        } else {
            // This block will now be mostly redundant if fetchUserIdFromStorage redirects
            console.log("No user ID found in storage, cannot load profile. Redirecting...");
            // router.replace({ pathname: "/(authFragments)" }); // Redirection now handled in fetchUserIdFromStorage
        }
    };

    useEffect(() => {
        loadUserProfile(); // Call the new loading function when the component mounts
    }, []); // Empty dependency array means it runs once on mount

    return (
        <>
            <ThemedHeader headerText="Profile" />
            <ThemedView
                style={styles.container}
                darkColor="#000"
                lightColor="#fff"
            >
                {/* Updated rendering logic based on userId and user state */}
                {userId && user ? (
                    <View style={styles.containerFlex}>
                        <ThemedView style={styles.commonContainer}>
                            <ThemedView style={styles.infoContainer}>
                                <ThemedView style={styles.pfp}></ThemedView>
                                <ThemedView>
                                    <ThemedText>{`${user.first_name} ${user.last_name}`}</ThemedText>
                                    <ThemedText>{`${user.phone_no}`}</ThemedText>
                                    <ThemedText
                                        style={{ marginTop: "auto" }}
                                    >{`${user.address}`}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.commonContainer}>
                            <ThemedText type="subTitle">
                                More Details
                            </ThemedText>
                            <ThemedView style={styles.moreDetailsContainer}>
                                <ThemedText>{`Gender : ${user.gender}`}</ThemedText>
                                <ThemedText>{`Date of Birth : ${new Date(
                                    user.dob
                                ).toISOString().substring(0, 10)}`}</ThemedText>
                                <ThemedText>{`Blood Type : ${user.blood_type}`}</ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.commonContainer}>
                            <ThemedText type="subTitle">
                                Emergency Contact
                            </ThemedText>
                            <ThemedView
                                style={styles.emergencyContactContainer}
                            >
                                <ThemedText>{`${user.emergency_contact.first_name} ${user.emergency_contact.last_name} (${user.emergency_contact.relation})`}</ThemedText>
                                <ThemedText>{`Contact number : ${user.emergency_contact.phone_no}`}</ThemedText>
                            </ThemedView>
                        </ThemedView>

                        {user.vehicle_details && (
                            <ThemedView style={styles.commonContainer}>
                                <ThemedText type="subTitle">
                                    Vehicle Details
                                </ThemedText>
                                <ThemedView style={styles.vehicleDataContainer}>
                                    <Image
                                        style={{
                                            width: 80,
                                            height: 80,
                                            color: "#fff",
                                        }}
                                        source={CarPNG}
                                    />
                                    <ThemedView>
                                        <ThemedText>{`${user.vehicle_details.name}`}</ThemedText>
                                        <ThemedText>{`${user.vehicle_details.color}`}</ThemedText>
                                        <ThemedText
                                            style={{ marginTop: "auto" }}
                                        >{`${user.vehicle_details.number}`}</ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            </ThemedView>
                        )}
                        {/* Add a logout button here */}
                        <ThemedButton
                            style={styles.logoutButton} // Define this style in your stylesheet
                            label="Logout"
                            onPress={async () => {
                                await AsyncStorage.removeItem("jwtToken");
                                await AsyncStorage.removeItem("userId");
                                router.replace("/(authFragments)"); // Go back to login screen
                            }}
                        />
                    </View>
                ) : userId === null ? ( // If userId is explicitly null (meaning not found in storage)
                    <ThemedText>Please sign in to view this page.</ThemedText>
                ) : ( // If userId is undefined (initial state) or user is null (fetching)
                    <ThemedText>Loading profile...</ThemedText>
                )}
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: "100%",
        height: "100%",
    },
    containerFlex: {
        flexDirection: "column",
        gap: 20,
    },
    commonContainer: {
        padding: 20,
        borderRadius: 20,
    },
    infoContainer: {
        flexDirection: "row",
        gap: 20,
    },
    pfp: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
    },
    moreDetailsContainer: {
        flexDirection: "column",
    },
    emergencyContactContainer: {
        flexDirection: "column",
    },
    vehicleDataContainer: {
        flexDirection: "row",
        gap: 20,
    },
    logoutButton: { // Style for the new logout button
        width: "90%",
        marginTop: 20,
        backgroundColor: "red", // Example: red button for logout
    },
});
