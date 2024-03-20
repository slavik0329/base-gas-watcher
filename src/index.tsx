import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const ExitButton = styled.div`
  cursor: pointer;
  font-family: Helvetica;
  padding: 8px;
  text-align: center;

  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const App = () => {
  // @ts-ignore
  const handleExit = () => window.electron.exitApp();

  return (
    <div>
      <ExitButton onClick={handleExit}>Close Widget</ExitButton>
    </div>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
