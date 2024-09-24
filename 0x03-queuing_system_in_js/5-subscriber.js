import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("connect", () =>
  console.log("Redis client connected to the server")
);

redisClient.on("error", (err) =>
  console.log(`Redis client not connected to the server: ${err.message}`)
);

redisClient.subscribe("holberton school channel");

redisClient.on("message", (channel, message) => {
  console.log(message);
  if (message === "KILL_SERVER") {
    redisClient.unsubscribe("holberton school channel");
    redisClient.end(true);
  }
});
