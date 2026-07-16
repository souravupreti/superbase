import { Link } from 'react-router-dom';
import { HelpCircle, ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
      
      {/* Animated badge icon */}
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-16 h-16 bg-brand-danger/10 text-brand-danger rounded-3xl flex items-center justify-center border border-brand-danger/20 shadow-lg shadow-brand-danger/5"
      >
        <HelpCircle size={32} />
      </motion.div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">404 - Page Lost</h1>
        <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
          The resources you queried are outer-bounds, archived, or did not exist.
        </p>
      </div>

      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-brand-primary text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 transition-all hover:bg-brand-primary/95"
      >
        <Home size={15} />
        <span>Return to Feed</span>
      </Link>
    </div>
  );
};

export default NotFound;
