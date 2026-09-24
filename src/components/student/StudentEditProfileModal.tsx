import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  AlertCircle, 
  Save, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';

interface StudentEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export const StudentEditProfileModal: React.FC<StudentEditProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const { currentUser, updateStudentProfile, language } = useApp();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [gender, setGender] = useState<'Masculino' | 'Femenino' | 'Neutro'>(
    (currentUser?.gender as any) || 'Masculino'
  );
  const [address, setAddress] = useState('Calle 50 # 40-20');
  const [neighborhood, setNeighborhood] = useState('Boston');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setGender((currentUser.gender as any) || 'Masculino');
      setFeedback(null);
      setIsSuccess(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setFeedback(language === 'es' ? 'Por favor ingrese un nombre completo válido.' : 'Please enter a valid full name.');
      return;
    }

    if (updateStudentProfile) {
      updateStudentProfile({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gender: gender,
        address: address.trim(),
        neighborhood: neighborhood.trim()
      });
    }

    setIsSuccess(true);
    setFeedback(language === 'es' ? '¡Perfil actualizado con éxito!' : 'Profile updated successfully!');
    if (onProfileUpdated) onProfileUpdated();

    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden relative text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Editar Perfil del Estudiante' : 'Edit Student Profile'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es' ? 'Actualiza tu información personal y datos de contacto' : 'Update your personal and contact details'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className={`my-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            isSuccess 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold' 
              : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}>
            {isSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'es' ? 'Nombre Completo del Estudiante:' : 'Full Student Name:'}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              placeholder="Ej: Juan David Pérez"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'es' ? 'Sexo del Estudiante (Asigna tu avatar ilustrado inicial):' : 'Student Gender:'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Masculino">♂ {language === 'es' ? 'Masculino (Avatar ilustrado de hombre)' : 'Male (Illustrated boy avatar)'}</option>
              <option value="Femenino">♀ {language === 'es' ? 'Femenino (Avatar ilustrada de mujer)' : 'Female (Illustrated girl avatar)'}</option>
              <option value="Neutro">🎓 {language === 'es' ? 'No especificado / Neutro (Avatar ilustrado académico)' : 'Neutral / Unspecified'}</option>
            </select>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'es' ? 'Teléfono de Contacto:' : 'Phone Number:'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                placeholder="315 987 6543"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'es' ? 'Correo Electrónico:' : 'Email Address:'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                placeholder="estudiante@edumed.edu.co"
              />
            </div>
          </div>

          {/* Address & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'es' ? 'Dirección de Residencia:' : 'Home Address:'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                placeholder="Calle 50 # 40-20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'es' ? 'Barrio / Comuna:' : 'Neighborhood:'}
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                placeholder="Boston, Laureles..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSuccess}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'es' ? 'Guardar Cambios' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
