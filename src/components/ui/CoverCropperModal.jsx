import { useState, useRef, useEffect, useCallback } from 'react';
import { FiZoomIn, FiZoomOut, FiRotateCcw, FiCheck, FiX, FiMove } from 'react-icons/fi';

/**
 * CoverCropperModal - Modal Crop Manual Berbasis HTML5 Canvas (Rasio Aspek Fixed 16:5)
 * Memungkinkan pengguna mengunggah gambar resolusi tinggi apa pun (HD),
 * lalu menggeser (drag/pan) dan melakukan zoom untuk memilih komposisi terbaik.
 */
export default function CoverCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 5,
  targetWidth = 1600,
  targetHeight = 500,
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState(null);
  const [canvasDim, setCanvasDim] = useState({ width: 720, height: 225 });

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Load image object when imageSrc changes
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setImageObj(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
  }, [isOpen, imageSrc]);

  // Adjust preview canvas dimensions based on container width
  useEffect(() => {
    if (!isOpen) return;

    const updateCanvasDim = () => {
      if (containerRef.current) {
        const contWidth = Math.min(containerRef.current.clientWidth - 32, 740);
        const w = Math.max(320, contWidth);
        const h = Math.round(w / aspectRatio);
        setCanvasDim({ width: w, height: h });
      }
    };

    updateCanvasDim();
    window.addEventListener('resize', updateCanvasDim);
    return () => window.removeEventListener('resize', updateCanvasDim);
  }, [isOpen, aspectRatio]);

  // Draw preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvasDim;

    canvas.width = cw;
    canvas.height = ch;

    // Clear
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, cw, ch);

    // Calculate base cover fit
    const imgRatio = imageObj.width / imageObj.height;
    let baseW, baseH;

    if (imgRatio > aspectRatio) {
      baseH = ch;
      baseW = ch * imgRatio;
    } else {
      baseW = cw;
      baseH = cw / imgRatio;
    }

    const currentW = baseW * zoom;
    const currentH = baseH * zoom;

    // Centered base position + offset
    const centerX = (cw - currentW) / 2 + offset.x;
    const centerY = (ch - currentH) / 2 + offset.y;

    // Draw image with smooth scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageObj, centerX, centerY, currentW, currentH);

    // Rule of thirds subtle overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(cw / 3, 0);
    ctx.lineTo(cw / 3, ch);
    ctx.moveTo((cw * 2) / 3, 0);
    ctx.lineTo((cw * 2) / 3, ch);

    // Horizontal lines
    ctx.moveTo(0, ch / 3);
    ctx.lineTo(cw, ch / 3);
    ctx.moveTo(0, (ch * 2) / 3);
    ctx.lineTo(cw, (ch * 2) / 3);
    ctx.stroke();

    // Outer border guide
    ctx.setLineDash([]);
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, cw, ch);
  }, [canvasDim, imageObj, zoom, offset, aspectRatio]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Perform final high-resolution crop export
  const handleApplyCrop = () => {
    if (!imageObj) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetWidth;
    exportCanvas.height = targetHeight;
    const ctx = exportCanvas.getContext('2d');

    const { width: cw, height: ch } = canvasDim;
    const imgRatio = imageObj.width / imageObj.height;

    let baseW, baseH;
    if (imgRatio > aspectRatio) {
      baseH = ch;
      baseW = ch * imgRatio;
    } else {
      baseW = cw;
      baseH = cw / imgRatio;
    }

    const currentW = baseW * zoom;
    const currentH = baseH * zoom;
    const previewCenterX = (cw - currentW) / 2 + offset.x;
    const previewCenterY = (ch - currentH) / 2 + offset.y;

    // Scale factors to export resolution
    const scaleRatio = targetWidth / cw;
    const exportDrawW = currentW * scaleRatio;
    const exportDrawH = currentH * scaleRatio;
    const exportX = previewCenterX * scaleRatio;
    const exportY = previewCenterY * scaleRatio;

    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageObj, exportX, exportY, exportDrawW, exportDrawH);

    exportCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `cover_${Date.now()}.webp`, { type: 'image/webp' });
        const dataUrl = exportCanvas.toDataURL('image/webp', 0.92);
        onCropComplete({ file, dataUrl });
        onClose();
      },
      'image/webp',
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div className="cropper-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cropper-modal-dialog" onClick={(e) => e.stopPropagation()} ref={containerRef}>
        <div className="cropper-modal-header">
          <div>
            <h3>Crop Manual Foto Sampul (HD 16:5)</h3>
            <p className="cropper-subtitle">
              Geser dan sesuaikan zoom agar foto sampul proporsional di seluruh desktop, tablet, dan ponsel.
            </p>
          </div>
          <button type="button" className="cropper-close-btn" onClick={onClose} aria-label="Tutup">
            <FiX size={18} />
          </button>
        </div>

        <div className="cropper-workspace">
          <div
            className="cropper-canvas-frame"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <canvas ref={canvasRef} className="cropper-canvas" />
            <div className="cropper-drag-hint">
              <FiMove size={14} /> Geser gambar untuk menyesuaikan posisi
            </div>
          </div>

          <div className="cropper-controls-bar">
            <div className="cropper-slider-group">
              <span className="cropper-slider-label">
                <FiZoomOut size={15} /> Zoom
              </span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="cropper-zoom-range"
              />
              <span className="cropper-zoom-val">
                <FiZoomIn size={15} /> {zoom.toFixed(1)}x
              </span>
            </div>

            <button type="button" className="cropper-reset-btn" onClick={handleReset} title="Reset Posisi & Zoom">
              <FiRotateCcw size={14} /> <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="cropper-modal-footer">
          <button type="button" className="cropper-btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="cropper-btn-apply" onClick={handleApplyCrop}>
            <FiCheck size={16} /> <span>Terapkan Crop HD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
