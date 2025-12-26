
import React, { useState, useEffect, useRef } from 'react';
import { Post, UserProfile, Comment } from './types.ts';
import { MOCK_CURRENT_USER, INITIAL_POSTS, BADGES, CAROUSEL_IMAGES, APP_ICON } from './constants.tsx';
import { PostCard } from './components/PostCard.tsx';
import { BadgeIcon } from './components/BadgeIcon.tsx';
import { verifyQuote, generateIdea } from './services/geminiService.ts';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'feed' | 'profile' | 'wallpapers' | 'settings'>('feed');
  const [wallCategory, setWallCategory] = useState<'Minimalista' | 'Anime' | 'Paisagem'>('Minimalista');
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('jd_user');
    try {
      return saved ? JSON.parse(saved) : MOCK_CURRENT_USER;
    } catch {
      return MOCK_CURRENT_USER;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('jd_posts');
    try {
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newPostContent, setNewPostContent] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('jd_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jd_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const isOwner = user.badges.includes('owner');

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    setIsVerifying(true);
    try {
      const analysis = await verifyQuote(newPostContent);
      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: user.id,
        content: newPostContent,
        type: 'quote',
        timestamp: Date.now(),
        likes: 0,
        comments: [],
        isVerified: analysis.status && analysis.score > 70
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const idea = await generateIdea();
      if (idea) setNewPostContent(idea.trim());
    } finally {
      setIsGenerating(false);
    }
  };

  const deletePost = (postId: string) => {
    if (window.confirm("Deseja banir esta postagem da era jurássica?")) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const deleteComment = (postId: string, commentId: string) => {
    if (window.confirm("Excluir este comentário?")) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
        }
        return p;
      }));
    }
  };

  const addComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      text,
      timestamp: Date.now()
    };
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
  };

  const handleFileUpload = (type: 'avatar' | 'banner' | 'background', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'avatar') setUser({ ...user, avatar: result });
        else if (type === 'banner') setUser({ ...user, banner: result });
        else if (type === 'background') setUser({ ...user, profileBackground: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsVerifying(false);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8 animate-bounce-short">
          <img src={APP_ICON} className="w-24 h-24 rounded-[2rem] shadow-2xl shadow-orange-500/20" alt="JurassicDreams Icon" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
          JurassicDreams
        </h1>
        <p className="text-slate-500 text-sm font-medium max-w-xs mb-10 leading-relaxed">
          Onde os seus sonhos e gírias criam história. Autentique-se para entrar na era.
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={isVerifying}
          className="w-full max-w-sm flex items-center justify-center gap-4 bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
        >
          {isVerifying ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <>
              <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-6 h-6" alt="Google" />
              Entrar com Gmail
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 md:pb-0 md:pt-16 flex flex-col max-w-2xl mx-auto border-x border-slate-800 bg-[#0b0f1a] shadow-2xl relative transition-all duration-700`}
         style={view === 'profile' && user.profileBackground ? { 
           backgroundImage: `url(${user.profileBackground})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         } : {}}>
      
      {view === 'profile' && user.profileBackground && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-0"></div>
      )}

      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0b0f1a]/90 backdrop-blur-xl border-b border-slate-800/60 z-50 px-5 flex items-center justify-between max-w-2xl mx-auto shadow-sm">
        <div className="flex items-center gap-2">
          <img src={APP_ICON} className="w-8 h-8 rounded-lg" alt="Icon" />
          <h1 className="text-xl font-black italic tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            JurassicDreams
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView('settings')} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </button>
          <img 
            src={user.avatar} 
            onClick={() => setView('profile')}
            className="w-9 h-9 rounded-full border-2 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg object-cover" 
            style={{ borderColor: user.accentColor }} 
          />
        </div>
      </nav>

      <main className="flex-1 mt-16 px-4 z-10 relative">
        {view === 'feed' && (
          <div className="animate-fade-in pt-4">
            <div className="relative w-full h-44 rounded-[2rem] overflow-hidden mb-6 group border border-slate-800 shadow-2xl">
              {CAROUSEL_IMAGES.map((img, idx) => (
                <img 
                  key={img}
                  src={img} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === carouselIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <div className="bg-orange-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-tighter">PRÉ-HISTÓRICO</div>
                <h2 className="text-xl font-black text-white leading-tight drop-shadow-lg uppercase tracking-tighter">Exploração Jurássica Liberada</h2>
              </div>
            </div>

            <div className="bg-slate-800/30 p-5 rounded-3xl mb-8 border border-slate-800/50 shadow-inner backdrop-blur-md">
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Qual o pensamento jurássico de hoje?"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-600 resize-none h-24 text-lg font-medium"
              />
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/50">
                <div className="flex gap-4 text-slate-500 px-2 items-center">
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className={`hover:text-yellow-400 transition-all flex items-center gap-1.5 ${isGenerating ? 'animate-pulse text-yellow-500' : ''}`}
                    title="Gerar Ideia com IA"
                  >
                    <i className={`fa-solid ${isGenerating ? 'fa-dna animate-spin' : 'fa-wand-sparkles'} text-lg`}></i>
                    <span className="text-[10px] font-black uppercase tracking-tighter">IA Idea</span>
                  </button>
                  <button className="hover:text-orange-400 transition-colors"><i className="fa-regular fa-image text-lg"></i></button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={isVerifying || !newPostContent.trim()}
                  className={`px-8 py-2.5 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${isVerifying ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-500/20 hover:scale-[1.02]'}`}
                >
                  {isVerifying ? <i className="fa-solid fa-microscope animate-bounce"></i> : 'POSTAR'}
                </button>
              </div>
              {isVerifying && (
                <div className="mt-2 text-[9px] text-orange-400 font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved"></i> IA está analisando a autenticidade...
                </div>
              )}
            </div>

            <div className="space-y-1 pb-20">
              {posts.filter(p => p.type !== 'wallpaper').map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  user={user} 
                  isOwner={isOwner} 
                  onDelete={() => deletePost(post.id)}
                  onDeleteComment={(cid) => deleteComment(post.id, cid)}
                  onAddComment={(txt) => addComment(post.id, txt)}
                />
              ))}
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="animate-fade-in py-4">
            <div className="relative h-44 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50">
              <img src={user.banner} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
            </div>
            
            <div className="relative px-6 -mt-16 mb-8">
              <div className="flex justify-between items-end mb-4">
                <div className="relative group">
                  <img src={user.avatar} className="w-32 h-32 rounded-full border-[6px] border-[#0b0f1a] shadow-2xl object-cover" />
                </div>
                <button 
                  onClick={() => setView('settings')}
                  className="px-6 py-2 rounded-2xl border-2 border-slate-700 hover:bg-slate-800 text-xs font-black uppercase tracking-widest transition-all bg-slate-900 shadow-xl active:scale-95"
                >
                  PERSONALIZAR
                </button>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black tracking-tighter" style={{ color: user.nameColor }}>{user.name}</h2>
                  {user.primaryBadgeId && (
                    <BadgeIcon badge={BADGES.find(b => b.id === user.primaryBadgeId)!} size="md" />
                  )}
                </div>
                <div className="flex gap-3 items-center text-slate-500 text-xs font-bold uppercase">
                  <span>@{user.username}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span>{user.pronouns}</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed mt-4 bg-slate-900/60 backdrop-blur-sm p-5 rounded-3xl border border-slate-800/40 italic shadow-lg">
                  "{user.bio}"
                </p>
                
                <div className="mt-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-3 ml-1">Medalheiro</h3>
                  <div className="flex flex-wrap gap-3 p-4 bg-slate-950/40 backdrop-blur-md rounded-3xl border border-slate-800/50">
                    {user.badges.map(bid => {
                      const b = BADGES.find(x => x.id === bid);
                      return b ? <BadgeIcon key={bid} badge={b} size="md" /> : null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-8 mt-4">
              <div className="space-y-2 pb-20">
                {posts.filter(p => p.userId === user.id).map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    user={user} 
                    isOwner={isOwner}
                    onDelete={() => deletePost(post.id)}
                    onDeleteComment={(cid) => deleteComment(post.id, cid)}
                    onAddComment={(txt) => addComment(post.id, txt)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'wallpapers' && (
          <div className="animate-fade-in py-6">
            <header className="space-y-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase tracking-tighter">Cofre de Walls</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Era: Jurássico Profundo</p>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Minimalista', 'Anime', 'Paisagem'].map((cat: any) => (
                  <button 
                    key={cat}
                    onClick={() => setWallCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${wallCategory === cat ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4 pb-24">
              {posts.filter(p => p.type === 'wallpaper' && p.category === wallCategory).map(post => (
                <div key={post.id} className="group relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 hover:border-orange-500/50 transition-all cursor-pointer">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-orange-400 uppercase">{post.category}</p>
                      <p className="text-xs text-white font-bold">@Dono</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="animate-fade-in py-6 space-y-8 pb-24">
            <header className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Genética Visual</h2>
              <button onClick={() => setView('profile')} className="bg-orange-600 px-6 py-2 rounded-2xl font-black text-xs uppercase shadow-lg shadow-orange-900/20 active:scale-95">SALVAR</button>
            </header>

            <section className="space-y-8 bg-slate-800/20 p-8 rounded-[2.5rem] border border-slate-800/40">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-slate-900" />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fa-solid fa-camera text-white"></i>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('avatar', e)} />
                  </div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Avatar Jurássico</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Nome de Sonhador</label>
                    <input 
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white font-bold focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Bio / Descrição</label>
                    <textarea 
                      value={user.bio}
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">DNA de Ambientes</label>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => bannerInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all"
                   >
                     <i className="fa-solid fa-panorama text-2xl text-slate-600"></i>
                     <span className="text-[9px] font-black uppercase text-slate-400">Banner Superior</span>
                     <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('banner', e)} />
                   </button>
                   <button 
                    onClick={() => backgroundInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all"
                   >
                     <i className="fa-solid fa-image text-2xl text-slate-600"></i>
                     <span className="text-[9px] font-black uppercase text-slate-400">Fundo Perfil</span>
                     <input type="file" ref={backgroundInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('background', e)} />
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Selo Principal</label>
                <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {user.badges.map(bid => {
                    const b = BADGES.find(x => x.id === bid);
                    if (!b) return null;
                    return (
                      <button 
                        key={bid}
                        onClick={() => setUser({...user, primaryBadgeId: bid})}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${user.primaryBadgeId === bid ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-950/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}`}
                      >
                        <BadgeIcon badge={b} size="sm" showTooltip={false} />
                        <span className="text-[10px] font-black text-slate-200 uppercase truncate">{b.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#0b0f1a]/80 backdrop-blur-2xl border-t border-slate-800/60 flex items-center justify-around z-50 max-w-2xl mx-auto px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button onClick={() => setView('feed')} className={`flex flex-col items-center gap-1 transition-all group ${view === 'feed' ? 'text-orange-400' : 'text-slate-600'}`}>
          <div className={`p-2 rounded-2xl transition-all ${view === 'feed' ? 'bg-orange-500/10' : 'group-hover:bg-slate-800/50'}`}>
            <i className="fa-solid fa-dna text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Início</span>
        </button>
        <button onClick={() => setView('wallpapers')} className={`flex flex-col items-center gap-1 transition-all group ${view === 'wallpapers' ? 'text-orange-400' : 'text-slate-600'}`}>
          <div className={`p-2 rounded-2xl transition-all ${view === 'wallpapers' ? 'bg-orange-500/10' : 'group-hover:bg-slate-800/50'}`}>
            <i className="fa-solid fa-mountain-sun text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Walls</span>
        </button>
        <div className="relative -mt-10">
          <button onClick={() => setView('feed')} className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-white text-3xl hover:scale-110 active:scale-95 transition-all border-[3px] border-[#0b0f1a]">
            <i className="fa-solid fa-plus-large"></i>
          </button>
        </div>
        <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-1 transition-all group ${view === 'profile' ? 'text-orange-400' : 'text-slate-600'}`}>
          <div className={`p-2 rounded-2xl transition-all ${view === 'profile' ? 'bg-orange-500/10' : 'group-hover:bg-slate-800/50'}`}>
            <i className="fa-solid fa-skull-crossbones text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
        </button>
        <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 transition-all group ${view === 'settings' ? 'text-orange-400' : 'text-slate-600'}`}>
          <div className={`p-2 rounded-2xl transition-all ${view === 'settings' ? 'bg-orange-500/10' : 'group-hover:bg-slate-800/50'}`}>
            <i className="fa-solid fa-sliders text-xl"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Style</span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounceShort { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-short { animation: bounceShort 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
