import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface PostImagePickerProps {
  value?: string | null; // externally controlled URI
  onChange?: (uri: string | null) => void; // callback when image picked or cleared
  label?: string;
  disabled?: boolean;
  previewSize?: number; // square dimension
}

export default function PostImagePicker({
  value,
  onChange,
  label = 'Image',
  disabled,
  previewSize = 200,
}: PostImagePickerProps) {
  const [internalUri, setInternalUri] = useState<string | null>(value ?? null);

  // Keep internal state in sync if parent controls value
  useEffect(() => {
    if (value !== undefined && value !== internalUri) {
      setInternalUri(value);
    }
  }, [value, internalUri]);

  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access gallery was denied');
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async () => {
    if (disabled) return;
    const ok = await requestPermission();
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });
    if (!result.canceled) {
      const uri = result.assets[0]?.uri ?? null;
      setInternalUri(uri);
      onChange?.(uri);
    }
  }, [disabled, onChange, requestPermission]);

  const clearImage = useCallback(() => {
    setInternalUri(null);
    onChange?.(null);
  }, [onChange]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Button title={internalUri ? 'Change Image' : 'Pick Image'} onPress={pickImage} disabled={disabled} />
        {internalUri && (
          <Pressable accessibilityRole="button" onPress={clearImage} style={styles.clearBtn}>
            <Text style={styles.clearText}>Remove</Text>
          </Pressable>
        )}
      </View>
      {internalUri && (
        <Image
          source={{ uri: internalUri }}
          style={{ width: previewSize, height: previewSize, marginTop: 12, borderRadius: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearBtn: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f87171',
    borderRadius: 6,
  },
  clearText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});