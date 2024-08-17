import { NextRequest } from 'next/server';

import { validateRequest } from '@/auth';
import prisma from '@/lib/prisma';
import { NotficationsPage, notificationsInclude } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const notfications = await prisma.notfication.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notfications.length > pageSize ? notfications[pageSize].id : null;

    const data: NotficationsPage = {
      notifications: notfications.slice(0, pageSize),
      nextCursor: nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
