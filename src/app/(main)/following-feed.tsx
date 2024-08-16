"use client";

import { Loader2 } from 'lucide-react';

import InfiniteScrollContainer from '@/components/infinite-scroll-container';
import Post from '@/components/posts/post';
import PostsLoadingSkeleton from '@/components/posts/posts-loading-skeleton';
import kyInstance from '@/lib/ky';
import { PostsPage } from '@/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts
      </p>
    );
  }

  if (isSuccess && posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}