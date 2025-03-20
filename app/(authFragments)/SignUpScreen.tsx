import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ToastAndroid, ScrollView } from "react-native";
import socket from "../socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { DateTimePicker, Picker } from "react-native-ui-lib";
import { ThemedDateTimePicker } from "@/components/ThemedDatePicker";
import { ThemedPicker } from "@/components/ThemedPicker";

export default function SignUpScreen() {
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

    const [userId, setUserId] = useState<string | null>(null);
    const [personalDetails, setPersonalDetails] = useState<any>({});
    const [emegencyDetails, setEmergencyDetails] = useState<any>({});

    const handlePersonalDetailChange = (label: string, text: string) => {
        setPersonalDetails((prevDetails: any) => {
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

    const handleEmegencyDetailChange = (label: string, text: string) => {
        setEmergencyDetails((prevDetails: any) => {
            return {
                ...prevDetails,
                [label]: text,
            };
        });
    };

    const sendOTP = async () => {
        try {
            // console.log(personalDetails);

            const data = {
                ...personalDetails,
                emegency_contact: emegencyDetails,
            };
            console.log(data);

            // const res: any = await axios.post(
            //     `https://ets-backend-t2yw.onrender.com/api/user/send-otp`,
            //     { phone_number: personalDetails.phone_no }
            // );

            // console.log(res.data);
            // if (!res.data) {
            //     ToastAndroid.showWithGravityAndOffset(
            //         `Sign-in failed : ${res.message}`,
            //         ToastAndroid.LONG,
            //         ToastAndroid.BOTTOM,
            //         25,
            //         500
            //     );
            //     return;
            // }

            // await AsyncStorage.setItem(
            //     "loginDetails",
            //     JSON.stringify({ ...personalDetails, is_sign_up: true })
            // );

            // router.navigate("/(authFragments)/VerifyOTP");
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

    return (
        <ThemedView style={styles.container}>
            {userId === null ? (
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    <ThemedView
                        style={styles.signInContainer}
                        lightColor="#FFFCF2"
                        darkColor="#252422"
                    >
                        <ThemedText type="title">Sign Up !</ThemedText>
                        <ThemedText style={{ marginTop: 20 }}>
                            Personal Details :
                        </ThemedText>
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
                        />
                        <ThemedDateTimePicker
                            placeholder="Date of Birth"
                            mode="date"
                            onChange={(date) =>
                                handlePersonalDetailChange(
                                    "dob",
                                    date.toString()
                                )
                            }
                        />
                        <ThemedPicker
                            value={
                                personalDetails.gender
                                    ? personalDetails.gender
                                    : null
                            }
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
                            value={
                                personalDetails.blood_type
                                    ? personalDetails.blood_type
                                    : null
                            }
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
                        />

                        <ThemedTextField
                            placeholder={"Relation"}
                            floatingPlaceholder
                            onChangeText={(text) =>
                                handleEmegencyDetailChange("relation", text)
                            }
                        />
                        <ThemedButton
                            style={styles.signInButton}
                            label="Send OTP"
                            onPress={sendOTP}
                        />
                    </ThemedView>
                </ScrollView>
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
