import express from "express";
import { rmSync } from "fs";
import { createClient, print } from "redis";
import { promisify } from "util";

const app = express();
const port = 1245;
const redisClient = createClient();
const get = promisify(redisClient.get).bind(redisClient);

// set event on redis clientclient
redisClient
  .on("connect", () => console.log("redis client connected"))
  .on("error", () =>
    console.log(`redis client failed to connect with err ${err}`)
  );

const listProducts = [
  {
    itemId: 1,
    itemName: "Suitcase 250",
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: "Suitcase 450",
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: "Suitcase 650",
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: "Suitcase 1050",
    price: 550,
    initialAvailableQuantity: 5,
  },
];

// helper function section
function getItemById(id) {
  return listProducts.filter((obj) => obj.itemId == id)[0];
}

function reserveStockById(itemId, stock) {
  redisClient.set(`item.${itemId}`, stock, print);
}

async function getCurrentReservedStockById(itemId) {
  try {
    const stock_value = await get(`item.${itemId}`);
    return stock_value;
  } catch (err) {
    console.log("Error while getting current stock value", err.message);
  }
}

// Routes section

app.get("/list_products", (req, res) => {
  res.status(200).json(listProducts);
});

// get a production using the itemId from redis server
app.get("/list_products/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  console;

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);

    const return_json = {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity:
        stock !== null ? parseInt(stock) : item.initialAvailableQuantity,
    };
    res.status(200).json(return_json);
  } else {
    res.status(404).json({ status: "Product not found" });
  }
});

// preserve a product using the itemId
app.get("/reserve_product/:itemId", (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));
  if (!item) {
    res.status(404).json({ status: "Product not found" });
  } else {
    if (!(item.initialAvailableQuantity > 1)) {
      res
        .status(400)
        .json({ status: "Not enough stock available", itemId: itemId });
    } else {
      console.log("item value", item.initialAvailableQuantity);
      reserveStockById(itemId, item.initialAvailableQuantity - 1);
      res.status(200).json({ status: "Reservation confirmed", itemId: itemId });
    }
  }
});

// start development server
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
