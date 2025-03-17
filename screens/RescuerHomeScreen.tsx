import { HelpRequestCard } from "@/components/HelpRequestCard";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import socket from "../app/socket";
import * as Location from "expo-location";

export default function RescuerHomeScreen({ setScreenState }) {
    const [userId, setUserId] = useState<string | null | undefined>(undefined);
    const [helpRequests, setHelpRequests] = useState<any>([]);
    const [locationCoordinates, setLocationCoordinates] = useState<any>(null);
    const [acceptedHelp, setAcceptedHelp] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", (reason: string) => {
            console.log("Disconnected from server, Reason ", reason);
            if (reason === "io server disconnect") {
                socket.connect();
            }
        });

        socket.on("help_request", (payload: any) => {
            setHelpRequests((helpRequests: any) => [...helpRequests, payload]);
        });

        socket.on("help_accept_response", (payload: any) => {
            console.log("help accepted response : ", payload);
            Alert.alert(payload.message);
            if (payload.status === "succesful") {
                setAcceptedHelp(true);
                console.log("help accepted succesfully !!!! should be in DB");
            }
        });

        socket.on("help_reject_response", (payload: any) => {
            console.log("help reject response ", payload);
            Alert.alert(payload.message);
            if (payload.status === "succesful") {
                setAcceptedHelp(true);
                console.log("help accepted succesfully !!!! should be in DB");
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("location_response");
            socket.off("help_request");
            socket.off("help_accept_response");
            socket.off("help_reject_response");
            socket.emit("force_disconnect");
        };
    }, []);

    const fetchUser = async () => {
        await AsyncStorage.setItem("userId", "67095fd2232212fd14ee33bf");
        const userId: any = await AsyncStorage.getItem("userId");
        setUserId(userId);
        // console.log("user id", userId);
        socket.emit("register", userId);
    };

    const fetchHelpRequests = async () => {
        try {
            if (userId) {
                const res = await axios.get(
                    `https://ets-backend-t2yw.onrender.com/api/help/all?user_id=${userId}`
                );
                console.log("data is", res.data);
                setHelpRequests(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        asyncDriver();
    }, []);

    const asyncDriver = async () => {
        await fetchUser();
        await checkIfLocationEnabled();
        await getCurrentLocation();
        await fetchHelpRequests();
    };

    const checkIfLocationEnabled = async () => {
        let enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert("Location not enabled", "Please enable your Location", [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
        }
    };

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission denied",
                "Allow the app to use the location services",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ]
            );
        }

        const { coords } = await Location.getCurrentPositionAsync();
        setLocationCoordinates({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });

        socket.emit("update_location", {
            latitude: coords.latitude,
            longitude: coords.longitude,
        });
    };

    return (
        <View style={styles.container}>
            {userId ? (
                helpRequests ? (
                    helpRequests.map((helpRequest: any) => {
                        return (
                            <HelpRequestCard
                                data={helpRequest}
                                helpRequests={helpRequests}
                                setHelpRequests={setHelpRequests}
                                setScreenState={setScreenState}
                            />
                        );
                    })
                ) : (
                    <ThemedText>loading..</ThemedText>
                )
            ) : (
                <ThemedText>please sign in fist</ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // width: "100%",
        // height: "100%",
        // justifyContent: "center",
        // alignItems: "center",
    },
});
