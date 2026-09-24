// Avatar utilities for student gender-based illustrated avatars and photo customization

export function createSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// 1. Illustrated Male Student Avatar (Chico con uniforme escolar)
export const ILLUSTRATED_MALE_AVATAR = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bgMale" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#134e4a" />
    </linearGradient>
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffdfba" />
      <stop offset="100%" stop-color="#f5c796" />
    </linearGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3e2723" />
      <stop offset="100%" stop-color="#211510" />
    </linearGradient>
  </defs>
  <!-- Background Circle -->
  <circle cx="120" cy="120" r="120" fill="url(#bgMale)" />
  <circle cx="120" cy="120" r="114" fill="none" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.3" />
  
  <!-- Shoulders & Uniform -->
  <path d="M 45 240 C 45 185 80 165 120 165 C 160 165 195 185 195 240 Z" fill="#0f766e" />
  <!-- Shirt & Collar -->
  <path d="M 95 168 L 120 195 L 145 168 Z" fill="#f8fafc" />
  <path d="M 120 195 L 114 240 L 126 240 Z" fill="#0e7490" />
  <!-- Tie / School Badge -->
  <path d="M 115 190 L 125 190 L 128 220 L 120 230 L 112 220 Z" fill="#f59e0b" />
  <circle cx="120" cy="198" r="3" fill="#b45309" />
  
  <!-- Neck -->
  <rect x="105" y="140" width="30" height="32" rx="6" fill="#f5c796" />
  <path d="M 105 148 Q 120 160 135 148 Z" fill="#e0ab76" opacity="0.6" />

  <!-- Ears -->
  <circle cx="68" cy="118" r="14" fill="#f5c796" />
  <circle cx="68" cy="118" r="7" fill="#e0ab76" opacity="0.6" />
  <circle cx="172" cy="118" r="14" fill="#f5c796" />
  <circle cx="172" cy="118" r="7" fill="#e0ab76" opacity="0.6" />

  <!-- Head Base -->
  <path d="M 72 108 C 72 65 92 50 120 50 C 148 50 168 65 168 108 C 168 145 146 160 120 160 C 94 160 72 145 72 108 Z" fill="url(#skinGrad)" />

  <!-- Eyes -->
  <circle cx="98" cy="108" r="7" fill="#1e293b" />
  <circle cx="142" cy="108" r="7" fill="#1e293b" />
  <circle cx="96" cy="106" r="2.5" fill="#ffffff" />
  <circle cx="140" cy="106" r="2.5" fill="#ffffff" />

  <!-- Eyebrows -->
  <path d="M 88 95 Q 98 90 108 94" stroke="#2b1810" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <path d="M 132 94 Q 142 90 152 95" stroke="#2b1810" stroke-width="3.5" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 117 114 Q 120 122 123 121" stroke="#d99961" stroke-width="2.5" stroke-linecap="round" fill="none" />

  <!-- Cheeks -->
  <ellipse cx="88" cy="122" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />
  <ellipse cx="152" cy="122" rx="7" ry="4" fill="#f43f5e" opacity="0.25" />

  <!-- Cheerful Smile -->
  <path d="M 104 130 Q 120 144 136 130" stroke="#881337" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M 107 131 Q 120 142 133 131 Z" fill="#ffffff" />

  <!-- Boy Hair (Modern Short Haircut) -->
  <path d="M 68 95 C 64 65 85 36 120 36 C 152 36 176 58 174 95 C 166 84 156 80 146 84 C 136 88 126 80 114 80 C 100 80 88 88 78 84 C 72 88 70 91 68 95 Z" fill="url(#hairGrad)" />
  <path d="M 110 38 Q 125 30 142 38" stroke="#5d4037" stroke-width="3" stroke-linecap="round" fill="none" />
