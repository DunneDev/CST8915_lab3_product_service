import 'dotenv/config';
import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Type, type Static } from "@sinclair/typebox";

const app: FastifyInstance = Fastify();

// throw error if CORS origin is not configured in the environment
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
if (!FRONTEND_ORIGIN) throw new Error("Missing required environment variable: FRONTEND_ORIGIN");

await app.register(cors, { origin: FRONTEND_ORIGIN });

// port env var set by azure
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3030;

// define prouct scheema
const Product = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  price: Type.Number(),
});

// the the scheema to define the type for TypeScript
type Product = Static<typeof Product>;

// products to serve
const products: Product[] = [
  { id: 1, name: "Dog Food", price: 19.99 },
  { id: 2, name: "Cat Food", price: 34.99 },
  { id: 3, name: "Bird Seeds", price: 10.99 },
  { id: 4, name: "Squirrel Food", price: 6.00 },
];

// route for /products, return the products array as JSON
app.get<{ Reply: Product[] }>("/products", async () => products);

// function to start the fastify server
async function start() {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`product-service running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
