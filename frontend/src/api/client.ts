const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Article {
    id: number;
    title: string;
    text_content: string;
    image_url?: string;
  created_at: string;
}

export const fetchArticles = async (): Promise<Article[]> => {
    const response = await fetch(`${API_URL}/api/articles`);
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return response.json();
  };

export const fetchArticleById = async (id: number): Promise<Article> => {
    const response = await fetch(`${API_URL}/api/articles/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    return response.json();
};
  