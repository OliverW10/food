// app/search/index.tsx
import { useSession } from "@/hooks/user-context";
// Oliver
import trpc from "@/services/trpc";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserRow = {
  id: number;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  followedByMe: boolean;
};

export default function SearchPage() {
  const { user, session } = useSession();
  const myId = typeof user?.id === "string" ? Number(user.id) : user?.id ?? -1;

  const utils = trpc.useUtils();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, refetch } =
    trpc.search.search.useInfiniteQuery(
      { q: debounced || undefined, limit: 20 },
      {
        getNextPageParam: (last) => last?.nextCursor ?? null,
        enabled: !!session,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      }
    );

  const rows: UserRow[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data?.pages]
  );

  const followMutation = trpc.search.followToggle.useMutation({
    onMutate: async ({ targetUserId, follow }) => {
      await utils.search.search.cancel();
      const key = { q: debounced || undefined, limit: 20 };
      const previous = utils.search.search.getInfiniteData(key);

      utils.search.search.setInfiniteData(key, (cur) => {
        if (!cur) return cur;
        const next: typeof cur = {
          pageParams: cur.pageParams,
          pages: cur.pages.map((pg) => ({
            ...pg,
            items: pg.items.map((u) =>
              u.id === targetUserId ? { ...u, followedByMe: follow } : u
            ),
          })),
        };
        return next;
      });

      return { previous, key, targetUserId };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        utils.search.search.setInfiniteData(ctx.key, ctx.previous);
    },
    onSettled: async (_data, _err, vars) => {
      await Promise.all([
        utils.search.search.invalidate({
          q: debounced || undefined,
          limit: 20,
        }),
        utils.profile?.get
          ?.invalidate?.({ id: vars.targetUserId } as any)
          .catch(() => {}),
        utils.profile?.get?.invalidate?.().catch(() => {}),
        utils.post?.getFeed
          ?.invalidate?.({ mode: "following" } as any)
          .catch(() => {}),
      ]);
    },
  });

  const renderAvatar = (u: UserRow) => {
    const letter = (u.name?.[0] || u.email?.[0] || "?").toUpperCase();
    return u.avatarUrl ? (
      <Image
        source={{ uri: u.avatarUrl }}
        style={{ width: 36, height: 36, borderRadius: 18 }}
      />
    ) : (
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#374151",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>{letter}</Text>
      </View>
    );
  };

  const Row = ({ u }: { u: UserRow }) => {
    const followed = !!u.followedByMe;
    const isSelf = u.id === myId;

    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: "#1f2937",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {renderAvatar(u)}
          <View>
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {u.name?.trim() || u.email.split("@")[0]}
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>{u.email}</Text>
          </View>
        </View>

        {!isSelf && (
          <TouchableOpacity
            onPress={() =>
              followMutation.mutate({ targetUserId: u.id, follow: !followed })
            }
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: followed ? "#374151" : "#2563eb",
              opacity: followMutation.status === "pending" ? 0.7 : 1,
            }}
            disabled={followMutation.status === "pending"}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {followed ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
          Search
        </Text>
        <TextInput
          placeholder="Search users by name or email"
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2937",
          }}
        />
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="#fff" />
          <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading users…</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(u) => String(u.id)}
          renderItem={({ item }) => <Row u={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          onEndReachedThreshold={0.35}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          refreshing={isFetching && !data}
          onRefresh={() => refetch()}
          ListEmptyComponent={
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                No users
              </Text>
              <Text style={{ color: "#9ca3af", marginTop: 6 }}>
                Try a different search.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
