import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    lighting: v.string(),
    colorGrade: v.string(),
    shotAngle: v.string(),
    surfaceImage: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("groups", {
      userId: user._id,
      name: args.name,
      lighting: args.lighting,
      colorGrade: args.colorGrade,
      shotAngle: args.shotAngle,
      surfaceImage: args.surfaceImage,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const getById = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.groupId);
  },
});

export const listForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return [];

    const groups = await ctx.db
      .query("groups")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const dishes = await ctx.db
          .query("dishes")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();
        const sorted = [...dishes].sort((a, b) => a.order - b.order);
        const first = sorted[0];
        let previewUrl: string | null = null;
        if (first) {
          if (first.generatedImageId) {
            previewUrl = await ctx.storage.getUrl(first.generatedImageId);
          }
          if (!previewUrl) {
            previewUrl = await ctx.storage.getUrl(first.originalImageId);
          }
        }
        return {
          ...group,
          dishCount: dishes.length,
          completedCount: dishes.filter((d) => d.status === "complete").length,
          previewUrl,
        };
      })
    );

    return groupsWithCounts;
  },
});

export const update = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.optional(v.string()),
    lighting: v.optional(v.string()),
    colorGrade: v.optional(v.string()),
    shotAngle: v.optional(v.string()),
    surfaceImage: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("generating"),
        v.literal("complete")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { groupId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(groupId, filteredUpdates);
  },
});

export const remove = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const dishes = await ctx.db
      .query("dishes")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    for (const dish of dishes) {
      if (dish.generatedImageId) {
        await ctx.storage.delete(dish.generatedImageId);
      }
      await ctx.storage.delete(dish.originalImageId);
      await ctx.db.delete(dish._id);
    }

    await ctx.db.delete(args.groupId);
  },
});
