import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    displayName: v.string(),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  groups: defineTable({
    userId: v.id("users"),
    name: v.string(),
    lighting: v.string(),
    colorGrade: v.string(),
    shotAngle: v.string(),
    surfaceImage: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("complete")
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  dishes: defineTable({
    groupId: v.id("groups"),
    originalImageId: v.id("_storage"),
    vesselType: v.string(),
    vesselImage: v.string(),
    hasCutlery: v.boolean(),
    cutleryPieces: v.optional(v.array(v.string())),
    cutleryStyleImage: v.optional(v.string()),
    decor: v.optional(v.array(v.string())),
    customNote: v.optional(v.string()),
    generatedImageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("pending"),
      v.literal("configured"),
      v.literal("generating"),
      v.literal("complete"),
      v.literal("error")
    ),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_group", ["groupId"]),
});