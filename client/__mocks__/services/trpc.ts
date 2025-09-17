const feedItems = [
  { id: 1, title: 'Ramen', description: 'Yum', author:{id:2, email:'alice@example.com'},
    likesCount: 0, likedByMe: false, commentsCount: 2 },
];

const useInfiniteQuery = jest.fn().mockReturnValue({
  data: { pages: [{ items: feedItems }] },
  isLoading: false,
  isFetching: false,
  refetch: jest.fn(),
  fetchNextPage: jest.fn(),
  hasNextPage: false,
});

const likeMutate = jest.fn();

const trpc: any = {
  post: {
    getFeed: { useInfiniteQuery },
    likeToggle: { useMutation: jest.fn(() => ({ mutate: likeMutate })) },
  },
  comments: {
    list: { useInfiniteQuery: jest.fn().mockReturnValue({
      data: { pages: [{ items: [
        { id: 10, text: 'nice!', author:{id:3, email:'bob@example.com'}, createdAt: new Date() }
      ]}] },
      isLoading: false,
      refetch: jest.fn(),
    })},
    add: { useMutation: jest.fn(() => ({ mutate: jest.fn() })) },
  },
  useUtils: () => ({
    post: {
      getFeed: {
        cancel: jest.fn(),
        getInfiniteData: jest.fn(() => ({ pages: [{ items: feedItems }] })),
        setInfiniteData: jest.fn(),
        invalidate: jest.fn(),
      }
    }
  }),
};

export default trpc;
export { trpc };

