import React from 'react';
import '../../styles/components/skeleton.css';

export function SkeletonCard({ type = 'project' }) {
  if (type === 'project') {
    return (
      <div className="skeleton-card skeleton-project-card" aria-hidden="true">
        <div className="skeleton-thumbnail-box skeleton-shimmer" />
        <div className="skeleton-project-content">
          <div className="skeleton-badge-pill skeleton-shimmer" />
          <div className="skeleton-title-line skeleton-shimmer" />
          <div className="skeleton-desc-line skeleton-shimmer" />
          <div className="skeleton-desc-line short skeleton-shimmer" />
          <div className="skeleton-tags-row">
            <div className="skeleton-tag-chip skeleton-shimmer" />
            <div className="skeleton-tag-chip skeleton-shimmer" />
            <div className="skeleton-tag-chip skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'certificate') {
    return (
      <div className="skeleton-card skeleton-cert-card" aria-hidden="true">
        <div className="skeleton-cert-preview skeleton-shimmer" />
        <div className="skeleton-cert-body">
          <div className="skeleton-badge-pill skeleton-shimmer" />
          <div className="skeleton-title-line skeleton-shimmer" />
          <div className="skeleton-desc-line short skeleton-shimmer" />
        </div>
      </div>
    );
  }

  if (type === 'honor') {
    return (
      <div className="skeleton-card skeleton-honor-card" aria-hidden="true">
        <div className="skeleton-honor-header">
          <div className="skeleton-circle-icon skeleton-shimmer" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton-title-line skeleton-shimmer" style={{ width: '80%' }} />
            <div className="skeleton-desc-line short skeleton-shimmer" />
          </div>
        </div>
        <div className="skeleton-desc-line skeleton-shimmer" />
        <div className="skeleton-desc-line short skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="skeleton-card" style={{ minHeight: 200, padding: '1.5rem' }} aria-hidden="true">
      <div className="skeleton-title-line skeleton-shimmer" style={{ marginBottom: 12 }} />
      <div className="skeleton-desc-line skeleton-shimmer" style={{ marginBottom: 8 }} />
      <div className="skeleton-desc-line short skeleton-shimmer" />
    </div>
  );
}

export function SkeletonGrid({ type = 'project', count = 6 }) {
  return (
    <div className="skeleton-grid" aria-label="Memuat konten..." role="status">
      {Array.from({ length: count }, (_, idx) => (
        <SkeletonCard key={idx} type={type} />
      ))}
    </div>
  );
}

export default SkeletonCard;
