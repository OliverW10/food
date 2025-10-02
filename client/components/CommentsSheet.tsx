import trpc from '@/services/trpc';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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

  const utils: any = (trpc as any).useUtils?.() ?? {
    post: {
      getFeed: {
        cancel: async () => {},
        getInfiniteData: () => undefined,
        setInfiniteData: () => {},
        invalidate: () => {},
      },
    },
  };

  const input = useMemo(
    () => ({
      postId: postId ?? -1,
      cursor: null as number | null,
      limit: 20,
    }),
    [postId]
  );

  const commentsListQ =
    (trpc as any).comments?.list?.useInfiniteQuery?.(input, {
      enabled: visible && !!postId,
      getNextPageParam: (last: any) => last?.nextCursor ?? null,
    }) ?? {
      isLoading: false,
      data: { pages: [{ items: [] }] },
      refetch: () => {},
    };

  const addMutation =
    (trpc as any).comments?.add?.useMutation?.({
      onMutate: async (vars: { postId: number; text: string }) => {
        // optimistic bump in feed
        await utils.post.getFeed.cancel();
        utils.post.getFeed.setInfiniteData(undefined as any, (data: any) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((pg: any) => ({
              ...pg,
              items: pg.items.map((p: any) =>
                p.id === vars.postId
                  ? { ...p, commentsCount: p.commentsCount + 1 }
                  : p
              ),
            })),
          };
        });
      },
      onSuccess: () => {
        setText('');
        commentsListQ.refetch(); // refresh detail view
      },
      onSettled: () => {
        utils.post.getFeed.invalidate();
      },
    }) ?? { mutate: () => {} };

  const items = (commentsListQ.data?.pages ?? []).flatMap(
    (p: any) => p.items
  );

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            maxHeight: '75%',
            backgroundColor: '#0b0f16',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              backgroundColor: '#374151',
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 12,
              color: '#fff',
            }}
          >
            Comments
          </Text>

          {commentsListQ.isLoading ? (
            <View style={{ alignItems: 'center', padding: 16 }}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <ScrollView>
              {items.map((c: any) => (
                <View
                  key={c.id}
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderColor: '#1f2937',
                  }}
                >
                  <Text style={{ fontWeight: '600', color: '#fff' }}>
                    {c.author?.name ??
                      c.author?.email?.split?.('@')[0] ??
                      'user'}
                  </Text>
                  <Text style={{ color: '#9ca3af' }}>{c.text}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={{ marginTop: 12 }}>
            <TextInput
              placeholder="Add a comment…"
              placeholderTextColor="#6b7280"
              value={text}
              onChangeText={setText}
              style={{
                borderWidth: 1,
                borderColor: '#374151',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                color: '#fff',
                backgroundColor: '#1f2937',
              }}
            />
            <TouchableOpacity
              style={{
                padding: 12,
                backgroundColor: '#2563eb',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() =>
                postId &&
                text.trim() &&
                addMutation.mutate({ postId, text: text.trim() })
              }
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 8,
                padding: 12,
                backgroundColor: '#374151',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={onClose}
            >
              <Text style={{ color: '#9ca3af' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
