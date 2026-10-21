import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Upload, 
  ExternalLink,
  School,
  Calendar,
  Check
} from 'lucide-react';
import { DocumentStatus } from '../../types';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  file?: File | null;
  uploadDate?: string;
  status?: DocumentStatus | 'uploading' | 'preview';
  studentName?: string;
  studentGrade?: string;
  studentDoc?: string;
  isUploadingPreview?: boolean;
  onConfirmUpload?: () => void;
  onCancelUpload?: () => void;
  confirmBtnText?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentName,
  fileName,
  fileSize,
  fileUrl,
  file,
  uploadDate,
  status = 'preview',
  studentName,
  studentGrade,
  studentDoc,
  isUploadingPreview = false,
  onConfirmUpload,
  onCancelUpload,
  confirmBtnText = 'Confirmar y Subir Archivo'
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (fileUrl && fileUrl !== '#') {
      setObjectUrl(fileUrl);
    } else {
      setObjectUrl(null);
    }
  }, [file, fileUrl]);

  // Reset zoom & rotation when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setIsFullscreen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine file type
  const lowerName = (fileName || '').toLowerCase();
  const fileMime = file?.type || '';
  const isImage = 
    fileMime.startsWith('image/') || 
    lowerName.endsWith('.jpg') || 
    lowerName.endsWith('.jpeg') || 
    lowerName.endsWith('.png') || 
    lowerName.endsWith('.webp') || 
    lowerName.endsWith('.gif');

  const isPdf = 
    fileMime === 'application/pdf' || 
    lowerName.endsWith('.pdf');

  const effectiveSize = fileSize || (file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '1.20 MB');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen 
            ? 'w-screen h-screen fixed inset-0 rounded-none' 
            : 'w-full max-w-4xl max-h-[92vh] h-[85vh]'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isUploadingPreview 
                ? 'bg-amber-500 text-white' 
                : 'bg-teal-700 text-white'
            }`}>
              <FileText className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  {documentName || 'Vista Previa del Documento'}
                </h3>
                {isUploadingPreview && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0">
                    En proceso de subida
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                  {fileName}
                </span>
                <span>•</span>
                <span>{effectiveSize}</span>
                {studentName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{studentName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isImage && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-1.5 text-slate-700 dark:text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  title="Girar 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {objectUrl && (
              <a
                href={objectUrl}
                download={fileName}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-colors"
                title="Abrir / Descargar"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Body */}
        <div className="flex-1 overflow-auto bg-slate-100/70 dark:bg-slate-950/80 p-4 sm:p-6 flex items-center justify-center relative">
          
          {/* IMAGE PREVIEW */}
          {isImage && objectUrl ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={objectUrl}
                alt={documentName}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          ) : isPdf && objectUrl ? (
            /* PDF PREVIEW WITH IFRAME */
            <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
              <iframe
                src={objectUrl}
                title={documentName}
                className="w-full flex-1 border-0"
              />
            </div>
          ) : (
            /* RICH SIMULATED DOCUMENT PREVIEW FOR DOCUMENTS OR MOCKS */
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
              
              {/* Document Header */}
              <div className="flex items-center justify-between border-b-2 border-teal-600 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-lg shadow-md">
                    FH
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base">
                      Institución Educativa Félix Henao Botero
                    </h4>
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                      Secretaría Académica • Soporte Oficial Digital de Matrícula
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    SIMAT 2026
                  </span>
                </div>
              </div>

              {/* Document Metadata Sheet */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tipo de Soporte:
                  </span>
                  <span className="text-xs font-black text-teal-800 dark:text-teal-300">
                    {documentName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre del Archivo:
                  </span>
                  <span className="font-mono text-xs text-slate-900 dark:text-white font-semibold">
                    {fileName}
                  </span>
                </div>

                {studentName && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Estudiante Titular:
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {studentName} {studentDoc ? `(${studentDoc})` : ''}
                    </span>
                  </div>
                )}

                {studentGrade && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Grado / Jornada:
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {studentGrade}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tamaño y Formato:
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {effectiveSize} • {isPdf ? 'Formato PDF Oficial' : isImage ? 'Imagen Digitalizada' : 'Documento Adjunto'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fecha de Registro:
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {uploadDate || new Date().toLocaleDateString('es-CO')}
                  </span>
                </div>
              </div>

              {/* Watermark & Security Notice */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                  <strong>Validación de Integridad:</strong> Este archivo ha sido precargado y está listo para ser auditado por el equipo de admisiones de la I.E. Félix Henao Botero.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer with actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Documento listo para verificación en el expediente del estudiante.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isUploadingPreview && onCancelUpload ? (
              <button
                type="button"
                onClick={onCancelUpload}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar Carga
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar
              </button>
            )}

            {isUploadingPreview && onConfirmUpload && (
              <button
                type="button"
                onClick={onConfirmUpload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <Check className="w-4 h-4" />
                <span>{confirmBtnText}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