</svg>
`);

// 2. Illustrated Female Student Avatar (Chica con peinado y uniforme escolar)
export const ILLUSTRATED_FEMALE_AVATAR = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bgFemale" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#115e59" />
    </linearGradient>
    <linearGradient id="skinGradF" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffebd6" />
      <stop offset="100%" stop-color="#f8ceab" />
    </linearGradient>
    <linearGradient id="hairGradF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a2810" />
      <stop offset="100%" stop-color="#2d1607" />
    </linearGradient>
  </defs>
  <!-- Background Circle -->
  <circle cx="120" cy="120" r="120" fill="url(#bgFemale)" />
  <circle cx="120" cy="120" r="114" fill="none" stroke="#6ee7b7" stroke-width="4" stroke-opacity="0.3" />

  <!-- Long Hair Behind Shoulders -->
  <path d="M 64 100 C 58 140 54 185 64 210 C 72 230 80 240 85 240 L 155 240 C 160 240 168 230 176 210 C 186 185 182 140 176 100 Z" fill="url(#hairGradF)" />

  <!-- Shoulders & Uniform -->
  <path d="M 45 240 C 45 188 80 168 120 168 C 160 168 195 188 195 240 Z" fill="#047857" />
  <!-- White Blouse & Collar -->
  <path d="M 94 172 L 120 200 L 146 172 Z" fill="#f8fafc" />
  <!-- Uniform Bowtie (Corbatín escolar) -->
  <path d="M 112 188 L 128 188 L 120 195 Z" fill="#f43f5e" />
  <path d="M 110 190 L 105 204 L 115 198 Z" fill="#e11d48" />
  <path d="M 130 190 L 135 204 L 125 198 Z" fill="#e11d48" />
  <circle cx="120" cy="190" r="3.5" fill="#fb7185" />

  <!-- Neck -->
  <rect x="106" y="142" width="28" height="30" rx="6" fill="#f8ceab" />
  <path d="M 106 150 Q 120 162 134 150 Z" fill="#e7b58d" opacity="0.6" />

  <!-- Ears & Earrings -->
  <circle cx="68" cy="120" r="12" fill="#f8ceab" />
  <circle cx="68" cy="124" r="3" fill="#fcd34d" />
  <circle cx="172" cy="120" r="12" fill="#f8ceab" />
  <circle cx="172" cy="124" r="3" fill="#fcd34d" />

  <!-- Head Base -->
  <path d="M 74 110 C 74 70 94 54 120 54 C 146 54 166 70 166 110 C 166 145 145 160 120 160 C 95 160 74 145 74 110 Z" fill="url(#skinGradF)" />

  <!-- Eyes with Eyelashes -->
  <circle cx="98" cy="110" r="6.5" fill="#1e293b" />
  <circle cx="142" cy="110" r="6.5" fill="#1e293b" />
  <circle cx="96" cy="108" r="2.2" fill="#ffffff" />
  <circle cx="140" cy="108" r="2.2" fill="#ffffff" />
  <path d="M 92 104 L 88 100" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
  <path d="M 148 104 L 152 100" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />

  <!-- Eyebrows (delicate curve) -->
  <path d="M 90 98 Q 98 94 106 97" stroke="#3b1d09" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <path d="M 134 97 Q 142 94 150 98" stroke="#3b1d09" stroke-width="2.5" stroke-linecap="round" fill="none" />

  <!-- Nose -->
  <path d="M 118 116 Q 120 122 122 121" stroke="#d99961" stroke-width="2" stroke-linecap="round" fill="none" />

  <!-- Rosy Cheeks -->
  <ellipse cx="88" cy="122" rx="8" ry="5" fill="#fb7185" opacity="0.3" />
  <ellipse cx="152" cy="122" rx="8" ry="5" fill="#fb7185" opacity="0.3" />

  <!-- Friendly Smile -->
  <path d="M 106 132 Q 120 144 134 132" stroke="#be123c" stroke-width="2.8" stroke-linecap="round" fill="none" />
  <path d="M 108 133 Q 120 142 132 133 Z" fill="#ffffff" />

  <!-- Front Hair & Bangs -->
  <path d="M 68 96 C 68 60 90 38 120 38 C 150 38 172 60 172 96 C 164 78 152 74 138 76 C 124 78 114 74 98 74 C 84 74 74 84 68 96 Z" fill="url(#hairGradF)" />
  <!-- Hair Ribbon (Diadema / Lazo) -->
  <path d="M 70 78 Q 120 54 170 78" stroke="#10b981" stroke-width="6" stroke-linecap="round" fill="none" />
  <circle cx="158" cy="74" r="7" fill="#fbbf24" />
  <circle cx="158" cy="74" r="3" fill="#d97706" />
</svg>
`);

