import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  return (
    <Modal visible={isOpen} testID="chatbot-modal">
      <View>
        <Text>AI Assistant</Text>
        <TouchableOpacity onPress={onClose} testID="close-button">
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
