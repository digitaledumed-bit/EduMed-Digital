// Avatar utilities for student gender-based avatars and photo customization

export const DEFAULT_MALE_AVATAR = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80';
export const DEFAULT_FEMALE_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
  gender: 'Masculino' | 'Femenino' | 'Neutro';
}

export const PRESET_AVATARS: PresetAvatar[] = [
  // Hombres / Niños
  {
    id: 'male-1',
    name: 'Estudiante 1 (Chico)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino'
  },
  {
    id: 'male-2',
    name: 'Estudiante 2 (Chico)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino'
  },
  {
    id: 'male-3',
    name: 'Estudiante 3 (Chico)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino'
  },
  {
    id: 'male-4',
    name: 'Estudiante 4 (Chico)',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    gender: 'Masculino'
  },

  // Mujeres / Niñas
  {
    id: 'female-1',
    name: 'Estudiante 1 (Chica)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino'
  },
  {
    id: 'female-2',
    name: 'Estudiante 2 (Chica)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino'
  },
  {
    id: 'female-3',
    name: 'Estudiante 3 (Chica)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino'
  },
  {
    id: 'female-4',
    name: 'Estudiante 4 (Chica)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    gender: 'Femenino'
  }
];

export function isMaleGender(gender?: string): boolean {
  if (!gender) return false;
  const g = gender.toLowerCase().trim();
  return g === 'masculino' || g === 'hombre' || g === 'm' || g === 'male';
}

export function isFemaleGender(gender?: string): boolean {
  if (!gender) return false;
  const g = gender.toLowerCase().trim();
  return g === 'femenino' || g === 'mujer' || g === 'f' || g === 'female';
}

export function getDefaultAvatarByGender(gender?: string): string {
  if (isMaleGender(gender)) {
    return DEFAULT_MALE_AVATAR;
  }
  return DEFAULT_FEMALE_AVATAR;
}
