import express, { Request, Response } from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes";
import { initDatabase } from "./db/init";
import { ArticleJob } from "./services/articleJob";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running with TypeScript!");
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

const start = async () => {
  try {
    await initDatabase();
    
  
    const job = new ArticleJob();
    job.startScheduler();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();