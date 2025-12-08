
import dotenv from "dotenv";
dotenv.config();

export class AIClient {
  private openrouterApiKey = process.env.OPENROUTER_API_KEY;
  private openrouterUrl = "https://openrouter.ai/api/v1/chat/completions";

  async generateArticleWithImage(): Promise<{ title: string; content: string; imageUrl: string }> {
    const article = await this.generateArticle();
    const imageUrl = await this.generateImage(article.title);
    return { ...article, imageUrl };
  }

  async generateArticle(): Promise<{ title: string; content: string }> {
    try {
      if (!this.openrouterApiKey) {
        return this.fallbackArticle("Missing OPENROUTER_API_KEY");
      }

      const topics = [
        "microservices architecture",
        "cloud-native development",
        "DevOps best practices",
        "container orchestration",
        "API design patterns",
        "database optimization",
        "CI/CD automation"
      ];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const prompt = `Write a concise 300-word tech blog post about ${topic}. Include a catchy title as the first line, then 2-3 paragraphs of helpful content for developers.`;

      const response = await fetch(this.openrouterUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.openrouterApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3.2",
          messages: [
            { role: "system", content: "You are a best technical writer." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content as string | undefined;

      if (!content) {
        throw new Error("No content returned from OpenRouter");
      }

      
      const [firstLine, ...rest] = content.split("\n").filter(Boolean);
      const title = firstLine?.replace(/^#+\s*/, "").trim() || "Auto-generated Article";
      const body = rest.join("\n").trim() || content.trim();

      return {
        title,
        content: body,
      };
    } catch (err) {
      console.error("AI generation failed:", err);
      return this.fallbackArticle("AI generation failed");
    }
  }

  async generateImage(prompt: string): Promise<string> {
   
    const seed = prompt.slice(0, 50).replace(/[^a-zA-Z0-9]/g, "") || "autoblog";
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
  }

 

  private fallbackArticle(reason: string) {
    const now = new Date().toISOString();
    return {
      title: `AutoBlog fallback (${now.split("T")[0]})`,
      content: `This is a fallback article because: ${reason}. Generated at ${now}.`,
    };
  }
}