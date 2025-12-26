
import React, { useState } from 'react';
import { Post, UserProfile, Comment } from '../types';
import { BADGES } from '../../constants';
import { BadgeIcon } from './BadgeIcon';

interface PostCardProps {
  post: Post;
  user: UserProfile;
  isOwner?: boolean;
  onDelete?: () => void;
  onDeleteComment?: (commentId: string) => void;
  onAddComment?: (text: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  user, 
  isOwner, 
  onDelete, 
  onDeleteComment, 
  onAddComment 
}) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const primaryBadge = BADGES.find(b => b.id === user.primaryBadgeId);

  const handleAddComment = () => {
    if (!newComment.trim() || !onAddComment) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 mb-4 border border-slate-700/40 hover:border-slate-600 transition-all shadow-xl group relative">
      
      {/* Botão de Excluir Post (Moderador) */}
      {isOwner && onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors p-2 z-20"
          title="Banir Postagem"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      )}

      <div className="flex items-start gap-3 mb-4">
        <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border-2 shrink-0 shadow-lg" style={{ borderColor: user.accentColor }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-base truncate" style={{ color: user.nameColor }}>
              {user.name}
            </span>
            {primaryBadge && (
              <div className="flex items-center justify-center">
                <BadgeIcon badge={primaryBadge} size="sm" />
              </div>
            )}
            <span className="text-slate-500 text-xs font-medium">@{user.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{post.type}</div>
            {post.category && (
              <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 rounded uppercase font-black">{post.category}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 pl-1">
        <p className="text-slate-100 text-[1.05rem] font-medium leading-relaxed">
          {post.content}
        </p>
        {post.image && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-700 shadow-inner group-hover:shadow-orange-500/10 transition-shadow">
            <img src={post.image} className="w-full object-cover max-h-[450px] hover:scale-105 transition-transform duration-700" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/30 mt-2">
        <div className="flex gap-4">
          <button 
            onClick={() => { setLikes(prev => isLiked ? prev - 1 : prev + 1); setIsLiked(!isLiked); }}
            className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-full ${isLiked ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:text-red-400 hover:bg-red-400/5'}`}
          >
            <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
            <span>{likes}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${showComments ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/5'}`}
          >
            <i className="fa-regular fa-comment"></i>
            <span>{post.comments.length}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          {post.isVerified && (
             <div className="bg-blue-500/10 text-blue-400 text-[9px] px-2 py-1 rounded-md border border-blue-500/20 flex items-center gap-1.5 font-black uppercase tracking-widest shadow-lg">
               <i className="fa-solid fa-certificate"></i> ORIGINAL
             </div>
          )}
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-3 animate-fade-in">
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-3 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50 group/comment">
              <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${c.userId}`} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Visitante</div>
                  {isOwner && onDeleteComment && (
                    <button 
                      onClick={() => onDeleteComment(c.id)}
                      className="text-slate-600 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-all"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-200">{c.text}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <input 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              ENVIAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
