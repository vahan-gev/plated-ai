import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateUser = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_device_id", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      deviceId: args.deviceId,
      displayName: "Guest",
      plan: "free",
      createdAt: Date.now(),
    });
  },
});

export const getCurrentUser = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_device_id", (q) => q.eq("deviceId", args.deviceId))
      .first();
  },
});

export const updateProfile = mutation({
  args: { deviceId: v.string(), displayName: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_device_id", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (!user) throw new Error("User not found");
    await ctx.db.patch(user._id, { displayName: args.displayName });
  },
});
