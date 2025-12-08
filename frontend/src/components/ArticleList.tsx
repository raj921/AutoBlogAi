import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchArticles, type Article } from '@/api/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text text-xl">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="mb-12 text-center">
          <Badge className="mb-4">Latest Updates</Badge>
          <h1 className="text-5xl font-heading text-text mb-4">AutoBlog</h1>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            AI-generated articles about technology, development, and innovation.
          </p>
        </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card 
              key={article.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-border"
              onClick={() => navigate(`/article/${article.id}`)}
            >
              {article.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <h2 className="text-xl font-heading text-text line-clamp-2">
                  {article.title.replace(/^\*\*Title:\s*|\*\*/g, '')}
                </h2>
              </CardHeader>

              <CardContent>
                <p className="text-text/70 line-clamp-3">
                  {article.text_content}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-text/50">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
                <Button variant="default" size="sm">
                  Read more <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;

