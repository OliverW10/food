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
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const input = useMemo(
    () => ({
      postId: postId ?? -1,
      cursor: null as number | null,
      limit: 20,
    }),
    [postId]
  );

  const commentsListQ = trpc.comments.list.useInfiniteQuery(input, {
    enabled: visible && !!postId,
    getNextPageParam: (last) => last?.nextCursor ?? null,
  });

  const addMutation = trpc.comments.add.useMutation({
    onMutate: async (vars) => {
      setError(null);
      // cancel any ongoing queries
      await utils.post.getFeed.cancel();
      await utils.comments.list.cancel();

      // Optimistically update feed comment count
      utils.post.getFeed.setInfiniteData({ mode: "following" }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((pg) => ({
            ...pg,
            items: pg.items.map((p) =>
              p.id === vars.postId
                ? { ...p, commentsCount: p.commentsCount + 1 }
                : p
            ),
          })),
        };
      });

      // Optimistically insert comment into list
      utils.comments.list.setInfiniteData(input, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((pg, i) =>
            i === 0
              ? {
                  ...pg,
                  items: [
                    {
                      id: Date.now(), // temp ID
                      text: vars.text,
                      author: { name: 'You', email: '' },
                    },
                    ...pg.items,
                  ],
                }
              : pg
          ),
        };
      });
    },
    onSuccess: () => {
      setText('');
      setError(null);
      // ensure server truth
      utils.comments.list.invalidate();
    },
    onSettled: () => {
      utils.post.getFeed.invalidate();
    },
  });

  const items = (commentsListQ.data?.pages ?? []).flatMap((p) => p.items);

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
                    {c.author?.name ?? c.author?.email?.split?.('@')[0] ?? 'user'}
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
            {error && (
              <Text style={{ color: '#ef4444', marginBottom: 8 }}>{error}</Text>
            )}
            <TouchableOpacity
              style={{
                padding: 12,
                backgroundColor: '#2563eb',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => {
                if (!text.trim()) {
                  setError('Comment cannot be empty.');
                  return;
                }
                if (postId) {
                  addMutation.mutate({ postId, text: text.trim() });
                }
              }}
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
