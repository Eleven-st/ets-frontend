import HistoryCard from "@/components/HistoryCard";
import { ThemedHeader } from "@/components/ThemedHeader";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

export default function HistoryScreen() {
    const data = {
        user: {
            first_name: "Ishaan",
            last_name: "Dasgupta",
            gender: "Male",
        },
        hospital: "Charak Hospital",
        issue: "Blood Loss",
        urgency: 8,
        tip: 8000,
        date: "2024-10-01T03:33:00.000Z",
        role: "rescuser",
    };

    const [userId, setUserId] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState<any>([]);

    const fetchUserId = async (): Promise<any> => {
        try {
            const userId: string | null = await AsyncStorage.getItem("userId");
            if (userId == null) {
                throw "userId is null";
            }

            setUserId(userId);

            return userId;
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHistoryData = async (userId: string) => {
        try {
            console.log("here", userId);
            const res = await axios.get(
                `https://ets-backend-t2yw.onrender.com/api/help/history?user_id=${userId}`
            );
            console.log("here");
            console.log(res.data);
            setHistoryData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHistory = async () => {
        // const userId = await fetchUserId();
        setUserId("67095fd2232212fd14ee33bf");
        const userId = "67095fd2232212fd14ee33bf";
        await fetchHistoryData(userId);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <>
            <ThemedHeader headerText="History" />
            <ThemedView style={styles.container} darkColor="#000">
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    {historyData.map((data: any, index: Number) => {
                        return <HistoryCard {...data} key={index} />;
                    })}
                </ScrollView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        padding: 20,
    },

    scrollContainer: {
        width: "100%",
        height: "100%",
    },

    scrollContentContainer: {
        flexDirection: "column",
        gap: 20,
    },
});
