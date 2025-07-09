import React from 'react';
import Banner from "../../components/Banner/Banner";
import Search from "../../components/Search/Search";
import './Home.css'

function Home() {

  return (
    <div className="home-container">
      <Banner />
      <div className="home-content">
        <div className="page-title">Boost Cognitive Assessments</div>
          <Search className="search-positioning" onSearch={(query) => console.log('Searching:', query)} />
      </div>
    </div>

  );
};

export default Home;
