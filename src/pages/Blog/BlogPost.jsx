import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        // Vite-specific dynamic import for raw file content
        const postModule = await import(`../../data/blog/${slug}.md?raw`);
        const { data, content } = matter(postModule.default);
        setPost({ frontmatter: data, content });
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null); // Ensure post is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Post não encontrado</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Não conseguimos encontrar o post que você está procurando.</p>
        <Link to="/blog" className="mt-6 inline-block rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors">
          <ArrowLeft size={16} className="inline-block mr-2" />
          Voltar para o Blog
        </Link>
      </div>
    );
  }

  const { title, author, date, tags } = post.frontmatter;

  return (
    <div className="bg-white dark:bg-super-dark-primary py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-800 dark:hover:text-purple-200 transition-colors duration-200">
              <ArrowLeft size={16} className="mr-2" />
              <span>Voltar para todos os posts</span>
            </Link>
          </div>

          <article>
            <header className="mb-10 border-b border-slate-200 dark:border-super-dark-border pb-8">
              <div className="mb-4">
                {tags && tags.map(tag => (
                  <span key={tag} className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-gaming tracking-tight text-slate-900 dark:text-white mb-4">{title}</h1>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-500 mt-4">
                <div className="flex items-center mr-6">
                  <User size={14} className="mr-2" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span>{new Date(date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </header>

            {/* The `prose` class from @tailwindcss/typography handles all the styling for the markdown content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-gaming prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-strong:text-slate-800 dark:prose-strong:text-slate-200">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;