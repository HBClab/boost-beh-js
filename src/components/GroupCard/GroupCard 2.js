import React from 'react';
import './GroupCard.css';

const ResultCard = ({ groupImageUrl }) => {
  if (!groupImageUrl) {
    return (
      <div className="card error">
        <div className="card-header">
          <div className="card-title">Error</div>
        </div>
        <div className="card-body">No image URL provided</div>
      </div>
    );
  }

  const DEFAULT_CARD_HEIGHT = 800;

  const openImage = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="card"
      style={{ '--card-height': `${DEFAULT_CARD_HEIGHT}px` }}
    >
      <div className="card-header">
        <div className="card-title">Group Plot</div>
      </div>

      <hr className="card-divider" />

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
