import {
    StyleSheet,
    View,
    Alert,
    ScrollView,
    TouchableOpacity,
    DrawerLayoutAndroid,
    SafeAreaView,
    Image,
    Pressable,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import { Button, Slider, Text, TextField } from "react-native-ui-lib";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AntDesign } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemedHeader } from "@/components/ThemedHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MillanHomeScreen() {
    const [initialRegion, setInitialRegion] = useState<any>(null);
    const [locationCoordinates, setLocationCoordinates] = useState<any>(null);
    const [infoSize, setInfoSize] = useState<any>("min");
    const drawer = useRef<DrawerLayoutAndroid>(null);

    useEffect(() => {
        asyncDriver();
    }, []);

    const asyncDriver = async () => {
        await checkIfLocationEnabled();
        await getCurrentLocation();
        await fetchHelpData();
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

        setInitialRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
    };

    const fetchHelpData = async () => {
        console.log("here");
        const helpId = await AsyncStorage.getItem("helpId");
        console.log("help id is : ", helpId);
    };

    function getInfoStyle(infoSize: any) {
        if ((infoSize = "max")) {
            return {
                position: "absolute",
                marginTop: "40%",
                // backgroundColor: '#fff',
                overflow: "scroll",
            };
        } else {
            return {};
        }
    }

    return (
        <>
            <ThemedView style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{
                            latitude: 22.731033,
                            longitude: 75.874595,
                        }}
                        title="Helper"
                        description="aditya baghel"
                    />
                </MapView>

                <ThemedView
                    style={
                        infoSize == "min"
                            ? styles.infoWrapperMin
                            : styles.infoWrapperMax
                    }
                >
                    <Pressable
                        style={styles.infoButton}
                        onPress={() =>
                            setInfoSize((prevState: any) =>
                                prevState == "min" ? "max" : "min"
                            )
                        }
                    >
                        {infoSize == "min" ? (
                            <AntDesign name="up" size={15} color="black" />
                        ) : (
                            <AntDesign name="down" size={15} color="black" />
                        )}
                    </Pressable>
                    {/* <Text style={styles.header}>Service Provider Information</Text> */}

                    {/* <Image 
                    source={{ uri: person.image }} 
                    style={styles.image} 
                    /> */}

                    <ThemedView style={styles.infoContainer}>
                        <ThemedView style={styles.infoMinWrapper}>
                            <MaterialCommunityIcons
                                name="face-man-profile"
                                size={45}
                                color="grey"
                            />
                            <ThemedView style={styles.infoMin}>
                                <ThemedText style={styles.paragraph}>
                                    First Name: Aditya
                                </ThemedText>
                                <ThemedText style={styles.paragraph}>
                                    Last Name: Baghel
                                </ThemedText>
                                <ThemedText style={styles.paragraph}>
                                    Phone Number: 7898261362
                                </ThemedText>
                            </ThemedView>
                            <SimpleLineIcons
                                name="call-out"
                                size={35}
                                color="grey"
                            />
                        </ThemedView>
                        <ThemedText>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Aliquid iusto, officia est atque hic delectus
                            obcaecati, facere eveniet repellendus ipsa ex odit
                            velit non, voluptatum dolorum reiciendis numquam.
                            Laboriosam odit ex dicta quibusdam dolorem, suscipit
                            ipsa quisquam ut. Animi optio doloribus saepe
                            voluptatem numquam unde, aut ratione mollitia alias
                            nisi tenetur velit tempore corrupti? Illum laborum
                            impedit magnam, placeat accusamus odit quae ad ipsum
                            et veniam cum consequatur eius. At provident, ullam
                            vitae quam quod, cum aliquam a ex unde, nam autem
                            nesciunt nostrum sapiente esse dolorem corporis
                            pariatur inventore quasi. Rerum eum nihil temporibus
                            repellendus fuga porro odio tenetur!
                        </ThemedText>
                        <ThemedText>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Voluptatum iste aspernatur eaque veniam
                            molestiae. At delectus asperiores, nesciunt nulla
                            labore quae numquam nostrum dicta aliquid
                            exercitationem tempore ad aliquam veniam cumque?
                            Molestias sapiente doloremque maiores possimus,
                            libero rem labore quod non, facilis voluptatem vero
                            accusantium aut ab architecto consequatur explicabo
                            distinctio voluptates adipisci quisquam qui ducimus.
                            Voluptas itaque nam tempora inventore provident
                            assumenda at rerum obcaecati distinctio quidem ad
                            nisi modi in, vero labore sunt veritatis ea
                            reiciendis est porro corporis similique?
                            Exercitationem molestias ipsa expedita voluptates.
                            Magnam facilis incidunt ea sed est, quod aspernatur
                            aliquam non adipisci, totam expedita minus dicta
                            sunt provident. Amet ipsa saepe quaerat itaque
                            eveniet. Velit quo molestias voluptatem, rerum
                            veritatis nobis quae dolorem nisi obcaecati,
                            eligendi quas modi facere laboriosam ad nostrum
                            maiores ex tempore ipsum accusantium ducimus quidem
                            in id beatae eius. Nemo cumque qui perspiciatis eos,
                            corrupti perferendis hic neque consequuntur tempora,
                            maxime pariatur. Ducimus excepturi aliquid
                            dignissimos. Natus nemo ex deserunt magnam atque
                            velit cum quod nisi mollitia voluptatibus reiciendis
                            nihil deleniti dignissimos assumenda dolor
                            perspiciatis, aut enim ea tenetur at. Error minus
                            quae debitis tempore in reiciendis rem placeat!
                            Assumenda explicabo ratione eius excepturi iusto
                            quod id labore et, tempora vero corporis! Enim
                            possimus, nobis perferendis, voluptas maxime quo
                            eius accusantium minus quidem porro commodi ex
                            aperiam omnis quia eum sapiente, deleniti tenetur
                            dolorem natus nisi dignissimos quos harum officia
                            architecto. Numquam est modi facilis iusto,
                            voluptate et enim error nemo quam commodi explicabo
                            sapiente aperiam quisquam aspernatur nulla
                            repudiandae tempora asperiores accusamus ipsa
                            voluptas quo velit. Fugit recusandae eos ratione,
                            adipisci nisi odit distinctio placeat illum tempore,
                            voluptatibus pariatur porro sequi perspiciatis nobis
                            et quos, necessitatibus inventore. Excepturi,
                            molestiae numquam sit consequatur, minus, expedita
                            dolorem voluptatibus perferendis quidem minima quasi
                            cum quae sed temporibus vel accusamus voluptatum
                            corrupti. Consequuntur, porro ut quas perferendis
                            deleniti exercitationem. Fugiat debitis ipsa beatae
                            ad nobis earum. Quidem eius impedit repudiandae
                            deleniti voluptate, porro est ratione atque aliquid
                            veniam alias dignissimos illo earum? Ad similique
                            explicabo neque ratione. Ipsam sint blanditiis
                            repudiandae cupiditate odit libero sunt ex atque
                            autem ratione distinctio explicabo doloribus eum, id
                            accusamus at deleniti laboriosam repellendus
                            dolorem. Tempore eveniet ipsa at fugit veritatis,
                            velit sint, id quas, expedita omnis reprehenderit
                            laborum. Illum fuga dolorem enim accusamus aliquid
                            illo animi, mollitia nihil placeat quia ratione
                            laudantium nemo laborum explicabo accusantium nobis
                            commodi. Dolor, odio, molestiae quam natus porro
                            amet atque enim laudantium repellat mollitia veniam
                            suscipit nihil repellendus consequuntur, optio
                            ducimus tenetur. Doloremque hic, temporibus fugiat
                            quasi doloribus ratione veniam repudiandae quia
                            nulla eos dolores repellendus quibusdam nobis at
                            itaque libero nesciunt ipsum? Tempore sed expedita
                            necessitatibus dicta non explicabo accusantium,
                            cupiditate maxime, repellat voluptas voluptates
                            doloremque rem deserunt reprehenderit blanditiis
                            neque magnam. Quas, ab, esse harum optio itaque
                            consectetur culpa, dignissimos cupiditate sapiente
                            omnis quo et odit consequuntur nesciunt porro dolore
                            enim quidem fuga sunt. Quis inventore enim, sed
                            maiores soluta quae quasi reiciendis, laborum iure
                            nihil, neque odio ipsa necessitatibus culpa
                            assumenda cum repudiandae dignissimos cumque
                            voluptate numquam? Ipsa!
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        // justifyContent: "center",
        height: "100%",
        backgroundColor: "#fff",
    },
    map: {
        width: "100%",
        height: "83%",
        // position: 'absolute',
        // zIndex:2
    },
    helpButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 50,
        height: 80,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    helpForm: {
        position: "absolute",
        width: "80%",
        paddingVertical: 50,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: "center",
    },
    closeButton: {
        position: "absolute",
        padding: 1,
        right: 20,
        top: 20,
    },
    urgencyContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    drawerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    navigationContainer: {
        backgroundColor: "#ecf0f1",
        height: "100%",
    },
    paragraph: {
        padding: 4,
        fontSize: 15,
        textAlign: "center",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    infoContainer: {
        // marginBottom: 20,
    },
    infoWrapperMin: {
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        position: "relative",
        backgroundColor: "#fff",
        top: "-8%",
    },
    infoWrapperMax: {
        // paddingTop: "100%",
        // position: 'absolute',
        // zIndex: 3,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        position: "absolute",
        marginTop: "30%",
        backgroundColor: "#fff",
        overflow: "scroll",
        // height: "50%",
        // overflow: "scroll"
        // height: 1
    },
    infoButton: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        height: 20,
        padding: 0,
        // margin: 0,
        backgroundColor: "#545454",
        justifyContent: "center",
        alignItems: "center",
        // position: 'absolute',
        // top: 0
    },
    infoMin: {
        padding: 26,
        alignItems: "flex-start",
        paddingRight: 45,
    },
    infoMinWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
});
