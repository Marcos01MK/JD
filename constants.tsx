
import { Badge, BadgeTier, UserProfile, Post } from './types.ts';

/** 
 * 🦖 GUIA DE PERSONALIZAÇÃO JURÁSSICA 🦖
 * 
 * 1. Transforme sua foto local em texto no site: base64-image.de
 * 2. Copie o "Data-URI"
 * 3. Cole abaixo entre as aspas.
 */

// ÍCONE DO APP (Cole seu Base64 aqui)
export const APP_ICON = "https://i.im.ge/2025/12/25/BmBkfF.jdicon.png";

// SELOS (Substitua os links abaixo pelo seu Base64 das fotos do seu PC)
const IMG_OWNER = "https://i.im.ge/2025/12/25/BmBHrK.saurinhos.png";
const IMG_MOMMY_GOTH = "https://i.im.ge/2025/12/25/BmBfN6.mommygoth.png";
const IMG_INSPECTOR = "https://api.dicebear.com/7.x/identicon/svg?seed=inspector&colors=3b82f6";
const IMG_VERIFIED = "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d47353046551e92.svg";

export const BADGES: Badge[] = [
  {
    id: 'owner',
    name: 'Dono de Tudo',
    icon: IMG_OWNER, // Se colar o Base64 acima, ele muda aqui automaticamente
    tier: BadgeTier.OWNER,
    color: '#fbbf24',
    description: 'O Shiba Dino de Diamante Supremo.'
  },
  {
    id: 'mommy-goth',
    name: 'Mommy Goth',
    icon: IMG_MOMMY_GOTH,
    tier: BadgeTier.RANK,
    color: '#a855f7',
    description: 'Nível 3 do Clã Gótico.'
  },
  {
    id: 'inspector',
    name: 'Inspetor',
    icon: IMG_INSPECTOR,
    tier: BadgeTier.INSPECTOR,
    color: '#3b82f6',
    description: 'Olhos da moderação jurássica.'
  },
  {
    id: 'walls',
    name: 'Walls',
    icon: '🖼️',
    tier: BadgeTier.PERK,
    color: '#10b981',
    description: 'Mestre dos Wallpapers.'
  },
  {
    id: 'verified',
    name: 'Original',
    icon: IMG_VERIFIED,
    tier: BadgeTier.RANK,
    color: '#60a5fa',
    description: 'Frase pura e autêntica.'
  }
];

// O SEU USUÁRIO (O Dono)
export const MOCK_CURRENT_USER: UserProfile = {
  id: 'owner-id-999',
  name: 'O Dono',
  username: 'jurassic_owner',
  bio: 'Falar gírias não me torna menos letrado. (Você não precisa de palavras "Difíceis" pra conseguir se expressar)',
  pronouns: 'Ele/Mestre',
  avatar: APP_ICON,
  banner: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
  profileBackground: '',
  nameColor: '#fbbf24',
  accentColor: '#fbbf24',
  badges: ['owner', 'walls', 'mommy-goth', 'inspector'],
  primaryBadgeId: 'owner'
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'owner-id-999',
    content: 'Seja bem-vindo ao JurassicDreams. Aqui, sua voz é lei.',
    type: 'thought',
    timestamp: Date.now(),
    likes: 100,
    comments: []
  }
];

export const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&h=400&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=400&q=80'
];
