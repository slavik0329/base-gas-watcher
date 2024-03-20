import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";
import dayjs from "dayjs";
import { HistoricalDataPoint } from "./types";
import { mockHistoricalData } from "./testPrices";

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
  margin-top: -30px;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ExitButton = styled.div`
  display: inline-block;
  cursor: pointer;
  font-family: Helvetica;
  padding: 8px;
  text-align: center;
  color: #666;
  margin-top: -12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  &:hover {
  background-color: #ccc;
`;

const ChartTitle = styled.div`
  font-family: Helvetica;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 12px;
  color: #666;
`;

const App = () => {
  const [data, setData] = React.useState<HistoricalDataPoint[]>([]);

  // @ts-ignore
  const handleExit = () => window.electron.exitApp();

  useEffect(() => {
    async function getHistory() {
      console.log("Getting history");

      // @ts-ignore
      // const history = await window.electron.getHistory();

      const history = mockHistoricalData;

      setData(history);
    }

    getHistory();
    // const formattedData = h
  }, []);

  const timestamps = data.map(item => item.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  const renderLineChart = (
    <AreaChart
      width={400}
      height={200}
      data={data}
      title="Base Fee"
      margin={{ top: 5, right: 30, left: 16, bottom: 5 }}
      style={{ fontFamily: "Helvetica", fontSize: "14px" }}
    >
      <Tooltip
        formatter={(value: any) => `${value} Mwei`}
        labelFormatter={(value: any) =>
          dayjs.unix(value).format("MM/DD/YYYY HH:mm")
        }
      />
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="timestamp"
        domain={[minTimestamp, maxTimestamp]}
        name="Time"
        tickFormatter={unixTime => dayjs.unix(unixTime).format("HH:mm")}
        type="number"
      />
      <YAxis dataKey="baseFeePerGasMwei" name="Base Fee" unit="Mwei" />
      <Area
        type="monotone"
        dataKey="baseFeePerGasMwei"
        stroke="#8884d8"
        name={"Base Fee"}
      />
    </AreaChart>
  );

  return (
    <div>
      <ChartTitle>Base Fee History</ChartTitle>
      <ChartContainer>{renderLineChart}</ChartContainer>
      <Centered>
        <ExitButton onClick={handleExit}>Exit App</ExitButton>
      </Centered>
    </div>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
