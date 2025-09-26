import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPostCard = ({ post }) => {
  const { title, excerpt, date, author, slug, tags } = post.frontmatter;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white dark:bg-super-dark-secondary rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-super-dark-border"
    >
      <div className="p-6">
        <div className="mb-4">
          {tags && tags.map(tag => (
            <span key={tag} className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/blog/${slug}`}>
          <h2 className="text-2xl font-bold font-gaming text-slate-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
            {title}
          </h2>
        </Link>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{excerpt}</p>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center mr-4">
            <User size={14} className="mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <Link to={`/blog/${slug}`} className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold mt-4 hover:text-purple-800 dark:hover:text-purple-200 transition-colors duration-200">
          Ler mais <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;
