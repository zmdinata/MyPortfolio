import React from 'react';

export default function AmbientGridMesh() {
  return (
    <div className="ambient-grid-wrapper" aria-hidden="true">
      <div className="ambient-radial-glow glow-left" />
      <div className="ambient-radial-glow glow-right" />
    </div>
  );
}
