// Mukund
import trpc from "@/services/trpc";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

interface ChatBotProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatBot({ visible, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your friendly food connoisseur Joshua Roy. Ask me anything!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatMutation = trpc.chat.sendMessage.useMutation();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        message: userMessage.text,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, Joshua Roy encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("ChatBot error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your friendly neighbourhood food connoisseur, Joshua Roy. Ask me anything!",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#0b0f16" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#111827",
            borderBottomWidth: 1,
            borderBottomColor: "#374151",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Talk To Joshua Roy
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity onPress={clearChat}>
              <Ionicons name="refresh" size={24} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                alignSelf: message.isUser ? "flex-end" : "flex-start",
                backgroundColor: message.isUser ? "#3b82f6" : "#374151",
                padding: 12,
                borderRadius: 16,
                marginBottom: 8,
                maxWidth: "80%",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {message.text}
              </Text>
              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: 12,
                  marginTop: 4,
                  textAlign: message.isUser ? "right" : "left",
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#374151",
                padding: 12,
                borderRadius: 16,
                marginBottom: 8,
              }}
            >
              <ActivityIndicator color="#fff" size="small" />
            </View>
          )}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            padding: 16,
            backgroundColor: "#111827",
            borderTopWidth: 1,
            borderTopColor: "#374151",
            gap: 12,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "#374151",
              color: "#fff",
              padding: 12,
              borderRadius: 20,
              fontSize: 16,
            }}
            placeholder="Ask me anything..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            style={{
              backgroundColor:
                inputText.trim() && !isLoading ? "#3b82f6" : "#6b7280",
              padding: 12,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
