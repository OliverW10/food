import { TopNav } from '@/components/TopNav';
import { SimplePreset, TypeSelect } from '@/components/type-select';
import { useSession } from '@/hooks/user-context';
import trpc from '@/services/trpc';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, Switch, Text, TextInput, View } from 'react-native';

export default function PostPage() {
  const { user, session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [didCook, setDidCook] = useState(true); // Not persisted yet – placeholder for future schema
  const [touched, setTouched] = useState(false);

  const createPostMutation = trpc.post.create.useMutation();

  const setTitleAndPreset = (val: string, isPreset: boolean) => {
    setTitle(val);
  }

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async () => {
    setTouched(true);
    if (!user) {
      Alert.alert('Not signed in', 'Please log in first.');
      return;
    }
    if (!isValid) return;

    try {
      await createPostMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        authorId: parseInt(user.id, 10),
      });
      setTitle('');
      setDescription('');
      Alert.alert('Posted!', 'Your post was created.', [
        { text: 'View Feed', onPress: () => router.replace('/') },
        { text: 'Stay Here' },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create post');
    }
  };

const presets: SimplePreset[] = [
    { label: "Homemade ramen", value: "Homemade ramen" },
    { label: "Spaghetti Bolognese", value: "Spaghetti Bolognese" },
    { label: "Chicken Curry", value: "Chicken Curry" },
    { label: "Vegan Buddha Bowl", value: "Vegan Buddha Bowl" },
    { label: "Avocado Toast", value: "Avocado Toast" },
    { label: "Grilled Salmon", value: "Grilled Salmon" },
    { label: "Beef Tacos", value: "Beef Tacos" },
    { label: "Sushi Platter", value: "Sushi Platter" },
    { label: "Margherita Pizza", value: "Margherita Pizza" },
    { label: "Chocolate Lava Cake", value: "Chocolate Lava Cake" },
];

  return (
    <>
      <TopNav  />
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Create Post</Text>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: '600', marginBottom: 6 }}>Title</Text>
            <TypeSelect
              value={title}
              onChange={setTitleAndPreset}
              presets={presets}
              placeholder="E.g. Homemade ramen"
            />
            {touched && title.trim().length === 0 && (
              <Text style={{ color: '#dc2626', marginTop: 4 }}>Title is required.</Text>
            )}
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: '600', marginBottom: 6 }}>Description (optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder=""
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#f9fafb',
                textAlignVertical: 'top',
                minHeight: 120,
              }}
              onBlur={() => setTouched(true)}
            />
            {touched && description.trim().length === 0 && (
              <Text style={{ color: '#dc2626', marginTop: 4 }}>Description is required.</Text>
            )}
          </View>

          <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: '600' }}>I {didCook ? 'cooked' : 'ate'} this</Text>
              <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                (Not yet saved – future schema field)
              </Text>
            </View>
            <Switch value={didCook} onValueChange={setDidCook} />
          </View>

          {/* Placeholder for future image picker */}
          <View style={{ marginBottom: 24, padding: 16, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#f3f4f6' }}>
            <Text style={{ fontWeight: '600', marginBottom: 6 }}>Image (coming soon)</Text>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>
              Add a photo of your dish or meal in a future update.
            </Text>
          </View>

          <View style={{ marginBottom: 40 }}>
            {createPostMutation.isPending ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#111827" />
                <Text style={{ marginLeft: 12 }}>Posting…</Text>
              </View>
            ) : (
              <Button
                title={isValid ? 'Post' : 'Fill required fields'}
                onPress={handleSubmit}
                disabled={!isValid}
                color={isValid ? undefined : '#9ca3af'}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}