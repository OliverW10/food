import { CommentsSheet } from "@/components/CommentsSheet";
import CornerButton from "@/components/corner-button";
import type { PostUI } from '@/components/FoodPost';
import { FoodPost } from "@/components/FoodPost";
import { TopNav } from "@/components/TopNav";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const Toggle = ({ mode, setMode }:{ mode:'following'|'explore'; setMode:(m:any)=>void }) => (
  <View style={{ flexDirection:'row', gap:8, padding:12 }}>
    {(['following','explore'] as const).map(m => (
      <TouchableOpacity 
        key={m} 
        onPress={()=>setMode(m)} 
        style={{
          paddingVertical:8, 
          paddingHorizontal:14, 
          borderRadius:999,
          backgroundColor: mode===m ? '#1f2937' : '#374151'
        }}
      >
        <Text style={{ 
          color: mode===m ? '#fff' : '#9ca3af', 
          fontWeight:'600', 
          textTransform:'capitalize' 
        }}>
          {m}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function Home() {
  const router = useRouter();
  const { session } = useSession();
  const [mode, setMode] = useState<'following'|'explore'>(session ? 'following' : 'explore');
  const [activePostId, setActivePostId] = useState<number|null>(null);

  const input = useMemo(()=>({ mode, limit: 10, cursor: null as number|null }), [mode]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = trpc.post.getFeed.useInfiniteQuery(
    input,
    { getNextPageParam: (last: any) => last?.nextCursor ?? null, refetchOnWindowFocus: false }
  );

  const posts = (data?.pages ?? []).flatMap((p: { items: PostUI[] }) => p.items);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading feed…</Text>
      </SafeAreaView>
    );
  }

  const EmptyState = () => (
    <View style={{ padding: 24, alignItems:'center' }}>
      <Text style={{ fontSize:18, fontWeight:'700', marginBottom:6, color:'#fff' }}>
        {mode === 'following' ? "You’re not following anyone yet" : "No posts yet"}
      </Text>
      <Text style={{ color:'#9ca3af', textAlign:'center' }}>
        {mode === 'following'
          ? "Explore trending posts to find people to follow."
          : "Be the first to share something tasty!"}
      </Text>
      <TouchableOpacity 
        onPress={()=>setMode('explore')} 
        style={{ marginTop:14, padding:10, backgroundColor:'#1f2937', borderRadius:8 }}
      >
        <Text style={{ color:'#fff' }}>Explore</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <TopNav />
      <Toggle mode={mode} setMode={setMode} />

      <FlatList
        testID="feed-list"
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FoodPost
            review={item}
            onOpenComments={() => setActivePostId(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={isFetching && !data} onRefresh={()=>refetch()} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
      />

      <CornerButton isTop={false} onPress={() => session ? router.push("/post") : router.push("/AuthScreen")}>
        <Text style={{ color: "#9ca3af", fontSize: 24, lineHeight: 24 }}>+</Text>
      </CornerButton>
      <CommentsSheet
        postId={activePostId}
        visible={activePostId !== null}
        onClose={() => setActivePostId(null)}
      />
    </View>
  );
}
