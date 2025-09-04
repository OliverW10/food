import { TopNav } from "@/components/TopNav";
import { VersionInfoComponent } from "@/components/version-info";
import { Text } from "react-native";

export default function SettingsPage() {
    return <>
        <TopNav />
        <Text>Settings</Text>
        <VersionInfoComponent />
    </>
}