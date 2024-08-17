import { NextRequest } from 'next/server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { getPostDataInclude, PostsPage } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const q = req.nextUrl.searchParams.get("q") || "";
    const searchQuery = q.split(" ").join(" & ");

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { content: { search: searchQuery } },
          { user: { displayName: { search: searchQuery } } },
          { user: { username: { search: searchQuery } } },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor: nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