// 3. Illustrated Neutral Student Avatar (Estudiante ilustrado neutro con birrete / emblema)
export const ILLUSTRATED_NEUTRAL_AVATAR = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bgNeutral" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e" />
      <stop offset="50%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="skinGradN" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fed7aa" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <!-- Background Circle -->
  <circle cx="120" cy="120" r="120" fill="url(#bgNeutral)" />
  <circle cx="120" cy="120" r="114" fill="none" stroke="#38bdf8" stroke-width="4" stroke-opacity="0.3" />

  <!-- Shoulders & Scholar Robe / Uniform -->
  <path d="M 45 240 C 45 186 80 166 120 166 C 160 166 195 186 195 240 Z" fill="#0f766e" />
  <!-- Collar & Academic Ribbon -->
  <path d="M 94 170 L 120 200 L 146 170 Z" fill="#f8fafc" />
  <path d="M 112 170 L 120 195 L 128 170 Z" fill="#f59e0b" />
  
  <!-- Neck -->
  <rect x="105" y="142" width="30" height="28" rx="6" fill="#fdba74" />

  <!-- Head Base -->
  <circle cx="120" cy="115" r="44" fill="url(#skinGradN)" />

  <!-- Eyes -->
  <circle cx="102" cy="116" r="6" fill="#0f172a" />
  <circle cx="138" cy="116" r="6" fill="#0f172a" />
  <circle cx="100" cy="114" r="2" fill="#ffffff" />
  <circle cx="136" cy="114" r="2" fill="#ffffff" />

  <!-- Gentle Smile -->
  <path d="M 108 132 Q 120 142 132 132" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none" />

  <!-- Graduation Cap (Birrete Académico) -->
  <!-- Skull Cap under diamond -->
  <path d="M 88 88 C 88 68 152 68 152 88 Z" fill="url(#capGrad)" />
  <!-- Diamond Top -->
  <polygon points="120,44 195,68 120,92 45,68" fill="#1e293b" stroke="#334155" stroke-width="2" />
  <polygon points="120,47 186,68 120,89 54,68" fill="#0f172a" />
  
  <!-- Tassel (Borla de graduación en oro institucional) -->
  <circle cx="120" cy="68" r="4.5" fill="#f59e0b" />
  <path d="M 120 68 Q 155 76 160 98" stroke="#f59e0b" stroke-width="2.5" fill="none" />
  <rect x="156" y="98" width="8" height="15" rx="2" fill="#f59e0b" />
  <line x1="160" y1="113" x2="160" y2="117" stroke="#b45309" stroke-width="2" />
