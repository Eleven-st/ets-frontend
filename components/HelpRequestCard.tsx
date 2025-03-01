import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet } from "react-native";
import axios from "axios";
import socket from "@/app/socket";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type HelpRequestCardProps = {
    data: any;
    helpRequests: any;
    setHelpRequests: any;
    setScreenState: any;
};

export function HelpRequestCard({
    data,
    helpRequests,
    setHelpRequests,
    setScreenState,
}: HelpRequestCardProps) {
    const acceptHelp = async () => {
        socket.emit("help_accepted", data._id);

        await AsyncStorage.setItem("helpId", data._id);
        await AsyncStorage.setItem("home", "InProgress Home");

        setScreenState("InProgress Home");
    };

    const rejectHelp = async () => {
        console.log(data._id);
        console.log(helpRequests);
        const newHelpRequests = helpRequests.filter((helpRequest: any) => {
            console.log(helpRequest._id);
            return helpRequest._id !== data._id;
        });

        // console.log(newHelpRequests);

        setHelpRequests(newHelpRequests);
        socket.emit("help_reject", data._id);
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.textContainer}>
                <ThemedText type="title">{`${data.user.first_name} ${data.user.last_name} is asking for help`}</ThemedText>
                <ThemedText type="desc">{data.issue}</ThemedText>
                <ThemedView style={styles.infoContainer}>
                    <ThemedText>{data.hospital_name}</ThemedText>
                    <ThemedText>{data.urgency}</ThemedText>
                    <ThemedText>dist</ThemedText>
                </ThemedView>
                <ThemedText>{data.tip}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.buttonContainer}>
                <ThemedButton style={styles.actionButton} onPress={acceptHelp}>
                    <Entypo name="plus" size={24} color="#FFFCF2" />
                </ThemedButton>
                <ThemedButton
                    style={styles.actionButton}
                    onPress={() => rejectHelp()}
                >
                    <Entypo name="cross" size={24} color="#FFFCF2" />
                </ThemedButton>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "auto",
        padding: 20,
        margin: 10,
        borderRadius: 20,
        gap: 20,
    },
    textContainer: {
        flex: 1,
    },
    infoContainer: {
        flexDirection: "row",
        gap: 10,
    },
    buttonContainer: {
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
    },
    actionButton: {
        height: 70,
        borderRadius: 20,
    },
});
