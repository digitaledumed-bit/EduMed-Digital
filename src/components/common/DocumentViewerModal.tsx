import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Calendar, 
  User, 
  Check, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  FileCheck
} from 'lucide-react';
import { StudentDocument } from '../../types';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: StudentDocument | null;
  isAdmin?: boolean;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string, reason: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  isAdmin = false,
  onApprove,
  onReject
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Reset zoom and rotation when document changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100);
      setRotation(0);
      setShowRejectInput(false);
      setCustomRejectReason('');
      setActionFeedback(null);
    }
  }, [isOpen, document?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const isImage = 
    document.fileType?.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(document.fileName) ||
    document.fileData?.startsWith('data:image/');

  const isPdf = 
    document.fileType === 'application/pdf' ||
    /\.pdf$/i.test(document.fileName) ||
    document.fileData?.startsWith('data:application/pdf');

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (document.fileData && document.fileData.startsWith('data:')) {
      const link = window.document.createElement('a');
      link.href = document.fileData;
      link.download = document.fileName || 'documento.pdf';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      // Generate synthetic institutional download file
      const content = `========================================================\nINSTITUCIÓN EDUCATIVA FÉLIX HENAO BOTERO\nDOCUMENTO OFICIAL RADICADO EN SISTEMA EDUMED\n========================================================\nNombre Documento: ${document.name}\nArchivo: ${document.fileName}\nTamaño: ${document.fileSize}\nFecha de Carga: ${document.uploadDate}\nSubido Por: ${document.uploadedBy || 'Estudiante / Acudiente'}\nEstado: ${document.status.toUpperCase()}\nCódigo de Verificación: MED-EDUMED-${document.id.toUpperCase()}\n========================================================\nDocumento verificado conforme a la Resolución Municipal de Matrículas.\nMedellín, Colombia.`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.fileName || `${document.name.replace(/\s+/g, '_')}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApproveClick = () => {
    if (onApprove) {
      onApprove(document.id);
      setActionFeedback('✓ Documento aprobado exitosamente');
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleConfirmReject = () => {
    if (onReject) {
      const reason = customRejectReason.trim() || 'El documento no cumple con los criterios de legibilidad o vigencia requeridos.';
      onReject(document.id, reason);
      setShowRejectInput(false);
      setActionFeedback('✓ Documento marcado como rechazado con motivo notificado');
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isImage 
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' 
                : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  {document.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                  document.status === 'approved'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : document.status === 'rejected'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}>
                  {document.status === 'approved' ? 'Aprobado' : document.status === 'rejected' ? 'Rechazado' : 'En Revisión'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                {document.fileName}
              </p>
            </div>
          </div>

          {/* Quick Toolbar Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom Controls (for image and preview) */}
            <div className="hidden sm:flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
                title="Alejar (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
                title="Restablecer tamaño normal (100%)"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 250}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
                title="Acercar (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors border-l border-slate-200 dark:border-slate-700 ml-0.5"
                title="Girar 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Descargar archivo en el dispositivo"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Descargar</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer hidden md:flex"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Cerrar visor (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Banner */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 shrink-0">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span><strong>Fecha de carga:</strong> {document.uploadDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span><strong>Subido por:</strong> {document.uploadedBy || document.studentName || 'Estudiante / Acudiente'}</span>
            </span>
            <span>
              <strong>Peso:</strong> {document.fileSize}
            </span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[10px] text-teal-700 dark:text-teal-300">
              {document.fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firma digital institucional activa</span>
          </div>
        </div>

        {/* Action feedback notification */}
        {actionFeedback && (
          <div className="px-5 py-2 bg-emerald-500 text-white text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 duration-150">
            <span>{actionFeedback}</span>
            <button onClick={() => setActionFeedback(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Rejection alert notice if status is rejected */}
        {document.status === 'rejected' && document.rejectionReason && (
          <div className="px-5 py-3 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-rose-900 dark:text-rose-100">
                Observación de rechazo por secretaría académica:
              </span>
              <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                "{document.rejectionReason}"
              </p>
            </div>
          </div>
        )}

        {/* Viewer Body / Document Preview Area */}
        <div className="flex-1 bg-slate-900/90 dark:bg-black/80 overflow-auto p-4 sm:p-6 flex items-center justify-center relative min-h-[360px] max-h-[58vh]">
          
          {/* 1. REAL BASE64 IMAGE PREVIEW */}
          {isImage && document.fileData ? (
            <div 
              className="transition-transform duration-200 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
              }}
            >
              <img 
                src={document.fileData} 
                alt={document.fileName}
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl border border-slate-700 bg-white"
              />
            </div>
          ) : isPdf && document.fileData && document.fileData.startsWith('data:application/pdf') ? (
            /* 2. REAL BASE64 PDF PREVIEW IN EMBED */
            <div className="w-full h-full min-h-[460px] rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-700 flex flex-col">
              <iframe
                src={document.fileData}
                title={document.name}
                className="w-full h-full min-h-[440px] border-none"
              />
            </div>
          ) : (
            /* 3. HIGH-FIDELITY INSTITUTIONAL DOCUMENT VIEWER */
            <div 
              className="bg-white text-slate-800 w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-300 relative transition-transform duration-200 select-text"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
              }}
            >
              {/* Institutional Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-6xl sm:text-7xl font-black uppercase text-slate-900 rotate-[-25deg]">
                  EDUMED OFICIAL
                </span>
              </div>

              {/* Header Certificate */}
              <div className="border-b-2 border-teal-800 pb-4 text-center space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  República de Colombia • Departamento de Antioquia
                </div>
                <h4 className="text-sm sm:text-base font-black text-teal-900 uppercase tracking-tight">
                  I.E. FÉLIX HENAO BOTERO
                </h4>
                <div className="text-[10px] text-slate-600 font-medium">
                  Secretaría de Educación Municipal de Medellín • DANE: 105001001861 • NIT: 811.026.294-8
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="my-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-center">
                <span className="text-xs font-black uppercase tracking-wider text-teal-950 block">
                  {document.name}
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-700">
                  REF: {document.fileName}
                </span>
              </div>

              {/* Document Details Grid */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Estudiante / Titular</span>
                    <span className="font-bold text-slate-900">{document.studentName || 'Estudiante Matriculado'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Categoría Documental</span>
                    <span className="font-bold text-slate-800 capitalize">{document.category || 'Identidad Oficial'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Fecha Radicación</span>
                    <span className="font-semibold text-slate-700">{document.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Radicado Por</span>
                    <span className="font-semibold text-slate-700">{document.uploadedBy || 'Usuario Autorizado'}</span>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="p-3 rounded-lg border border-dashed border-slate-300 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Constancia de Radicación Digital</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed">
                    Este soporte digital se encuentra custodiado y registrado en el repositorio documental oficial y la Secretaría Académica de la Institución. Su validez puede ser comprobada mediante el identificador criptográfico institucional asignado.
                  </p>
                </div>

                {/* Footer Stamps & Signatures */}
                <div className="pt-4 border-t border-slate-200 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <div className="w-24 h-0.5 bg-slate-400"></div>
                    <span className="text-[10px] font-bold text-slate-600 block">Secretaría Académica</span>
                    <span className="text-[9px] text-slate-400">Firma digital autorizada</span>
                  </div>

                  <div className="text-right">
                    <div className="inline-block p-1.5 border border-slate-300 rounded bg-white font-mono text-[9px] text-slate-500">
                      ID: {document.id}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Administrator Actions or Student Re-upload Prompt */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isAdmin 
                ? 'Panel de dictamen de secretaría académica:' 
                : 'Copia digital disponible para consulta y descarga por el usuario y la institución.'}
            </span>
          </div>

          {/* If Administrator: Approve & Reject Actions */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApproveClick}
                disabled={document.status === 'approved'}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  document.status === 'approved'
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 opacity-60'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{document.status === 'approved' ? 'Documento Aprobado' : 'Aprobar Documento'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRejectInput(!showRejectInput)}
                className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Rechazar / Solicitar corrección</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Copia</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          )}

        </div>

        {/* Administrative Rejection Reason Sub-Drawer */}
        {showRejectInput && isAdmin && (
          <div className="p-4 bg-rose-50/90 dark:bg-rose-950/50 border-t border-rose-200 dark:border-rose-900 animate-in slide-in-from-bottom duration-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Especifica el motivo de rechazo que verá el estudiante / acudiente:
              </span>
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold"
              >
                Cancelar
              </button>
            </div>

            <textarea
              rows={2}
              value={customRejectReason}
              onChange={(e) => setCustomRejectReason(e.target.value)}
              placeholder="Ejemplo: El archivo adjunto está borroso, recortado o los sellos no son legibles. Por favor adjunte un escaneo nítido en formato PDF."
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirmar Rechazo y Notificar</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
