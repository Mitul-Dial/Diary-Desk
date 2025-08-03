import React from "react";
import Notes from "./Notes";

const Home = (props) => {
  const { showAlert } = props;
  
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'var(--color-background)',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;