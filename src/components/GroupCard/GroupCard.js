import React from 'react';
import './GroupCard.css';

const ResultCard = ({ groupImageUrl }) => {
  if (!groupImageUrl) {
    return (
      <div className="group-card error">
        <div className="group-card-header">
          <div className="group-card-title">Error</div>
        </div>
        <div className="group-card-body">No image URL provided</div>
      </div>
    );
  }

  const DEFAULT_CARD_HEIGHT = 800;

  const openImage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group-card"
      style={{ '--card-height': `${DEFAULT_CARD_HEIGHT}px` }}
    >
      <div className="group-card-header">
        <div className="group-card-title">Group Plot</div>
      </div>

      <hr className="group-card-divider" />

      <div className="group-wrapper">
        <div className="group-container">
          <button
            type="button"
            className="group-button"
            onClick={() => openImage(groupImageUrl)}
          >
            <img
              src={groupImageUrl}
              alt="group plot"
              className="group-image"
            />
          </button>
        </div>
        <div className="group-fade" />
      </div>
    </div>
  );
};

export default ResultCard;
