import type { FeedResponse } from "./types";

function delay<T>(val: T, ms = 300) {
  return new Promise<T>((res) => setTimeout(() => res(val), ms));
}

export async function fetchMyFeed(): Promise<FeedResponse> {
  return delay({
    user: {
      id: 1,
      name: "Rianna",
      handle: "@rianna.eats",
      avatarUrl: "https://api.dicebear.com/8.x/identicon/svg?seed=rianna",
    },
    reviews: [
      {
        id: "1",
        restaurant: "Sushi E",
        dish: "Salmon Nigiri Omakase",
        rating: 4.5,
        comment: "Silky salmon, perfect rice temp, subtle wasabi.",
        createdAt: new Date().toISOString(),
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80",
        tags: ["Japanese", "Omakase"],
      },
      {
        id: "2",
        restaurant: "Hot Bird",
        dish: "Nashville Hot Chicken Burger",
        rating: 4,
        comment: "Elite crunch. Heat builds. More pickles next time.",
        createdAt: new Date(Date.now() - 3.6e6).toISOString(),
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80",
        tags: ["Spicy", "Casual"],
      },
    ],
  });
}
