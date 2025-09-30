import trpc from '@/services/trpc';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Button, Modal, ScrollView, Text, TextInput, View } from 'react-native';

export function CommentsSheet({
  postId,
  visible,
  onClose,
}: {
  postId: number | null;
  visible: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState('');

  const input = useMemo(() => ({
    postId: postId ?? -1,
    cursor: null as number | null,
    limit: 20,
  }), [postId]);

  const commentsListQ = (trpc as any).comments?.list?.useInfiniteQuery?.(
    input,
    {
      enabled: visible && !!postId,
      getNextPageParam: (last: any) => last?.nextCursor ?? null,
    }
  ) ?? { isLoading: false, data: { pages: [{ items: [] }] }, refetch: () => {} };

  const addMutation = (trpc as any).comments?.add?.useMutation?.({
    onSuccess: () => {
      setText('');
      commentsListQ.refetch();
    }
  }) ?? { mutate: () => {} };

  const items = (commentsListQ.data?.pages ?? []).flatMap((p: any) => p.items);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.2)', justifyContent:'flex-end' }}>
        <View style={{ maxHeight:'75%', backgroundColor:'#fff', borderTopLeftRadius:16, borderTopRightRadius:16, padding:16 }}>
          <View style={{ alignSelf:'center', width:40, height:4, backgroundColor:'#ddd', borderRadius:4, marginBottom:8 }} />
          <Text style={{ fontSize:18, fontWeight:'700', marginBottom:8 }}>Comments</Text>

          {commentsListQ.isLoading ? (
            <View style={{ alignItems:'center', padding:16 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView>
              {items.map((c: any) => (
                <View key={c.id} style={{ paddingVertical:8, borderBottomWidth:1, borderColor:'#f1f5f9' }}>
                  <Text style={{ fontWeight:'600' }}>{c.author?.email?.split?.('@')[0] ?? 'user'}</Text>
                  <Text>{c.text}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={{ marginTop:12 }}>
            <TextInput
              placeholder="Add a comment…"
              value={text}
              onChangeText={setText}
              style={{ borderWidth:1, borderColor:'#d1d5db', borderRadius:8, padding:10, marginBottom:8 }}
            />
            <Button
              title="Post"
              onPress={() => postId && text.trim() && addMutation.mutate({ postId, text: text.trim() })}
            />
            <View style={{ height:8 }} />
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
