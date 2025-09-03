export type User = {
  id: number;
  name: string;
  handle: string;
  avatarUrl?: string;
};

export type Review = {
  id: string;
  restaurant: string;
  dish: string;
  rating: number;   // 0–5
  comment?: string;
  createdAt: string;
  imageUrl?: string;
  tags?: string[];
};

export type FeedResponse = {
  user: User;
  reviews: Review[];
};
