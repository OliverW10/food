import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserItem = {
  id: number;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  followedByMe: boolean;
};
type PageResult = { items: UserItem[]; nextCursor: number | null };

export default function FollowingPage() {
  const { session } = useSession();
  const utils = trpc.useUtils();

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, refetch } =
    trpc.search.following.useInfiniteQuery(
      { limit: 20 },
      {
        getNextPageParam: (last) => last?.nextCursor ?? null,
        enabled: !!session,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      }
    );

  const rows = useMemo(() => (data?.pages ?? []).flatMap((p) => p.items), [data?.pages]);

  const followMutation = trpc.search.followToggle.useMutation({
    onMutate: async ({ targetUserId, follow }) => {
      await utils.search.following.cancel();
      const key = { limit: 20 };
      const previous = utils.search.following.getInfiniteData(key);
      utils.search.following.setInfiniteData(key, (cur) => {
        if (!cur) return cur;
        const next =
          follow
            ? {
                pageParams: cur.pageParams,
                pages: cur.pages.map((pg: PageResult) => ({
                  ...pg,
                  items: pg.items.map((u) => (u.id === targetUserId ? { ...u, followedByMe: true } : u)),
                })),
              }
            : {
                pageParams: cur.pageParams,
                pages: cur.pages.map((pg: PageResult) => ({
                  ...pg,
                  items: pg.items.filter((u) => u.id !== targetUserId),
                })),
              };
        return next as typeof cur;
      });
      return { previous, key };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) utils.search.following.setInfiniteData(ctx.key, ctx.previous);
    },
    onSettled: async (_d, _e, vars) => {
      await utils.search.following.invalidate({ limit: 20 });
      try { await utils.profile?.get?.invalidate({ id: vars.targetUserId } as any); } catch {}
      try { await utils.profile?.get?.invalidate(); } catch {}
      try { await utils.post?.getFeed?.invalidate({ mode: "following" } as any); } catch {}
    },
  });

  const Avatar = ({ u }: { u: UserItem }) => {
    const letter = (u.name?.[0] || u.email?.[0] || "?").toUpperCase();
    return u.avatarUrl ? (
      <Image source={{ uri: u.avatarUrl }} style={{ width: 36, height: 36, borderRadius: 18 }} />
    ) : (
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#374151", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{letter}</Text>
      </View>
    );
  };

  const Row = ({ u }: { u: UserItem }) => (
    <View style={{ paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderColor: "#1f2937" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar u={u} />
        <View>
          <Text style={{ color: "#fff", fontWeight: "700" }}>{u.name?.trim() || u.email.split("@")[0]}</Text>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>{u.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => followMutation.mutate({ targetUserId: u.id, follow: false })}
        style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#374151", opacity: followMutation.status === "pending" ? 0.7 : 1 }}
        disabled={followMutation.status === "pending"}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Following</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>Following</Text>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#fff" />
          <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading…</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(u) => String(u.id)}
          renderItem={({ item }) => <Row u={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          onEndReachedThreshold={0.35}
          onEndReached={() => hasNextPage && fetchNextPage()}
          refreshing={isFetching && !data}
          onRefresh={() => refetch()}
        />
      )}
    </SafeAreaView>
  );
}
