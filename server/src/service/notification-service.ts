import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { db } from "../db";

let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

export async function sendPostNotification(authorId: number) {
    const followers = await db.follow.findMany({
        where: { followingId: authorId},
        include: { follower: true }
    });
    const tokens = followers.map(x => x.follower.pushToken);

    const messages: ExpoPushMessage[] = [];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }

    // TODO: later handle ticket receipts
}