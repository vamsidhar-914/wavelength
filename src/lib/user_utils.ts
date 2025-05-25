import { getUserSessionById } from "~/app/auth/core/session";
import { cookies } from "next/headers";
import { db } from "~/server/db";

export const getServerSideUser = async () => {
  const nextCookies = await cookies();
  const sessionId = nextCookies.get("session-id")?.value;

  if (sessionId == null) {
    return null;
  }
  const user = getUserSessionById(sessionId);
  return user;
};

export const getSessionCookie = async () => {
  const nextCookies = await cookies();
  const sessionId = nextCookies.get("session-id")?.value;
  if (sessionId == null) {
    return null;
  }
  return sessionId;
};

export const getServerSideUserById = async (
  id: string,
  authUser: { id: string; role: string } | null,
) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          followers: true,
          follows: true,
          tweets: true,
        },
      },
      followers:
        authUser?.id == null ? undefined : { where: { id: authUser.id } },
    },
  });
  if (user == null) return;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tweetsCount: user._count.tweets,
    followsCount: user._count.follows,
    followersCount: user._count.followers,
    isFollowing: user.followers.length > 0
  }
};
