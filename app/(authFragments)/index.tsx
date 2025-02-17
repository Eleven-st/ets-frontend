import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ToastAndroid, Pressable } from "react-native";
import socket from "../socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function LoginScreen() {
    const [userId, setUserId] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const sendOTP = async () => {
        try {
            const res: any = await axios.post(
                `https://ets-backend-t2yw.onrender.com/api/user/send-otp`,
                { phone_number: phoneNumber }
            );

            console.log(res);
            if (res.status != "200") {
                ToastAndroid.showWithGravityAndOffset(
                    `Sign-in failed : ${res.message}`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    500
                );
                return;
            }

            await AsyncStorage.setItem(
                "loginDetails",
                JSON.stringify({
                    phone_number: phoneNumber,
                    is_sign_up: false,
                })
            );

            router.navigate("/(authFragments)/VerifyOTP");
        } catch (err) {
            console.log(err);
            ToastAndroid.showWithGravityAndOffset(
                "Could not request back-end",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                500
            );
            console.log(err);
        }
    };

    const navigateToSignUp = () => {
        router.push("/(authFragments)/SignUpScreen");
    };

    const navigateToHome = () => {
        router.dismissAll();
        router.push("/(mainFragments)");
    };

    const fetchUserId = async () => {
        await AsyncStorage.removeItem("userId");
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);
        navigateToHome();
    };

    useEffect(() => {
        fetchUserId();
    }, []);

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
                            placeholder={"Phone no."}
                            floatingPlaceholder
                            onChangeText={(text) => setPhoneNumber(text)}
                        />

                        <ThemedButton
                            style={styles.signInButton}
                            label="Send OTP"
                            onPress={sendOTP}
                        />
                    </ThemedView>

                    <Pressable
                        style={styles.signUpContainer}
                        onPress={navigateToSignUp}
                    >
                        <ThemedText highlight>Sign Up instead</ThemedText>
                    </Pressable>

                    <Pressable
                        style={styles.signUpContainer}
                        onPress={navigateToHome}
                    >
                        <ThemedText highlight>Go to home</ThemedText>
                    </Pressable>
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

    signUpContainer: {
        marginTop: 20,
    },
});
