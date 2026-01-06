import { g as getEnv, a as getDb, u as user } from '../../../../chunks/env_BlcyOfWY.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../../../renderers.mjs';

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
    const userId = context.params.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const db = getDb(env.DATABASE_URL);
    const userDetails = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!userDetails[0]) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ user: userDetails[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin get user error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const PATCH = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  const env = getEnv();
  try {
    const userId = context.params.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await context.request.json();
    const { isAdmin } = body;
    const db = getDb(env.DATABASE_URL);
    const existingUser = await db.select({ id: user.id }).from(user).where(eq(user.id, userId)).limit(1);
    if (!existingUser[0]) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const updateData = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (typeof isAdmin === "boolean") {
      updateData.isAdmin = isAdmin;
    }
    await db.update(user).set(updateData).where(eq(user.id, userId));
    return new Response(
      JSON.stringify({ success: true, message: "User updated" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin update user error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
