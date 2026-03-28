import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    groupId: v.id("groups"),
    originalImageId: v.id("_storage"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dishes", {
      groupId: args.groupId,
      originalImageId: args.originalImageId,
      vesselType: "plate",
      vesselImage: "",
      hasCutlery: false,
      decor: [],
      customNote: "",
      status: "pending",
      order: args.order,
      createdAt: Date.now(),
    });
  },
});

export const listForGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const dishes = await ctx.db
      .query("dishes")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const dishesWithUrls = await Promise.all(
      dishes.map(async (dish) => {
        const originalUrl = await ctx.storage.getUrl(dish.originalImageId);
        const generatedUrl = dish.generatedImageId
          ? await ctx.storage.getUrl(dish.generatedImageId)
          : null;
        return { ...dish, originalUrl, generatedUrl };
      })
    );

    return dishesWithUrls.sort((a, b) => a.order - b.order);
  },
});

export const update = mutation({
  args: {
    dishId: v.id("dishes"),
    vesselType: v.optional(v.string()),
    vesselImage: v.optional(v.string()),
    hasCutlery: v.optional(v.boolean()),
    cutleryPieces: v.optional(v.array(v.string())),
    cutleryStyleImage: v.optional(v.string()),
    decor: v.optional(v.array(v.string())),
    customNote: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("configured"),
        v.literal("generating"),
        v.literal("complete"),
        v.literal("error")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { dishId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(dishId, filteredUpdates);
  },
});

export const setGeneratedImage = mutation({
  args: {
    dishId: v.id("dishes"),
    generatedImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dishId, {
      generatedImageId: args.generatedImageId,
      status: "complete",
    });
  },
});

export const remove = mutation({
  args: { dishId: v.id("dishes") },
  handler: async (ctx, args) => {
    const dish = await ctx.db.get(args.dishId);
    if (dish) {
      await ctx.storage.delete(dish.originalImageId);
      if (dish.generatedImageId) {
        await ctx.storage.delete(dish.generatedImageId);
      }
      await ctx.db.delete(args.dishId);
    }
  },
});

export const countForGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const dishes = await ctx.db
      .query("dishes")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
    return dishes.length;
  },
});
