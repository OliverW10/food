// Mock the db module
jest.mock('../db', () => {
  const m = {
    post: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    like: {
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    comment: {
      count: jest.fn(),
    },
  };
  return { db: m };
});

import { IncomingHttpHeaders } from 'http';
import { postApi } from '../controllers/post-api';
import { db } from '../db';
import { createAccessToken } from '../service/auth';
import { Context, createCallerFactory } from '../trpc';

const createCaller = createCallerFactory(postApi);
const headers: IncomingHttpHeaders = { authorization: `Bearer: ${createAccessToken({id: 0, email: "a@b.c"})}` }
const caller = createCaller({ req: { headers }} as Context);

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
