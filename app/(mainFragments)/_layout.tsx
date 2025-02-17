import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "home" : "home-outline"}
                            color={color}
                            size={25}
                        />
                    ),
                    tabBarShowLabel: false,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "timer" : "timer-outline"}
                            color={color}
                            size={25}
                        />
                    ),
                    tabBarShowLabel: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,

                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "person" : "person-outline"}
                            color={color}
                            size={25}
                        />
                    ),
                    tabBarShowLabel: false,
                }}
            />
        </Tabs>
    );
}
