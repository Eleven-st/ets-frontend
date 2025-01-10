import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedHeader } from "@/components/ThemedHeader";
import { Image } from "react-native-ui-lib";
import CarPNG from "../../assets/images/car.png";

export default function ProfileScreen() {
    const [user, setUser] = useState<any>();
    const [userId, setUserId] = useState<string | null | undefined>(undefined);
    const [inputUserId, setInputUserId] = useState<string>("");

    const handleChange = (text: string) => {
        setInputUserId(text);
    };

    const fetchUserData = async (userId: string) => {
        try {
            console.log("here", userId);
            const res = await axios.get(
                `https://ets-backend-t2yw.onrender.com/api/user?user_id=${userId}`
            );
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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

    const fetchUser = async () => {
        // const userId = await fetchUserId();
        setUserId("670a7f43b7ea232b65426384");
        const userId = "670a7f43b7ea232b65426384";
        await fetchUserData(userId);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <ThemedHeader headerText="Profile" />
            <ThemedView
                style={styles.container}
                darkColor="#000"
                lightColor="#fff"
            >
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
                                )
                                    .toISOString()
                                    .substring(0, 10)}`}</ThemedText>
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
                    </View>
                ) : userId === null ? (
                    <ThemedText>please sign in to view this page</ThemedText>
                ) : (
                    <ThemedText>loading...</ThemedText>
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
});
