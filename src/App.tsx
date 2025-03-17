import {min, max, mean, standardDeviation, zScore} from 'simple-statistics';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from "recharts";

interface DataPoint {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const data: DataPoint[] = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


// Calculate min, max, mean and standard deviation for the first curve (pv)
const dataPV: number[] = data.map((i) => i.pv);
const minPV: number = min(dataPV);
const maxPV: number = max(dataPV);
const meanPV: number = mean(dataPV);
const standardDeviationPV: number = standardDeviation(dataPV);

// Calculate min, max, mean and standard deviation for the second curve (uv)
const dataUV: number[] = data.map((i) => i.uv);
const minUV: number = min(dataUV);
const maxUV: number = max(dataUV);
const meanUV: number = mean(dataUV);
const standardDeviationUV: number = standardDeviation(dataUV);

// Define the interface for customized dot rendering 
interface CustomizedDotProps {
  cx: number;
  cy: number;
  value: number[];
}
// Define the function to render customized dots for the first curve (pv)
const renderDotPV = (props: CustomizedDotProps) => {
  const { cx, cy, value } = props;
  // Define color of the dot based on z-score for the first curve (pv)
  const stroke: string = zScore(value[1], meanPV, standardDeviationPV) > 1 ? 'red' : '#8884d8';
  return <Dot key={"pv" + cx} cx={cx} cy={cy} r={3} fill={stroke} stroke={stroke}/>;
};

// Define the function to render customized dots for the second curve (uv)
const renderDotUV = (props: CustomizedDotProps) => {
  const { cx, cy, value } = props;
  // Define color of the dot based on z-score for the second curve (uv)
  const stroke: string = zScore(value[1], meanUV, standardDeviationUV) > 1 ? 'red' : '#82ca9d';
  return <Dot key={"uv" + cx} cx={cx} cy={cy} r={3} fill={stroke} stroke={stroke}  />;
};

export default function App() {
  return (
    <ResponsiveContainer minWidth={700} minHeight={300}>
      <AreaChart data={data} margin={{ top: 20 }} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <defs>
          <linearGradient id="splitColorPV" x1="0" y1="1" x2="0" y2="0">
            <stop offset={(meanPV+standardDeviationPV-minPV)/(maxPV-minPV)} stopColor="#8884d8" stopOpacity={1} />
            <stop offset={(meanPV+standardDeviationPV-minPV)/(maxPV-minPV)} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area          
          type="monotone"
          dataKey="pv"
          stroke="url(#splitColorPV)"
          fill="url(#splitColorPV)"
          fillOpacity={1}
          baseValue={meanPV+standardDeviationPV}
          dot={renderDotPV}
          activeDot={false}
        />        
        <defs>
          <linearGradient id="splitColorUV" x1="0" y1="1" x2="0" y2="0">
            <stop offset={(meanUV+standardDeviationUV-minUV)/(maxUV-minUV)} stopColor="#82ca9d" stopOpacity={1} />
            <stop offset={(meanUV+standardDeviationUV-minUV)/(maxUV-minUV)} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          key="uv"
          type="monotone"
          dataKey="uv"
          stroke="url(#splitColorUV)"
          fill="url(#splitColorUV)"
          fillOpacity={1}
          baseValue={meanUV+standardDeviationUV}
          dot={renderDotUV}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}