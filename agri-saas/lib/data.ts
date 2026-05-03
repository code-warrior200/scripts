export type Farm = {
  id: string;
  name: string;
  region: string;
  status: string;
  crops: string[];
  manager: string;
  area: string;
  soilType: string;
  lastInspection: string;
};

export type Crop = {
  id: string;
  name: string;
  farm: string;
  area: string;
  nextAction: string;
  variety: string;
  growthStage: string;
  plantingDate: string;
  harvestWindow: string;
  health: string;
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
    manager: "Maya Collins",
    area: "38 acres",
    soilType: "Loam",
    lastInspection: "Apr 28, 2026",
  },
  {
    id: "farm-2",
    name: "Green Valley",
    region: "Iowa",
    status: "Needs irrigation",
    crops: ["wheat", "barley"],
    manager: "Noah Bennett",
    area: "44 acres",
    soilType: "Silty clay",
    lastInspection: "Apr 24, 2026",
  },
  {
    id: "farm-3",
    name: "Riverbend Ranch",
    region: "Nebraska",
    status: "Harvest ready",
    crops: ["potatoes", "alfalfa"],
    manager: "Avery Stone",
    area: "28 acres",
    soilType: "Sandy loam",
    lastInspection: "Apr 30, 2026",
  },
];

const crops: Crop[] = [
  {
    id: "crop-1",
    name: "Corn",
    farm: "Sunny Acres",
    area: "24 acres",
    nextAction: "Monitor moisture",
    variety: "Sweet corn",
    growthStage: "Vegetative",
    plantingDate: "Mar 12, 2026",
    harvestWindow: "Jul 15 - Aug 4, 2026",
    health: "Stable",
  },
  {
    id: "crop-2",
    name: "Soybean",
    farm: "Sunny Acres",
    area: "14 acres",
    nextAction: "Fertilize",
    variety: "Early maturity",
    growthStage: "Flowering",
    plantingDate: "Mar 25, 2026",
    harvestWindow: "Aug 18 - Sep 5, 2026",
    health: "Healthy",
  },
  {
    id: "crop-3",
    name: "Wheat",
    farm: "Green Valley",
    area: "32 acres",
    nextAction: "Weed control",
    variety: "Hard red winter",
    growthStage: "Heading",
    plantingDate: "Feb 22, 2026",
    harvestWindow: "Jun 20 - Jul 2, 2026",
    health: "Needs attention",
  },
  {
    id: "crop-4",
    name: "Potatoes",
    farm: "Riverbend Ranch",
    area: "12 acres",
    nextAction: "Prepare for harvest",
    variety: "Russet",
    growthStage: "Maturing",
    plantingDate: "Feb 10, 2026",
    harvestWindow: "May 22 - Jun 8, 2026",
    health: "Harvest ready",
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

export function getFarmById(id: string) {
  return farms.find((farm) => farm.id === id);
}

export function addFarm(farm: Omit<Farm, "id" | "manager" | "area" | "soilType" | "lastInspection">) {
  const nextFarm = {
    ...farm,
    id: `farm-${Date.now()}`,
    manager: "Unassigned",
    area: "Not set",
    soilType: "Not set",
    lastInspection: "Not inspected",
  };

  farms.push(nextFarm);
  return nextFarm;
}

export function getCrops() {
  return crops;
}

export function getCropById(id: string) {
  return crops.find((crop) => crop.id === id);
}

export function getCropsByFarm(farmName: string) {
  return crops.filter((crop) => crop.farm === farmName);
}

export function getFarmByName(farmName: string) {
  return farms.find((farm) => farm.name === farmName);
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
