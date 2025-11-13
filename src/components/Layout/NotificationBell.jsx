import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationItem = ({ notification, onClick }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'new_upvote': return '👍';
      case 'new_comment': return '💬';
      case 'new_reply': return '↪️';
      case 'badge_unlocked': return '🏆';
      default: return '🔔';
    }
  };

  return (
    <Link to={notification.related_url || '#'} onClick={onClick}>
      <motion.div
        className={`p-3 hover:bg-slate-100 dark:hover:bg-super-dark-primary transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        whileHover={{ x: 2 }}
      >
        <div className="flex items-start gap-3">
          <div className="text-lg mt-1">{getIcon(notification.type)}</div>
          <div className="flex-1">
            <p className="text-sm text-slate-800 dark:text-super-dark-text-primary">{notification.message}</p>
            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary mt-1">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
          {!notification.is_read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 320, // 320px é a largura do dropdown
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-super-dark-primary"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {isOpen && createPortal(
        <div ref={dropdownRef} style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }} className="fixed w-80 bg-white dark:bg-super-dark-secondary rounded-lg shadow-2xl border dark:border-super-dark-border z-50 overflow-hidden">
          <div className="p-3 flex justify-between items-center border-b dark:border-super-dark-border">
            <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1">
                <CheckCheck size={14} /> Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => <NotificationItem key={n.id} notification={n} onClick={() => setIsOpen(false)} />)
            ) : (
              <p className="p-6 text-center text-sm text-slate-500 dark:text-super-dark-text-secondary">Nenhuma notificação ainda.</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotificationBell;