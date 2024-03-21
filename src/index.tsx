import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { HistoricalDataPoint } from "./types";
import { mockHistoricalData } from "./testPrices";
import { IoMdExit, IoMdRefresh, IoMdSettings } from "react-icons/io";
import IconButton from "./components/IconButton";
import { BaseGasChart } from "./components/BaseGasChart";
import { SettingsPage } from "./SettingsPage";
import { BottomMenu, Centered, PageTitle } from "./styles";

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: -30px auto 0;
`;

const Loading = styled.div`
  font-family: Helvetica;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: #666;
  margin-bottom: 220px;
`;

const App = () => {
  const [data, setData] = React.useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  console.log("settingsOpen", settingsOpen);

  // @ts-ignore
  const handleExit = () => window.electron.exitApp();

  async function getHistory() {
    console.log("Getting history");

    setLoading(true);
    //@ts-ignore
    // const history = await window.electron.getHistory();

    const history = mockHistoricalData;
    setData(history);

    setLoading(false);
  }

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div>
      {settingsOpen ? (
        <SettingsPage handleCloseSettings={() => setSettingsOpen(false)} />
      ) : !loading ? (
        <>
          <PageTitle>Base Fee History</PageTitle>
          <ChartContainer>
            <BaseGasChart data={data} />
          </ChartContainer>
          <BottomMenu>
            <IconButton onClick={getHistory} title={"Refresh"}>
              <IoMdRefresh />
            </IconButton>
            <IconButton
              title={"Settings"}
              onClick={() => setSettingsOpen(true)}
            >
              <IoMdSettings />
            </IconButton>
            <IconButton onClick={handleExit} title={"Quit Widget"}>
              <IoMdExit />
            </IconButton>
          </BottomMenu>
        </>
      ) : (
        <Centered>
          <Loading>Loading History...</Loading>
        </Centered>
      )}
    </div>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
