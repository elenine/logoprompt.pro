import { g as getEnv, a as getDb, u as user, s as subscription } from '../../../chunks/env_BlcyOfWY.mjs';
import { or, like, sql, desc, eq } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  const env = getEnv();
  try {
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const filter = url.searchParams.get("filter") || "all";
    const offset = (page - 1) * limit;
    const db = getDb(env.DATABASE_URL);
    let whereClause = void 0;
    if (search) {
      whereClause = or(
        like(user.name, `%${search}%`),
        like(user.email, `%${search}%`)
      );
    }
    const usersQuery = db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      subscriptionStatus: subscription.status
    }).from(user).leftJoin(subscription, sql`${user.id} = ${subscription.userId}`).orderBy(desc(user.createdAt)).limit(limit).offset(offset);
    let users;
    if (filter === "admins") {
      users = await usersQuery.where(
        whereClause ? sql`${user.isAdmin} = true AND (${whereClause})` : sql`${user.isAdmin} = true`
      );
    } else if (filter === "subscribed") {
      users = await usersQuery.where(
        whereClause ? sql`${subscription.status} = 'active' AND (${whereClause})` : sql`${subscription.status} = 'active'`
      );
    } else {
      users = whereClause ? await usersQuery.where(whereClause) : await usersQuery;
    }
    const countResult = await db.select({ count: sql`count(*)` }).from(user);
    const total = Number(countResult[0]?.count || 0);
    const activeSubsResult = await db.select({ count: sql`count(*)` }).from(subscription).where(eq(subscription.status, "active"));
    const activeSubscriptions = Number(activeSubsResult[0]?.count || 0);
    return new Response(
      JSON.stringify({
        users,
        activeSubscriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin users error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
