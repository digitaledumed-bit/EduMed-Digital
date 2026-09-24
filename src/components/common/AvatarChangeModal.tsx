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
  Eye,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { 
  PRESET_AVATARS, 
  getDefaultAvatarByGender, 
  isMaleGender, 
  isFemaleGender,
  isDefaultIllustratedAvatar,
  getSavedCustomPhoto
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
  studentGender,
  currentAvatarUrl,
  onAvatarUpdated
}) => {
  const { currentUser, updateUserAvatar, restoreDefaultAvatar, language } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Determine current gender from studentGender or currentUser
  const effectiveGender = studentGender || currentUser?.gender;
  const defaultIllustratedAvatar = getDefaultAvatarByGender(effectiveGender);

  // States
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatarUrl || defaultIllustratedAvatar
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Check if student currently has a custom photo
  const hasCustomPhoto = Boolean(
    currentUser?.id && getSavedCustomPhoto(currentUser.id, currentUser.email)
  ) || (!isDefaultIllustratedAvatar(currentAvatarUrl) && Boolean(currentAvatarUrl));

  // Sync state whenever opened
  useEffect(() => {
    if (isOpen) {
      const active = currentAvatarUrl || currentUser?.avatarUrl || defaultIllustratedAvatar;
      setSelectedAvatar(active);
      setPreviewImage(null);
      setSelectedFileName(null);
      setSelectedFileSize(null);
      setCustomUrlInput('');
      setFeedback(null);
      setIsSuccess(false);
      setActiveTab('upload');
    }
  }, [isOpen, currentAvatarUrl, currentUser, defaultIllustratedAvatar]);

  if (!isOpen) return null;

  // Process File Object into Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFeedback(
        language === 'es'
          ? 'Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, GIF).'
          : 'Please select a valid image file (JPG, PNG, WEBP, GIF).'
      );
      return;
    }

    // Up to 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setFeedback(
        language === 'es'
          ? 'La imagen seleccionada supera el límite de 10MB.'
          : 'Selected image exceeds 10MB limit.'
      );
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setSelectedFileName(file.name);
    setSelectedFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewImage(result);
        setSelectedAvatar(result);
        setFeedback(
          language === 'es'
            ? '✓ Vista previa lista. Haz clic en "Confirmar y Guardar Foto" para aplicarla en tu cuenta.'
            : '✓ Live preview ready. Click "Confirm & Save Photo" to apply to your account.'
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // 1. Handle File Selection from Device (Camera or File Explorer)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and Drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // 2. Confirm and Save Photo
  const handleConfirmPhoto = () => {
    if (!selectedAvatar) return;

    // Persist and update student avatar
    updateUserAvatar(selectedAvatar);

    if (onAvatarUpdated) {
      onAvatarUpdated(selectedAvatar);
    }

    setIsSuccess(true);
    setFeedback(
      language === 'es'
        ? '¡Fotografía guardada con éxito en tu cuenta de estudiante!'
        : 'Profile photo saved successfully to your student account!'
    );

    setTimeout(() => {
      onClose();
    }, 700);
  };

  // 3. Cancel Selection
  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);
    onClose();
  };

  // 4. Restore Default Illustrated Avatar
  const handleRestoreDefault = () => {
    // Call context method to remove custom photo from persistent storage
    restoreDefaultAvatar();

    const restored = getDefaultAvatarByGender(effectiveGender);
    setSelectedAvatar(restored);
    setPreviewImage(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);

    if (onAvatarUpdated) {
      onAvatarUpdated(restored);
    }

    setIsSuccess(true);
    const genderLabel = isMaleGender(effectiveGender) 
      ? (language === 'es' ? 'masculino (Chico)' : 'male (Boy)') 
      : isFemaleGender(effectiveGender) 
      ? (language === 'es' ? 'femenino (Chica)' : 'female (Girl)') 
      : (language === 'es' ? 'neutro / no especificado (Académico)' : 'neutral / unspecified');

    setFeedback(
      language === 'es'
        ? `✓ Fotografía personalizada eliminada. Se ha restaurado el avatar predeterminado según el sexo registrado: ${genderLabel}.`
        : `✓ Custom photo removed. Restored default illustrated avatar for registered sex: ${genderLabel}.`
    );

    setTimeout(() => {
      onClose();
    }, 850);
  };

  const isMale = isMaleGender(effectiveGender);
  const isFemale = isFemaleGender(effectiveGender);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-2xl overflow-hidden relative text-slate-900 dark:text-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'es' ? 'Cambiar Foto de Perfil' : 'Change Profile Photo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es'
                  ? 'Personaliza tu avatar estudiantil con una foto de tu celular o computador'
                  : 'Customize your student avatar with a photo from your phone or computer'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 py-1 space-y-4">

          {/* Student Profile Card with Live Avatar Preview */}
          <div className="my-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-blue-500/10 dark:from-teal-950/40 dark:via-slate-800/40 dark:to-blue-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-center gap-5">
            
            {/* Avatar Frame with Live Preview Indicator */}
            <div className="relative group shrink-0">
              <img
                src={selectedAvatar}
                alt={studentName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500 dark:ring-teal-400 shadow-xl bg-slate-200 dark:bg-slate-800 transition-all"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultIllustratedAvatar;
                }}
              />
              
              {previewImage && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-pulse">
                  <Eye className="w-3 h-3" />
                  {language === 'es' ? 'Vista previa' : 'Preview'}
                </span>
              )}

              {/* Registered Sex Badge */}
              <div className="absolute -bottom-2 -left-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-md border border-slate-700">
                {isMale ? '♂ Chico' : isFemale ? '♀ Chica' : '🎓 Neutro'}
              </div>
            </div>

            {/* Student Info & Status */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[10px] font-black uppercase tracking-wider">
                  <User className="w-3 h-3" />
                  {language === 'es' ? 'Estudiante' : 'Student'}
                </span>
                
                {previewImage ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                    {language === 'es' ? 'Nueva foto seleccionada (sin guardar)' : 'New photo selected'}
                  </span>
                ) : hasCustomPhoto ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                    📷 {language === 'es' ? 'Foto personalizada activa' : 'Custom photo active'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    🎨 {language === 'es' ? 'Avatar predeterminado oficial' : 'Default avatar'}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight truncate">
                {studentName}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Sexo registrado:' : 'Registered gender:'}{' '}
                <strong className="text-slate-800 dark:text-slate-200 font-bold">
                  {isMale ? 'Masculino' : isFemale ? 'Femenino' : 'No especificado (Neutro)'}
                </strong>
              </p>

              {/* Quick Restore Default Action */}
              <div className="mt-2 flex items-center justify-center sm:justify-start">
                <button
                  type="button"
                  id="modal-restore-default-link"
                  onClick={handleRestoreDefault}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white hover:underline cursor-pointer"
                  title="Elimina la foto personalizada y restaura el avatar correspondiente al sexo registrado"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Restaurar avatar predeterminado' : 'Restore default avatar'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Feedback message banner */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
              isSuccess 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold' 
                : 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 font-medium'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-teal-600" />}
              <span className="flex-1">{feedback}</span>
            </div>
          )}

          {/* Source Tabs: Subir del Dispositivo (Primary) / Galería / Enlace */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
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
              <span>{language === 'es' ? 'Desde mi Dispositivo' : 'From Device'}</span>
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
              <span>{language === 'es' ? 'Galería Oficial' : 'Official Gallery'}</span>
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
              <span>{language === 'es' ? 'Enlace Web' : 'Web URL'}</span>
            </button>
          </div>

          {/* TAB 1: UPLOAD FROM DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Hidden native input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {previewImage ? (
                /* Selected Image Preview State with Change & Discard Options */
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-300 dark:border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={previewImage} 
                      alt="Vista previa" 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md bg-white shrink-0" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[200px]">
                        {selectedFileName || (language === 'es' ? 'Imagen seleccionada' : 'Selected image')}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedFileSize || 'Formato compatible'} • {language === 'es' ? 'Listo para guardar' : 'Ready to save'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl border border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Cambiar otra' : 'Change photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFileName(null);
                        setSelectedFileSize(null);
                        setSelectedAvatar(currentAvatarUrl || defaultIllustratedAvatar);
                        setFeedback(null);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={language === 'es' ? 'Descartar selección' : 'Discard selection'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Dropzone */
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all group ${
                    isDragging 
                      ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/50 scale-[1.01]' 
                      : 'border-teal-500/60 hover:border-teal-600 dark:border-teal-500/40 hover:bg-teal-50/40 dark:hover:bg-teal-950/20'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                    {language === 'es' 
                      ? 'Seleccionar una imagen desde tu dispositivo' 
                      : 'Select an image from your device'}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {language === 'es'
                      ? 'Haz clic para explorar tus archivos o arrastra una fotografía aquí. Puedes tomarte una foto con la cámara del celular o seleccionar de tu galería.'
                      : 'Click to browse files or drag and drop. Works with your phone camera or desktop files.'}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Explorar en el dispositivo' : 'Browse on device'}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    JPG, PNG, WEBP o GIF • Hasta 10MB
                  </p>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'es'
                    ? 'La fotografía seleccionada queda vinculada de forma exclusiva a tu cuenta de estudiante y permanecerá guardada cuando cierres sesión y vuelvas a ingresar.'
                    : 'The photo is saved exclusively to your account and remains saved across login sessions.'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL GALLERY & ILLUSTRATIONS */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>{language === 'es' ? 'Avatares ilustrados oficiales y fotografías sugeridas:' : 'Official avatars and presets:'}</span>
                <button
                  type="button"
                  onClick={handleRestoreDefault}
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'es' ? 'Restaurar por sexo' : 'Reset by gender'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset.url);
                        setPreviewImage(null);
                        setSelectedFileName(preset.name);
                        setFeedback(
                          language === 'es'
                            ? `Seleccionado "${preset.name}". Haz clic en "Confirmar y Guardar Foto" para aplicarlo.`
                            : `Selected "${preset.name}". Click "Confirm & Save Photo".`
                        );
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

          {/* TAB 3: WEB URL */}
          {activeTab === 'url' && (
            <div className="space-y-3 py-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'es' ? 'Pega el enlace web de la imagen:' : 'Paste image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setSelectedAvatar(customUrlInput.trim());
                      setPreviewImage(customUrlInput.trim());
                      setSelectedFileName('Foto desde enlace web');
                      setFeedback(language === 'es' ? 'Imagen cargada desde enlace. Haz clic en "Confirmar y Guardar Foto".' : 'URL image loaded.');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Cargar' : 'Load'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer: Action Buttons (Cancel / Confirm / Restore default) */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Button "Restaurar avatar predeterminado" */}
          <button
            type="button"
            id="btn-restore-default-avatar"
            onClick={handleRestoreDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            title="Elimina la fotografía personalizada y vuelve al avatar según el sexo registrado"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{language === 'es' ? 'Restaurar avatar predeterminado' : 'Restore default avatar'}</span>
          </button>

          {/* Cancel and Confirm buttons */}
          <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancel-avatar-modal"
              onClick={handleCancel}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="button"
              id="btn-confirm-avatar-photo"
              onClick={handleConfirmPhoto}
              disabled={isSuccess}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-black shadow-md shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'es' ? 'Confirmar y Guardar Foto' : 'Confirm & Save'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
