import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2,
  Camera,
  Eye
} from 'lucide-react';
import { 
  PRESET_AVATARS, 
  getDefaultAvatarByGender, 
  isMaleGender, 
  isFemaleGender,
  ILLUSTRATED_MALE_AVATAR,
  ILLUSTRATED_FEMALE_AVATAR,
  ILLUSTRATED_NEUTRAL_AVATAR
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

  const defaultIllustratedAvatar = getDefaultAvatarByGender(studentGender);

  // States
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatarUrl || defaultIllustratedAvatar
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync with current avatar whenever opened
  useEffect(() => {
    if (isOpen) {
      const active = currentAvatarUrl || defaultIllustratedAvatar;
      setSelectedAvatar(active);
      setPreviewImage(null);
      setFeedback(null);
      setIsSuccess(false);
    }
  }, [isOpen, currentAvatarUrl, defaultIllustratedAvatar]);

  if (!isOpen) return null;

  // 1. Handle File Upload from Device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback(
        language === 'es'
          ? 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).'
          : 'Please select a valid image file (JPG, PNG, WEBP).'
      );
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFeedback(
        language === 'es'
          ? 'La imagen no debe superar los 8MB.'
          : 'Image size must be under 8MB.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewImage(result);
        setSelectedAvatar(result);
        setFeedback(
          language === 'es'
            ? '✓ Fotografía cargada desde tu dispositivo. Revisa la vista previa y haz clic en "Confirmar Nueva Foto".'
            : '✓ Photo loaded. Click "Confirm New Photo" to save.'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Confirm and Save Photo
  const handleConfirmPhoto = () => {
    if (!selectedAvatar) return;
    updateUserAvatar(selectedAvatar);
    if (onAvatarUpdated) {
      onAvatarUpdated(selectedAvatar);
    }
    setIsSuccess(true);
    setFeedback(
      language === 'es'
        ? '¡Foto de perfil confirmada y guardada con éxito en tu cuenta!'
        : 'Profile photo confirmed and saved!'
    );
    setTimeout(() => {
      onClose();
    }, 850);
  };

  // 3. Restore Default Illustrated Avatar
  const handleRestoreDefault = () => {
    const restored = getDefaultAvatarByGender(studentGender);
    setSelectedAvatar(restored);
    setPreviewImage(null);
    updateUserAvatar(restored);
    if (onAvatarUpdated) {
      onAvatarUpdated(restored);
    }
    setIsSuccess(true);
    const genderLabel = isMaleGender(studentGender) 
      ? 'masculino (Chico)' 
      : isFemaleGender(studentGender) 
      ? 'femenino (Chica)' 
      : 'neutro (Académico)';
    setFeedback(
      language === 'es'
        ? `✓ Se ha restaurado el avatar ilustrado predeterminado según tu sexo registrado (${genderLabel}).`
        : `✓ Restored default illustrated avatar for your registered gender.`
    );
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const isMale = isMaleGender(studentGender);
  const isFemale = isFemaleGender(studentGender);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden relative text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Cambiar Foto de Perfil' : 'Change Profile Photo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es'
                  ? 'Sube una fotografía desde tu dispositivo o restaura el avatar ilustrado oficial'
                  : 'Upload a picture from your device or restore the illustrated avatar'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Student Profile Card Header (Exact user specification) */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-blue-500/10 dark:from-teal-950/40 dark:via-slate-800/40 dark:to-blue-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar with live preview indicator */}
          <div className="relative group shrink-0">
            <img
              src={selectedAvatar}
              alt={studentName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500 dark:ring-teal-400 shadow-lg bg-slate-200 dark:bg-slate-800 transition-all"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultIllustratedAvatar;
              }}
            />
            {previewImage && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-pulse">
                <Eye className="w-3 h-3" />
                Vista previa
              </span>
            )}
            <div className="absolute -bottom-2 -left-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-md border border-slate-700">
              {isMale ? '♂ Chico' : isFemale ? '♀ Chica' : '🎓 Estudiante'}
            </div>
          </div>

          {/* Real Account Name & Estudiante Badge */}
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <User className="w-3 h-3" />
              Estudiante
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {studentName}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sexo registrado: <strong className="text-slate-800 dark:text-slate-200">{studentGender || 'No especificado'}</strong> • I.E. Félix Henao Botero
            </p>

            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Restaurar avatar predeterminado' : 'Restore default avatar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div className={`mb-4 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
            isSuccess 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold' 
              : 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 font-medium'
          }`}>
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-teal-600" />}
            <span className="flex-1">{feedback}</span>
          </div>
        )}

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Subir del Dispositivo' : 'Upload Device'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Galería Ilustrada' : 'Gallery'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Enlace Web' : 'Web Link'}</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD FROM DEVICE */}
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
              className="border-2 border-dashed border-teal-500/60 hover:border-teal-600 dark:border-teal-500/40 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 rounded-3xl p-6 sm:p-7 text-center cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                {language === 'es' ? 'Haz clic para seleccionar una foto de tu dispositivo' : 'Click to select a photo from your device'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Formatos compatibles: JPG, PNG, WEBP • Hasta 8MB
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Explorar Archivos' : 'Browse Files'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GALLERY & ILLUSTRATIONS */}
        {activeTab === 'gallery' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>{language === 'es' ? 'Selecciona un avatar oficial o fotografía:' : 'Select an avatar:'}</span>
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'es' ? 'Restaurar por sexo' : 'Reset by gender'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-52 overflow-y-auto p-1">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(preset.url);
                      setPreviewImage(null);
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-0.5 cursor-pointer group ${
                      isSelected
                        ? 'border-teal-600 ring-4 ring-teal-500/30 scale-95 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                      {preset.isIllustrated ? '🎨 Ilustrado' : preset.gender === 'Masculino' ? '♂ Chico' : '♀ Chica'}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-teal-600/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: URL LINK */}
        {activeTab === 'url' && (
          <div className="space-y-3 py-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Pega el enlace web de la foto que deseas utilizar:' : 'Paste image URL:'}
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
                onClick={() => {
                  if (customUrlInput.trim()) {
                    setSelectedAvatar(customUrlInput.trim());
                    setPreviewImage(customUrlInput.trim());
                    setFeedback(language === 'es' ? 'Foto de enlace cargada. Haz clic en "Confirmar Nueva Foto".' : 'URL photo loaded.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'es' ? 'Cargar' : 'Load'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Restaurar avatar predeterminado' : 'Restore default avatar'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirmPhoto}
              disabled={isSuccess}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-black shadow-md shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'es' ? 'Confirmar Nueva Foto' : 'Confirm New Photo'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
