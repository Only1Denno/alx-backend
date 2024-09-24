import { createClient, print } from "redis";

const redisClient = createClient();

redisClient.on("connect", () =>
  console.log("Redis client connected to the server")
);

redisClient.on("error", (err) =>
  console.log(`Redis client not connected to the server: ${err.message}`)
);

const HASH_KEY = "HolbertonSchools";

function storeHash() {
  redisClient.hset(HASH_KEY, "Portland", "50", print);
  redisClient.hset(HASH_KEY, "Seattle", "80", print);
  redisClient.hset(HASH_KEY, "New York", "20", print);
  redisClient.hset(HASH_KEY, "Bogota", "20", print);
  redisClient.hset(HASH_KEY, "Cali", "40", print);
  redisClient.hset(HASH_KEY, "Paris", "2", print);
}

function getHash() {
  redisClient.hgetall(HASH_KEY, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(result);
  });
}

storeHash();
getHash();
