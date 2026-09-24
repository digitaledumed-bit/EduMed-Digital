import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Link as LinkIcon, 
  User, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  PRESET_AVATARS, 
  getDefaultAvatarByGender, 
  isMaleGender, 
  isFemaleGender 
} from '../../utils/avatarUtils';

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentGender?: string;
  currentAvatarUrl?: string;
  onAvatarUpdated?: (newUrl: string) => void;
}

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentGender = 'Masculino',
  currentAvatarUrl,
  onAvatarUpdated
}) => {
  const { updateUserAvatar, language } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultAvatar = getDefaultAvatarByGender(studentGender);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatarUrl || defaultAvatar
  );
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('gallery');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync with current avatar on open
  React.useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatarUrl || defaultAvatar);
      setFeedback(null);
      setIsSuccess(false);
    }
  }, [isOpen, currentAvatarUrl, defaultAvatar]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback(language === 'es' ? 'Por favor seleccione un archivo de imagen válido (JPG, PNG, WEBP).' : 'Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback(language === 'es' ? 'La imagen no debe superar los 5MB.' : 'Image must not exceed 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedAvatar(result);
        setFeedback(language === 'es' ? 'Foto cargada desde tu dispositivo. Haz clic en "Guardar Foto".' : 'Photo loaded. Click "Save Photo".');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) {
      setFeedback(language === 'es' ? 'Ingrese un enlace de imagen válido.' : 'Enter a valid image URL.');
      return;
    }
    setSelectedAvatar(customUrlInput.trim());
    setFeedback(language === 'es' ? 'Enlace de foto cargado. Haz clic en "Guardar Foto".' : 'URL photo loaded. Click "Save Photo".');
  };

  const handleSave = () => {
    if (!selectedAvatar) return;
    updateUserAvatar(selectedAvatar);
    if (onAvatarUpdated) {
      onAvatarUpdated(selectedAvatar);
    }
    setIsSuccess(true);
    setFeedback(language === 'es' ? '¡Foto de perfil actualizada con éxito!' : 'Profile photo updated successfully!');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleResetDefault = () => {
    setSelectedAvatar(defaultAvatar);
    setFeedback(
      language === 'es' 
        ? `Se ha restablecido el avatar por defecto según tu sexo (${isMaleGender(studentGender) ? 'Hombre' : 'Mujer'}).`
        : `Default avatar restored according to gender (${isMaleGender(studentGender) ? 'Male' : 'Female'}).`
    );
  };

  const isMale = isMaleGender(studentGender);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden relative text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {language === 'es' ? 'Cambiar Foto de Avatar' : 'Change Avatar Photo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es' 
                  ? 'Elige una foto de la galería, sube una desde tu dispositivo o pega un enlace.' 
                  : 'Choose a photo from gallery, upload from your device or paste a URL.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Avatar with Name Overlay / Badge */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-blue-500/10 dark:from-teal-950/30 dark:via-slate-800/40 dark:to-blue-950/30 border border-teal-500/20 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <img
              src={selectedAvatar}
              alt={studentName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-teal-500 dark:ring-teal-400 shadow-md bg-slate-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultAvatar;
              }}
            />
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
              {isMale ? 'Hombre' : 'Mujer'}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
              {language === 'es' ? 'Avatar del Estudiante' : 'Student Avatar'}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {studentName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium">
                <User className="w-3.5 h-3.5 text-teal-600" />
                {language === 'es' 
                  ? (isMale ? 'Sexo: Masculino (Hombre)' : 'Sexo: Femenino (Mujer)')
                  : (isMale ? 'Gender: Male' : 'Gender: Female')}
              </span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">
                I.E. Félix Henao Botero
              </span>
            </div>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            isSuccess 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold' 
              : 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200'
          }`}>
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-teal-600" />}
            <span>{feedback}</span>
          </div>
        )}

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Galería' : 'Gallery'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Subir Foto' : 'Upload'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Enlace URL' : 'URL Link'}</span>
          </button>
        </div>

        {/* TAB CONTENT: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>{language === 'es' ? 'Selecciona una foto sugerida para tu perfil:' : 'Select a suggested photo:'}</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'es' ? 'Restablecer por sexo' : 'Reset by gender'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-h-48 overflow-y-auto p-1">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 cursor-pointer group ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500/40 scale-95 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/60 text-white text-[9px] font-bold">
                      {preset.gender === 'Masculino' ? '♂ Chico' : '♀ Chica'}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-teal-600/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB CONTENT: UPLOAD FROM DEVICE */}
        {activeTab === 'upload' && (
          <div className="space-y-4 py-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-500/50 hover:border-teal-600 dark:border-teal-500/30 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {language === 'es' ? 'Haz clic para seleccionar una foto de tu dispositivo' : 'Click to select a photo from your device'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Formatos: JPG, PNG, WEBP • Máximo 5MB
              </p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: URL LINK */}
        {activeTab === 'url' && (
          <div className="space-y-3 py-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Pega el enlace web de la foto que deseas utilizar:' : 'Paste the image link:'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'es' ? 'Cargar' : 'Load'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSuccess}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'es' ? 'Guardar Foto de Avatar' : 'Save Avatar Photo'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
