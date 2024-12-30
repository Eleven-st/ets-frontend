import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ToastAndroid } from "react-native";
import socket from "../socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function SignUpScreen() {
    const [userId, setUserId] = useState<string | null>(null);
    const [OTP, setOTP] = useState<string>();

    const verifyOTP = async () => {
        try {
            const userDetailsString: any = await AsyncStorage.getItem(
                "loginDetails"
            );
            const userDetails = await JSON.parse(userDetailsString);

            console.log({ ...userDetails, otp_code: OTP });

            const res: any = await axios.post(
                `https://ets-backend-t2yw.onrender.com/api/user/verify-otp`,
                { ...userDetails, otp_code: OTP }
            );

            console.log(res);

            // if (!res.sucess) {
            //     ToastAndroid.showWithGravityAndOffset(
            //         `Sign-in failed : ${res.message}`,
            //         ToastAndroid.LONG,
            //         ToastAndroid.BOTTOM,
            //         25,
            //         500
            //     );
            //     return;
            // }

            await AsyncStorage.setItem(
                "userId",
                JSON.stringify("").substring(
                    1,
                    JSON.stringify(res.data).length - 1
                )
            );
            router.navigate("/(mainFragments)");
        } catch (err) {
            await AsyncStorage.setItem(
                "userId",
                JSON.stringify("67060cc4ab175d26d35c2d91").substring(
                    1,
                    JSON.stringify("67060cc4ab175d26d35c2d91").length - 1
                )
            );
            router.navigate("/(mainFragments)");

            // console.log(err);
            // ToastAndroid.showWithGravityAndOffset(
            //     "Could not request back-end",
            //     ToastAndroid.LONG,
            //     ToastAndroid.BOTTOM,
            //     25,
            //     500
            // );
            // console.log(err);
        }
    };

    return (
        <ThemedView style={styles.container}>
            {userId === null ? (
                <>
                    <ThemedView
                        style={styles.signInContainer}
                        lightColor="#FFFCF2"
                        darkColor="#252422"
                    >
                        <ThemedTextField
                            placeholder={"OTP"}
                            floatingPlaceholder
                            onChangeText={(text) => setOTP(text)}
                        />
                        <ThemedButton
                            style={styles.signInButton}
                            label="Verify OTP"
                            onPress={verifyOTP}
                        />
                    </ThemedView>
                </>
            ) : (
                <ThemedText>loading...</ThemedText>
            )}
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
