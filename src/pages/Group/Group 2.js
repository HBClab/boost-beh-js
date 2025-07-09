// components/Group/Group.js
import { useParams, useNavigate } from "react-router-dom";
import GroupCard from '../../components/GroupCard/GroupCard'
import Banner from '../../components/Banner/Banner';
import React from 'react';
import Button from '@mui/material/Button';
import { ReactComponent as IconSvg } from "../../assets/svg/back.svg";
import './Group.css'; // Assuming you have a CSS file for styling


const Group = () => {
  const { groupName } = useParams();  // e.g. "task-switching"
  const navigate = useNavigate()

  const groupImageMap = {
    "task-switching": "/group-plots/task_switching.png",
    "flanker": "/group-plots/flanker.png",
    "n-back": "/group-plots/n_back.png",
    "processing-speed-memory": "/group-plots/ps_mem.png",
  };

  const groupImageUrl = groupImageMap[groupName] || "/group/default.png";

  return (
    <div className="container">
      <Banner />
      <div className="back-button-container">
        <Button onClick={() => navigate('/group')} className="back-button">
          <IconSvg alt="BOOST icon" className="back-button-icon" />
        </Button>
      </div>
      <div className="title-row">
        <div className="title">
          Group plot for {groupName}
        </div>
      </div>
      <GroupCard groupImageUrl={groupImageUrl} className="group-card"/>
    </div>
    );
  }
  export default Group
