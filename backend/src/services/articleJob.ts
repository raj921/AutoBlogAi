import cron from "node-cron";
import { createArticle } from "../models/articleModel";
import { AIClient } from "./aiClient";

export class ArticleJob {
  private ai = new AIClient();

  startScheduler(): void {
    console.log("Starting article generation scheduler...");
   
    cron.schedule("0 0 2 * * *", () => {
      this.generateAndSave().catch(err => console.error("Scheduled  error:", err));
    });
    
    this.generateAndSave().catch(err => console.error("Startup  error:", err));
  }

  private async generateAndSave(): Promise<void> {
    console.log("Generate new article...");
    const { title, content, imageUrl } = await this.ai.generateArticleWithImage();
    await createArticle({ title, text_content: content, image_url: imageUrl });
    console.log(`Article created: ${title} with image: ${imageUrl}`);
  }
}