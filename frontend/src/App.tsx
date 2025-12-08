import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticleList from '@/components/ArticleList';
import ArticleDetail from '@/components/ArticleDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;