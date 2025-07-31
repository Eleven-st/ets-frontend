// ets-frontend/app/mainFragments/history.tsx

import HistoryCard from "@/components/HistoryCard";
import { ThemedHeader } from "@/components/ThemedHeader";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
// --- IMPORTANT CHANGE 1: Update Axios imports ---
import axios from "axios"; // Keep this for axios.isAxiosError
import axiosInstance from "../../utils/axiosInstance"; // <-- NEW: Import your custom axios instance

import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from "react-native";
import { router } from "expo-router"; // <-- Add this import for redirection

export default function HistoryScreen() {
    // Hardcoded 'data' object - keep this only if it's for initial mock/placeholder.
    // Otherwise, ensure your UI fully relies on 'historyData' state.
    // const data = {
    //     user: {
    //         first_name: "Ishaan",
    //         last_name: "Dasgupta",
    //         gender: "Male",
    //     },
    //     hospital: "Charak Hospital",
    //     issue: "Blood Loss",
    //     urgency: 8,
    //     tip: 8000,
    //     date: "2024-10-01T03:33:00.000Z",
    //     role: "rescuser",
    // };

    const [userId, setUserId] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<any>([]); // Array to store fetched history
    const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state

    const fetchUserIdFromStorage = async (): Promise<string | null> => {
        try {
            const storedUserId: string | null = await AsyncStorage.getItem("userId");
            if (storedUserId == null) {
                console.warn("userId is null in AsyncStorage for HistoryScreen. User might not be logged in. Redirecting...");
                router.replace("/(authFragments)"); // <-- Redirect if no userId found
                ToastAndroid.show("Please sign in to view history.", ToastAndroid.LONG); // Inform user
                return null;
            }
            setUserId(storedUserId); // Update component state
            return storedUserId;
        } catch (err) {
            console.error("Error fetching userId from AsyncStorage in HistoryScreen:", err);
            ToastAndroid.show("Error accessing stored user data.", ToastAndroid.LONG);
            router.replace("/(authFragments)"); // <-- Redirect on error
            return null;
        }
    };

    const fetchHistoryData = async (id: string) => {
        setIsLoading(true); // Start loading indicator
        try {
            console.log("Fetching history data for user ID:", id);
            // --- IMPORTANT CHANGE 2: Use axiosInstance for the API call ---
            const res = await axiosInstance.get( // <-- NEW: Use axiosInstance
                `/api/help-request/history?user_id=${id}`
            );
            console.log("History data received:", res.data);
            setHistoryData(res.data); // Update state with fetched data
        } catch (err: any) { // Catch block specifically for Axios errors or network issues
            console.error("Error fetching history data:", err); // Use console.error for errors
            let errorMessage = "Unable to load history.";

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
            ToastAndroid.show(errorMessage, ToastAndroid.LONG); // Inform user
            setHistoryData([]); // Clear history on error to prevent displaying stale data
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    const loadUserHistory = async () => {
        const storedId = await fetchUserIdFromStorage(); // Get the actual ID from AsyncStorage
        if (storedId) {
            await fetchHistoryData(storedId); // Use the fetched ID to get history data
        } else {
            // This block will now be mostly redundant if fetchUserIdFromStorage redirects
            console.log("No user ID found in storage, cannot load history.");
            setIsLoading(false); // Make sure loading stops even if no ID
        }
    };

    useEffect(() => {
        loadUserHistory(); // Call the new loading function when the component mounts
    }, []); // Empty dependency array means it runs once on mount


    return (
        <>
            <ThemedHeader headerText="History" />
            <ThemedView style={styles.container} darkColor="#000">
                {isLoading ? (
                    <ActivityIndicator size="large" color="#999" style={{ marginTop: 20 }} />
                ) : historyData.length > 0 ? (
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContentContainer}
                    >
                        {historyData.map((item: any, index: number) => (
                            <HistoryCard {...item} key={item._id || index} />
                        ))}
                    </ScrollView>
                ) : (
                    <ThemedText style={{ textAlign: "center", marginTop: 50 }}>No history found.</ThemedText>
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
        justifyContent: 'center', // Center content if no history
        alignItems: 'center', // Center content if no history
    },
    
    scrollContainer: {
        flex: 1,
        width: '100%', // Ensure scroll view takes full width
    },

    scrollContentContainer: {
        paddingBottom: 20, // Add some padding at the bottom for scrollable content
    },
});
