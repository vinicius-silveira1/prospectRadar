import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import matter from 'gray-matter';
import BlogPostCard from '../../components/Blog/BlogPostCard';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { Rss } from 'lucide-react';

const BlogIndex = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true);
      // Use { as: 'raw', eager: true } to directly import the raw content of the files.
      const postModules = import.meta.glob('../../data/blog/*.md', { as: 'raw', eager: true });
      
      const fetchedPosts = Object.entries(postModules).map(([path, rawContent]) => {
        const slug = path.split('/').pop().replace(/\.md$/, '');
        const { data } = matter(rawContent);
        return { frontmatter: { ...data, slug } };
      });

      // Sort posts by date in descending order
      fetchedPosts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
      
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }} 
        className="relative flex flex-col sm:flex-row items-center text-center sm:text-left justify-between gap-6 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white p-6 rounded-xl shadow-2xl shadow-purple-500/10 border border-blue-200/20 dark:border-gray-700 mb-8 overflow-hidden"
        whileHover={{
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(59, 130, 246, 0.3)"
        }}
      >
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-gaming font-bold text-white font-mono tracking-wide flex items-center justify-center sm:justify-start gap-3"
          >
            <Rss className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mr-2 sm:mr-3 flex-shrink-0 drop-shadow-lg" />
            Blog do prospectRadar
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-blue-100 dark:text-gray-300 mt-1"
          >
            Análises, notícias e tudo sobre o universo do scouting de basquete.
          </motion.p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BlogPostCard post={post} />
          </motion.div>
        ))}      </div>
    </div>
  );
};

export default BlogIndex;
