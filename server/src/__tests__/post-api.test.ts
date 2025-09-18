// Mock the db module
jest.mock('../db', () => {
  const m = {
    post: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { db: m };
});

import { postApi } from '../controllers/post-api';
import { db } from '../db';
import { Context, createCallerFactory } from '../trpc';

const createCaller = createCallerFactory(postApi);
const caller = createCaller({} as Context);

describe('post-api', () => {
  const basePost = {
    id: 1,
    createdAt: new Date('2025-08-29T00:00:00Z'),
    title: 'Hello',
    published: false,
    authorId: 10,
    foodId: 5,
    image: {
      id: 2,
      storageUrl: '/uploads/some-file.png',
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('creates a post with foodId', async () => {
      (db.post.create as jest.Mock).mockResolvedValue(basePost);
      const result = await caller.create({ title: 'Hello', authorId: 10, foodId: 5, description: 'A delicious meal' });
      expect(db.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'Hello', author: { connect: { id: 10 } }, food: { connect: { id: 5 } }, description: 'A delicious meal' }),
        include: { image: true }
      });
      expect(result).toEqual(basePost);
    });

    it('creates a post without foodId', async () => {
      (db.post.create as jest.Mock).mockResolvedValue({ ...basePost, foodId: null });
      const result = await caller.create({ title: 'Hello', authorId: 10, description: 'A delicious meal' });
      expect(db.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'Hello', author: { connect: { id: 10 } }, description: 'A delicious meal' }),
        include: { image: true }
      });
      expect(result.foodId).toBeNull();
    });
  });

  describe('getPostById', () => {
    it('returns a post when found', async () => {
      (db.post.findUnique as jest.Mock).mockResolvedValue(basePost);
      const result = await caller.getById({ id: 1 });
  expect(db.post.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { image: true } });
      expect(result).toEqual(basePost);
    });

    it('returns null when not found', async () => {
      (db.post.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await caller.getById({ id: 999 });
      expect(result).toBeUndefined();
    });
  });

  describe('getAllPosts', () => {
    it('returns all posts', async () => {
      (db.post.findMany as jest.Mock).mockResolvedValue([basePost]);
      const result = await caller.getAll();
  expect(db.post.findMany).toHaveBeenCalledWith({ include: { image: true } });
      expect(result).toHaveLength(1);
    });
  });

  describe('deletePost', () => {
    it('deletes a post', async () => {
      (db.post.findUnique as jest.Mock).mockResolvedValue(basePost);
      (db.post.delete as jest.Mock).mockResolvedValue(basePost);
      const result = await caller.delete({ id: 1 });
      expect(db.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(basePost);
    });
  });
});
