import { Router, Request, Response } from "express";
import { createArticle, getAllArticles, getArticleById } from "../models/articleModel";

const router = Router();


router.post("/", async (req: Request, res: Response) => {
    try {
        const { title, text_content } = req.body;
        const article = await createArticle({ title, text_content });
        res.status(201).json(article);
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({ error: "Failed to create article" });
    }
});


router.get("/", async (req: Request, res: Response) => {
    try {
        const articles = await getAllArticles();
        res.json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
});


router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid article ID" });

        const article = await getArticleById(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

        res.json(article);
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ error: "Failed to fetch article" });
    }
});

export default router;