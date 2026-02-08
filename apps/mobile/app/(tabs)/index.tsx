import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { welcomeApi } from "@/lib/api";

interface WelcomeData {
  title: string;
  message: string;
  description: string;
}

export default function HomeScreen() {
  const [welcomeData, setWelcomeData] = useState<WelcomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    welcomeApi
      .getWelcome()
      .then((data) => {
        console.log("Data received:", data);
        setWelcomeData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`接続エラー: ${err.message}\n\nバックエンドが起動しているか確認してください。`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">エラー</ThemedText>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{welcomeData?.title}</ThemedText>
      <ThemedText>{welcomeData?.message}</ThemedText>
      <ThemedText>{welcomeData?.description}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
});
