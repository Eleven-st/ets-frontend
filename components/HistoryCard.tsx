import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import dayjs from "dayjs";
import { StyleSheet } from "react-native";

export default function HistoryCard(props: any) {
    const currDate: any = dayjs();
    const helpDate: any = dayjs(props.date);

    let diff = null;

    const yearDiff = Math.floor(currDate.diff(helpDate, "year"));
    if (yearDiff > 0) {
        diff = `${yearDiff} years`;
    }

    if (!diff) {
        const dayDiff = Math.floor(currDate.diff(helpDate, "day"));
        if (dayDiff > 0) {
            diff = `${dayDiff} days`;
        }
    }

    if (!diff) {
        const hourDiff = Math.floor(currDate.diff(helpDate, "hours"));
        diff = `${hourDiff} hours`;
    }

    return (
        <ThemedView style={styles.cardContainer}>
            <ThemedView style={styles.infoContainer}>
                <ThemedView style={styles.pfp}></ThemedView>
                <ThemedView>
                    <ThemedText>
                        {props.role === "rescuer" && "Rescued "}
                        {`${props.user.first_name} ${props.user.last_name} `}
                        {props.role === "user" && "helped you"}
                    </ThemedText>
                    <ThemedText>{`${props.user.gender}`}</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.helpDetailsContainer}>
                <ThemedView>
                    <ThemedText>{`Hospital : ${props.hospital}`}</ThemedText>
                    <ThemedText>{`Issue : ${props.issue}`}</ThemedText>
                    <ThemedText>{`Urgency : ${props.urgency}`}</ThemedText>
                </ThemedView>
                {props.tip && <ThemedText>{`Tip : ${props.tip}`}</ThemedText>}
            </ThemedView>
            <ThemedText>{`${props.date.substring(
                0,
                10
            )} (${diff} ago)`}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 20,
        width: "100%",
        borderRadius: 20,
        flexDirection: "column",
        gap: 20,
    },
    infoContainer: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
    },
    pfp: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
    },
    helpDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
