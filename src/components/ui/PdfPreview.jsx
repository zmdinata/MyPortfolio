import { useEffect, useRef, useState } from 'react';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

function PdfPage({ pdf, pageNumber, containerWidth }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdf || !containerWidth) return undefined;

    let renderTask = null;
    let cancelled = false;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const baseViewport = page.getViewport({ scale: 1 });
      const targetWidth = Math.max(280, containerWidth - 24);
      const scale = Math.min(2, targetWidth / baseViewport.width);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      renderTask = page.render({ canvasContext: context, viewport });
      await renderTask.promise;
    };

    renderPage().catch((error) => {
      if (error?.name !== 'RenderingCancelledException') {
        console.error('Failed to render PDF page:', error);
      }
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [containerWidth, pageNumber, pdf]);

  return <canvas className="pdf-page-canvas" ref={canvasRef} aria-label={`PDF page ${pageNumber}`} />;
}

export default function PdfPreview({ src }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pdf, setPdf] = useState(null);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!src) return undefined;

    let cancelled = false;
    let loadedPdf = null;
    setStatus('loading');
    setPdf(null);
    setPageNumbers([]);

    const loadPdf = async () => {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      loadedPdf = await pdfjsLib.getDocument(src).promise;
      if (cancelled) return;

      setPdf(loadedPdf);
      setPageNumbers(Array.from({ length: loadedPdf.numPages }, (_, index) => index + 1));
      setStatus('ready');
    };

    loadPdf().catch((error) => {
      console.error('Failed to load PDF:', error);
      if (!cancelled) setStatus('error');
    });

    return () => {
      cancelled = true;
      loadedPdf?.destroy();
    };
  }, [src]);

  return (
    <div className="pdf-preview" ref={containerRef}>
      {status === 'loading' && <div className="pdf-preview-state">Loading PDF...</div>}
      {status === 'error' && (
        <div className="pdf-preview-state">
          PDF preview failed. <a href={src} target="_blank" rel="noopener noreferrer">Open file</a>
        </div>
      )}
      {status === 'ready' && pdf && pageNumbers.map((pageNumber) => (
        <PdfPage
          key={pageNumber}
          pdf={pdf}
          pageNumber={pageNumber}
          containerWidth={containerWidth}
        />
      ))}
    </div>
  );
}
