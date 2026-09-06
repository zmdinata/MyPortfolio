import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export default function PdfPreview({ src }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'rendering' | 'error'
  const [zoomScale, setZoomScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  // 1. Debounced Container Width Observer
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    let timeoutId = null;
    const observer = new ResizeObserver(([entry]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setContainerWidth(Math.floor(entry.contentRect.width));
      }, 80);
    });

    observer.observe(element);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // 2. Load PDF Document (Once)
  useEffect(() => {
    if (!src) return undefined;

    let cancelled = false;
    let loadedPdf = null;
    setStatus('loading');
    setPdf(null);
    setNumPages(0);
    setCurrentPage(1);

    const loadDoc = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        loadedPdf = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;

        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setStatus('ready');
      } catch (err) {
        console.error('Failed to load PDF document:', err);
        if (!cancelled) setStatus('error');
      }
    };

    loadDoc();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_) {}
      }
      loadedPdf?.destroy();
    };
  }, [src]);

  // 3. Render ONLY the Active Page
  const renderCurrentPage = useCallback(async () => {
    if (!pdf || !canvasRef.current || containerWidth <= 0) return;

    // Cancel in-flight render task if still active
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (_) {}
    }

    try {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(300, containerWidth - 32);
      const fitScale = (availableWidth / baseViewport.width) * zoomScale;
      // Cap scale to prevent memory explosion
      const finalScale = Math.min(2.5, Math.max(0.5, fitScale));
      const viewport = page.getViewport({ scale: finalScale });

      const ratio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const context = canvas.getContext('2d', { alpha: false });
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const renderTask = page.render({ canvasContext: context, viewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Failed to render PDF page:', err);
      }
    }
  }, [pdf, currentPage, containerWidth, zoomScale]);

  useEffect(() => {
    if (status === 'ready' || status === 'rendering') {
      renderCurrentPage();
    }
  }, [status, renderCurrentPage]);

  // 4. Keyboard Navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (numPages <= 1) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(numPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(numPages, p + 1));
  const handleZoomIn = () => setZoomScale((z) => Math.min(1.8, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((z) => Math.max(0.6, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1);

  return (
    <div className="pdf-viewer-wrapper" ref={containerRef}>
      {/* Top Controls Toolbar */}
      {status !== 'error' && (
        <div className="pdf-toolbar">
          {/* Pagination Controls */}
          {numPages > 1 ? (
            <div className="pdf-toolbar-group">
              <button
                type="button"
                className="pdf-btn"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                title="Halaman Sebelumnya (Panah Kiri)"
              >
                <FiChevronLeft /> <span>Prev</span>
              </button>

              <div className="pdf-page-indicator">
                <span>{currentPage}</span>
                <span className="pdf-page-separator">/</span>
                <span>{numPages}</span>
              </div>

              <button
                type="button"
                className="pdf-btn"
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                title="Halaman Berikutnya (Panah Kanan)"
              >
                <span>Next</span> <FiChevronRight />
              </button>
            </div>
          ) : (
            <div className="pdf-doc-badge">
              <span>Dokumen 1 Halaman</span>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="pdf-toolbar-group">
            <button
              type="button"
              className="pdf-btn-icon"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.6}
              title="Perkecil Tampilan"
            >
              <FiZoomOut />
            </button>

            <button
              type="button"
              className="pdf-btn-zoom-val"
              onClick={handleResetZoom}
              title="Reset Zoom (Fit Width)"
            >
              {Math.round(zoomScale * 100)}%
            </button>

            <button
              type="button"
              className="pdf-btn-icon"
              onClick={handleZoomIn}
              disabled={zoomScale >= 1.8}
              title="Perbesar Tampilan"
            >
              <FiZoomIn />
            </button>
          </div>

          {/* External / Download Link */}
          <div className="pdf-toolbar-group">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="pdf-btn-external"
              title="Buka Dokumen Asli di Tab Baru"
            >
              <FiExternalLink /> <span>Tab Baru</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Canvas / Content Viewport */}
      <div className="pdf-viewport">
        {status === 'loading' && (
          <div className="pdf-state-loading">
            <FiRefreshCw className="spin" />
            <p>Membuka dokumen...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="pdf-state-error">
            <p>Gagal memuat pratinjau dokumen di browser.</p>
            <a href={src} target="_blank" rel="noreferrer" className="pdf-btn-fallback">
              <FiDownload /> Buka Dokumen Asli
            </a>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`pdf-canvas ${status === 'loading' ? 'hidden' : ''}`}
          aria-label={`PDF page ${currentPage}`}
        />
      </div>

      {/* Multi-Page Quick Slide Navigator */}
      {numPages > 1 && (
        <div className="pdf-slide-dots">
          {Array.from({ length: Math.min(numPages, 16) }, (_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`pdf-slide-dot ${isActive ? 'active' : ''}`}
                title={`Lompat ke Slide ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
          {numPages > 16 && (
            <span className="pdf-dots-more">+{numPages - 16} halaman lagi</span>
          )}
        </div>
      )}
    </div>
  );
}
