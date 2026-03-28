const { ConvexHttpClient } = require("convex/browser");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function run() {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  // Get groups or user's groups
  // We can just fetch the Vercel URL directly since the user just tried it!
  console.log("We need a valid groupId and dishId to test.");
}
run();
