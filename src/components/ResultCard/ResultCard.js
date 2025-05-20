import React from 'react';
import './ResultCard.css';

const ResultCard = ({ data }) => {
  const { title, date, site, category, image1, image2 } = data;
  const openImage = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="card">
      <div className="card-bg"></div>
      <div className="card-header">
        <div className="card-title-date">
          <div className="card-title">{title}</div>
          <div className="card-date">{date}</div>
        </div>
        <div className="card-category-site">
          <div className="card-category">QA Category: {category}</div>
          <div className="card-site">Site: {site}</div>
        </div>
      </div>
      <div className="card-images">
        {image1 && (
          <button
            type="button"
            className="card-img-button"
            onClick={() => openImage(image1)}
          >
            <img className="card-img" src={image1} alt="plot 1" />
          </button>
        )}
        {image2 && (
          <button
            type="button"
            className="card-img-button"
            onClick={() => openImage(image2)}
          >
            <img className="card-img" src={image2} alt="plot 2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
