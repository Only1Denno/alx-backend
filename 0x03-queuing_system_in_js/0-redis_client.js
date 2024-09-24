import { createClient } from "redis";

function connect_to_redis() {
  const client = createClient();

  client
    .on("connect", () => console.log("Redis client connected to the server"))
    .on("error", (err) =>
      console.log(`Redis client not connected to the server: ${err.message}`)
    );
}

connect_to_redis();
