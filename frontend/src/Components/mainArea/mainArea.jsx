import React from 'react';
import './mainArea.css';
import LeftPane from './LeftPane.jsx';

export default function MainArea() {
  return (
    <div className="uppercontainer">
      <div className="containerArea">
        <div className="leftPane">
          <LeftPane />
        </div>
        <div className="stageArea">
          
        </div>
      </div>
    </div>
  );
}
