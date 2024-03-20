import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
`;

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
  const [data, setData] = React.useState([]);

  // @ts-ignore
  const handleExit = () => window.electron.exitApp();

  useEffect(() => {
    async function getHistory() {
      console.log("Getting history");
      // @ts-ignore
      const history = await window.electron.getHistory();

      const formattedData = history.map((h: any) => {
        return {
          name: h.blockNumber,
          uv: h.baseFeePerGasMwei,
          timestamp: h.timestamp
        };
      });

      setData(formattedData);
    }

    getHistory();
    // const formattedData = h
  }, []);

  const renderLineChart = (
    <LineChart
      width={400}
      height={280}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis
        dataKey="timestamp"
        domain={["auto", "auto"]}
        name="Time"
        tickFormatter={unixTime => dayjs.unix(unixTime).format("HH:mm")}
        type="number"
      />
      <YAxis dataKey="uv" name="Base Fee" unit="Mwei" />
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );

  return (
    <div>
      <ChartContainer>{renderLineChart}</ChartContainer>
      <ExitButton onClick={handleExit}>Close Widget</ExitButton>
    </div>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
