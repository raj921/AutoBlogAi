import { Article } from "./article";
import pool from "../pool";

export const createArticle = async (article: Omit<Article, 'id' | 'created_at'>): Promise<Article> => {
    const result = await pool.query(
        "INSERT INTO articles (title, text_content, image_url) VALUES ($1, $2, $3) RETURNING *",
        [article.title, article.text_content, article.image_url || null]
    );
    return result.rows[0];
}

export const getAllArticles = async (): Promise<Article[]> => {
    const result = await pool.query(
        "SELECT * FROM articles ORDER BY created_at DESC"
    );
    return result.rows;
}

export const getArticleById = async (id: number): Promise<Article | null> => {
    const result = await pool.query(
        "SELECT * FROM articles WHERE id = $1",
        [id]
    );
    return result.rows[0] || null;
}


