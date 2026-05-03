export type Farm = {
  id: string;
  name: string;
  region: string;
  status: string;
  crops: string[];
};

export type Crop = {
  id: string;
  name: string;
  farm: string;
  area: string;
  nextAction: string;
};

export type YieldTrend = {
  month: string;
  yield: number;
};

export type CropArea = {
  crop: string;
  acres: number;
};

const farms: Farm[] = [
  {
    id: "farm-1",
    name: "Sunny Acres",
    region: "California",
    status: "Healthy",
    crops: ["corn", "soybean"],
  },
  {
    id: "farm-2",
    name: "Green Valley",
    region: "Iowa",
    status: "Needs irrigation",
    crops: ["wheat", "barley"],
  },
  {
    id: "farm-3",
    name: "Riverbend Ranch",
    region: "Nebraska",
    status: "Harvest ready",
    crops: ["potatoes", "alfalfa"],
  },
];

const crops: Crop[] = [
  {
    id: "crop-1",
    name: "Corn",
    farm: "Sunny Acres",
    area: "24 acres",
    nextAction: "Monitor moisture",
  },
  {
    id: "crop-2",
    name: "Soybean",
    farm: "Sunny Acres",
    area: "14 acres",
    nextAction: "Fertilize",
  },
  {
    id: "crop-3",
    name: "Wheat",
    farm: "Green Valley",
    area: "32 acres",
    nextAction: "Weed control",
  },
  {
    id: "crop-4",
    name: "Potatoes",
    farm: "Riverbend Ranch",
    area: "12 acres",
    nextAction: "Prepare for harvest",
  },
];

const yieldTrends: YieldTrend[] = [
  { month: "Jan", yield: 8.4 },
  { month: "Feb", yield: 9.1 },
  { month: "Mar", yield: 9.8 },
  { month: "Apr", yield: 10.6 },
  { month: "May", yield: 11.4 },
  { month: "Jun", yield: 12.4 },
];

const cropAreas: CropArea[] = crops.map((crop) => ({
  crop: crop.name,
  acres: Number.parseInt(crop.area, 10),
}));

export function getFarms() {
  return farms;
}

export function addFarm(farm: Omit<Farm, "id">) {
  const nextFarm = {
    ...farm,
    id: `farm-${Date.now()}`,
  };

  farms.push(nextFarm);
  return nextFarm;
}

export function getCrops() {
  return crops;
}

export function getStats() {
  return [
    { label: "Farms", value: farms.length },
    { label: "Crops", value: crops.length },
    { label: "Estimated yield", value: "12.4 t" },
    { label: "Team members", value: 5 },
  ];
}

export function getAnalytics() {
  return {
    yieldTrends,
    cropAreas,
    farmHealth: [
      { label: "Healthy", value: farms.filter((farm) => farm.status === "Healthy").length },
      { label: "Needs attention", value: farms.filter((farm) => farm.status !== "Healthy").length },
    ],
  };
}