</svg>
`);

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
  gender: 'Masculino' | 'Femenino' | 'Neutro';
  isIllustrated?: boolean;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  // 1. Ilustrados Oficiales
  {
    id: 'illus-male',
    name: 'Ilustrado Chico (Uniforme Oficial)',
    url: ILLUSTRATED_MALE_AVATAR,
    gender: 'Masculino',
    isIllustrated: true
  },
  {
    id: 'illus-female',
    name: 'Ilustrada Chica (Uniforme Oficial)',
    url: ILLUSTRATED_FEMALE_AVATAR,
    gender: 'Femenino',
    isIllustrated: true
  },
  {
    id: 'illus-neutral',
    name: 'Ilustrado Neutro (Académico)',
    url: ILLUSTRATED_NEUTRAL_AVATAR,
    gender: 'Neutro',
    isIllustrated: true
  },

  // 2. Fotografías de Estudiantes Hombres / Niños
  {
    id: 'male-photo-1',
    name: 'Fotografía Chico 1',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino',
    isIllustrated: false
  },
  {
    id: 'male-photo-2',
    name: 'Fotografía Chico 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino',
    isIllustrated: false
  },
  {
    id: 'male-photo-3',
    name: 'Fotografía Chico 3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino',
    isIllustrated: false
  },

  // 3. Fotografías de Estudiantes Mujeres / Niñas
  {
    id: 'female-photo-1',
    name: 'Fotografía Chica 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino',
    isIllustrated: false
  },
  {
    id: 'female-photo-2',
    name: 'Fotografía Chica 2',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino',
    isIllustrated: false
  },
  {
    id: 'female-photo-3',
    name: 'Fotografía Chica 3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino',
    isIllustrated: false
  }
];

export function isMaleGender(gender?: string): boolean {
  if (!gender) return false;
  const g = gender.toLowerCase().trim();
  return g === 'masculino' || g === 'hombre' || g === 'm' || g === 'male' || g.startsWith('masc') || g === 'chico';
}

export function isFemaleGender(gender?: string): boolean {
  if (!gender) return false;
  const g = gender.toLowerCase().trim();
  return g === 'femenino' || g === 'mujer' || g === 'f' || g === 'female' || g.startsWith('fem') || g === 'chica';
}

/**
 * Returns the default illustrated avatar according to the student's registered gender:
 * - If male: ILLUSTRATED_MALE_AVATAR
 * - If female: ILLUSTRATED_FEMALE_AVATAR
 * - If no gender registered or other: ILLUSTRATED_NEUTRAL_AVATAR
 */
export function getDefaultAvatarByGender(gender?: string): string {
  if (isMaleGender(gender)) {
    return ILLUSTRATED_MALE_AVATAR;
  }
  if (isFemaleGender(gender)) {
    return ILLUSTRATED_FEMALE_AVATAR;
  }
  return ILLUSTRATED_NEUTRAL_AVATAR;
}

/**
 * Checks if a given avatar is one of the default illustrated avatars
 */
export function isDefaultIllustratedAvatar(avatarUrl?: string): boolean {
  if (!avatarUrl) return true;
  return (
    avatarUrl === ILLUSTRATED_MALE_AVATAR ||
    avatarUrl === ILLUSTRATED_FEMALE_AVATAR ||
    avatarUrl === ILLUSTRATED_NEUTRAL_AVATAR
  );
}

/**
 * Retrieves saved custom photo for a given user from localStorage
 */
export function getSavedCustomPhoto(userId?: string, email?: string): string | null {
  if (!userId && !email) return null;
  if (userId) {
    const photoById = localStorage.getItem(`edumed_custom_photo_${userId}`);
    if (photoById) return photoById;
  }
  if (email) {
    const photoByEmail = localStorage.getItem(`edumed_custom_photo_${email.toLowerCase().trim()}`);
    if (photoByEmail) return photoByEmail;
  }
  return null;
}

/**
 * Saves a custom photo associated specifically with the user
 */
export function saveCustomPhoto(userId: string, photoDataUrl: string, email?: string): void {
  if (!userId) return;
  localStorage.setItem(`edumed_custom_photo_${userId}`, photoDataUrl);
  localStorage.setItem(`edumed_user_avatar_${userId}`, photoDataUrl);
  if (email) {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.setItem(`edumed_custom_photo_${cleanEmail}`, photoDataUrl);
    localStorage.setItem(`edumed_user_avatar_${cleanEmail}`, photoDataUrl);
  }
}

/**
 * Removes custom photo associated with the user, returning them to the default avatar
 */
export function removeCustomPhoto(userId: string, email?: string): void {
  if (!userId) return;
  localStorage.removeItem(`edumed_custom_photo_${userId}`);
  localStorage.removeItem(`edumed_user_avatar_${userId}`);
  if (email) {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.removeItem(`edumed_custom_photo_${cleanEmail}`);
    localStorage.removeItem(`edumed_user_avatar_${cleanEmail}`);
  }
}

/**
 * Resolves the effective avatar for a student:
 * 1. If user has a saved custom photo -> return custom photo
 * 2. If user.avatarUrl exists and is not an illustrated default -> return it
 * 3. Otherwise -> return default avatar based on registered gender
 */
export function resolveStudentAvatar(user?: { id?: string; email?: string; gender?: string; avatarUrl?: string } | null): string {
  if (!user) return ILLUSTRATED_NEUTRAL_AVATAR;

  // 1. Check custom photo in localStorage for this specific user
  const saved = getSavedCustomPhoto(user.id, user.email);
  if (saved) return saved;

  // 2. If avatarUrl is explicitly set and is not a default SVG, use it
  if (user.avatarUrl && !isDefaultIllustratedAvatar(user.avatarUrl)) {
    return user.avatarUrl;
  }

  // 3. Dynamic default according to registered gender
  return getDefaultAvatarByGender(user.gender);
}
