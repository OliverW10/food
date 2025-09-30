import { TopNav } from "@/components/TopNav";
import { VersionInfoComponent } from "@/components/version-info";
import { Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsPage() {
    return <SafeAreaView style={{ flex:1 }}>
        <TopNav />
        <Text>Settings</Text>
        <VersionInfoComponent />
    </SafeAreaView>
}