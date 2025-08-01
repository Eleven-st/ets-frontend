// ets-frontend/app/mainFragments/profile.tsx

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedHeader } from "@/components/ThemedHeader";
import { Image } from "react-native-ui-lib";
import CarPNG from "../../assets/images/car.png";
import { router, useLocalSearchParams } from "expo-router"; // <-- Added useLocalSearchParams

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null); // State to hold the userId

    const params = useLocalSearchParams(); // <-- NEW: Get parameters from the route

    // --- CRITICAL FIX: fetchUserData no longer needs an 'id' parameter ---
    // The backend's /api/auth/user endpoint uses the JWT token for authentication
    // and extracts the user ID from the token itself.
    const fetchUserData = async () => { // Removed 'id' parameter
        try {
            console.log("Fetching user profile via authenticated endpoint."); // Updated log
            // --- FIXED: Correct endpoint and no user_id query param ---
            const res = await axiosInstance.get("/api/auth/user"); // Corrected endpoint

            // --- NEW LOG: Log the full response data from the backend ---
            console.log("ProfileScreen: Full backend response for /api/auth/user:", res.data);

            // --- FIXED: Access user_details from the response ---
            setUser(res.data.user_details); // Backend sends user data inside 'user_details'
        } catch (err: any) {
            console.error("Error fetching user data:", err);
            let errorMessage = "Unable to load user profile.";

            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
                if (err.response.status === 401 || err.response.status === 403) {
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

    // This function fetches the userId from AsyncStorage and updates the component state.
    // It also handles redirection if no userId is found.
    const fetchUserIdFromStorage = async (): Promise<string | null> => {
        try {
            // --- NEW LOGIC: Prioritize userId from route params ---
            const paramUserId = params.userId as string | undefined; // Get userId from route params
            if (paramUserId) {
                console.log("ProfileScreen: Using userId from route params:", paramUserId); // NEW LOG
                setUserId(paramUserId); // Update state
                return paramUserId; // Return it for immediate use
            }

            // Fallback to AsyncStorage if no userId in params
            const storedUserId: string | null = await AsyncStorage.getItem("userId");
            if (storedUserId == null) {
                console.warn("userId is null in AsyncStorage. User might not be logged in. Redirecting...");
                router.replace("/(authFragments)"); // Redirect if no userId found
                return null;
            }
            console.log("ProfileScreen: Using userId from AsyncStorage:", storedUserId); // Updated log
            setUserId(storedUserId); // Update state
            return storedUserId; // Return it for immediate use
        } catch (err) {
            console.error("Error fetching userId from AsyncStorage or params:", err); // Updated log message
            ToastAndroid.show("Error accessing stored user data.", ToastAndroid.LONG);
            router.replace("/(authFragments)"); // Redirect on error
            return null; // Return null on error
        }
    };

    // Orchestrates fetching both the userId and then the user data
    const loadUserProfile = async () => {
        // First, attempt to get the userId from route params or AsyncStorage
        const storedId = await fetchUserIdFromStorage();
        console.log("loadUserProfile: userId retrieved from storage/params:", storedId); // Debugging log

        // Only proceed to fetch user data if a userId was successfully retrieved
        if (storedId) {
            await fetchUserData(); // Call fetchUserData without the ID parameter
        } else {
            console.log("No user ID found in storage/params, cannot load profile. Redirection handled by fetchUserIdFromStorage.");
        }
    };

    // useEffect hook to run `loadUserProfile` once when the component mounts
    useEffect(() => {
        loadUserProfile();
    }, [params.userId]); // <-- MODIFIED: Added params.userId to dependencies to re-run if param changes

    return (
        <>
            <ThemedHeader headerText="Profile" />
            <ThemedView
                style={styles.container}
                darkColor="#000"
                lightColor="#fff"
            >
                {/* Updated rendering logic based on userId and user state */}
                {/* We now check for 'userId' to ensure a user ID was found in storage,
                    and 'user' to ensure the profile data has been fetched. */}
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
                        <ThemedButton
                            style={styles.logoutButton}
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
                ) : ( // If userId is found but user data is not yet loaded (user is null)
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
    logoutButton: {
        width: "90%",
        marginTop: 20,
        backgroundColor: "red",
    },
});
