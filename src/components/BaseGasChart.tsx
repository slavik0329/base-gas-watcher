import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import dayjs from "dayjs";
import React from "react";
import { HistoricalDataPoint } from "../types";

type Props = {
  data: HistoricalDataPoint[];
};

export function BaseGasChart({ data }: Props) {
  const timestamps = data.map(item => item.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  return (
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
}
