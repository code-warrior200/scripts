"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  FiSun, 
  FiCloud, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock,
  FiTrendingUp,
  FiPackage,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiGrid
} from "react-icons/fi";
import Link from "next/link";

// Sample data - in production, this would come from API
const sampleStats = {
  totalFarms: 2,
  activeFarms: 2,
  totalFields: 4,
  plantedFields: 3,
  totalCrops: 4,
  activeCropCycles: 3,
  pendingTasks: 5,
  urgentTasks: 1,
  lowInventoryItems: 2,
  estimatedYield: 395,
  yieldUnit: "tons"
};

const sampleWeather = {
  temperature: 28.5,
  humidity: 65,
  conditions: "sunny",
  windSpeed: 12.5
};

const sampleCropStatus = [
  { id: 1, name: "2024 Spring Corn", stage: "Vegetative", field: "North Field A", progress: 45, status: "healthy" },
  { id: 2, name: "2024 Winter Wheat", stage: "Maturing", field: "South Field B", progress: 78, status: "attention" },
  { id: 3, name: "2024 Spring Potatoes", stage: "Harvest Ready", field: "Potato Field", progress: 95, status: "ready" }
];

const sampleInventoryAlerts = [
  { id: 1, name: "Urea Fertilizer", quantity: 5000, minQuantity: 1000, unit: "kg", status: "warning" },
  { id: 2, name: "Herbicide - Glyphosate", quantity: 25, minQuantity: 10, unit: "liters", status: "ok" },
  { id: 3, name: "Corn Seeds", quantity: 200, minQuantity: 50, unit: "kg", status: "ok" }
];

const sampleUpcomingTasks = [
  { id: 1, title: "Inspect irrigation system", dueDate: "May 12, 2026", priority: "high", assignee: "Noah Bennett" },
  { id: 2, title: "Schedule potato harvest", dueDate: "May 18, 2026", priority: "urgent", assignee: "Maya Collins" },
  { id: 3, title: "Order fertilizer supply", dueDate: "May 20, 2026", priority: "medium", assignee: "Maya Collins" },
  { id: 4, title: "Equipment maintenance", dueDate: "May 22, 2026", priority: "normal", assignee: "John Mitchell" }
];

const sampleRecentActivities = [
  { id: 1, type: "harvest", title: "Completed fertilizing North Field", user: "Noah Bennett", time: "2 hours ago" },
  { id: 2, type: "task", title: "Task assigned: Irrigation Check", user: "Maya Collins", time: "4 hours ago" },
  { id: 3, type: "alert", title: "Low inventory alert: Urea Fertilizer", user: "System", time: "6 hours ago" },
  { id: 4, type: "crop", title: "Wheat rust detected in South Field", user: "Noah Bennett", time: "8 hours ago" }
];

const yieldTrends = [
  { month: "Jan", yield: 8.4 },
  { month: "Feb", yield: 9.1 },
  { month: "Mar", yield: 9.8 },
  { month: "Apr", yield: 10.6 },
  { month: "May", yield: 11.4 },
  { month: "Jun", yield: 12.4 }
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <section className="dashboard-header">
        <div>
          <h1>Welcome back, {session?.user?.name?.split(' ')[0] || 'Farmer'}!</h1>
          <p>Here's what's happening on your farms today.</p>
        </div>
        <div className="header-actions">
          <span className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon farms">
            <FiMapPin />
          </div>
          <div className="stat-content">
            <span className="stat-value">{sampleStats.totalFarms}</span>
            <span className="stat-label">Active Farms</span>
          </div>
          <Link href="/farms" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon fields">
            <FiGrid />
          </div>
          <div className="stat-content">
            <span className="stat-value">{sampleStats.plantedFields}</span>
            <span className="stat-label">Planted Fields</span>
          </div>
          <Link href="/farms" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon yield">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <span className="stat-value">{sampleStats.estimatedYield}</span>
            <span className="stat-label">Est. Yield (tons)</span>
          </div>
          <Link href="/analytics" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon tasks">
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-value">{sampleStats.pendingTasks}</span>
            <span className="stat-label">Pending Tasks</span>
          </div>
          <Link href="/tasks" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon inventory">
            <FiPackage />
          </div>
          <div className="stat-content">
            <span className="stat-value">{sampleStats.lowInventoryItems}</span>
            <span className="stat-label">Low Stock Items</span>
          </div>
          <Link href="/inventory" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon team">
            <FiUsers />
          </div>
          <div className="stat-content">
            <span className="stat-value">3</span>
            <span className="stat-label">Team Members</span>
          </div>
          <Link href="/team" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Weather Widget */}
        <section className="widget weather-widget">
          <div className="widget-header">
            <h3>Weather Overview</h3>
            <span className="widget-location">
              <FiMapPin /> California
            </span>
          </div>
          <div className="weather-content">
            <div className="weather-main">
              <div className="weather-icon">
                {sampleWeather.conditions === 'sunny' ? <FiSun /> : <FiCloud />}
              </div>
              <div className="weather-temp">
                <span className="temp-value">{sampleWeather.temperature} C</span>
                <span className="temp-condition">{sampleWeather.conditions}</span>
              </div>
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{sampleWeather.humidity}%</span>
              </div>
              <div className="weather-detail">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{sampleWeather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </section>

        {/* Crop Status Widget */}
        <section className="widget crop-status-widget">
          <div className="widget-header">
            <h3>Crop Status</h3>
            <Link href="/crops" className="widget-link">View All</Link>
          </div>
          <div className="crop-status-list">
            {sampleCropStatus.map((crop) => (
              <div key={crop.id} className="crop-status-item">
                <div className="crop-info">
                  <span className="crop-name">{crop.name}</span>
                  <span className="crop-field">{crop.field}</span>
                </div>
                <div className="crop-progress">
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${crop.status}`} 
                      style={{ width: `${crop.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{crop.progress}%</span>
                </div>
                <div className={`crop-stage ${crop.status}`}>
                  {crop.status === 'healthy' && <FiCheckCircle />}
                  {crop.status === 'attention' && <FiAlertTriangle />}
                  {crop.status === 'ready' && <FiSun />}
                  <span>{crop.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Yield Trends Chart */}
        <section className="widget yield-widget">
          <div className="widget-header">
            <h3>Yield Trends</h3>
            <Link href="/analytics" className="widget-link">View Report</Link>
          </div>
          <div className="yield-chart">
            <div className="chart-container">
              {yieldTrends.map((item) => (
                <div key={item.month} className="chart-bar-wrapper">
                  <div className="chart-bar" style={{ height: `${(item.yield / 15) * 100}%` }}>
                    <span className="chart-value">{item.yield}t</span>
                  </div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inventory Alerts */}
        <section className="widget inventory-widget">
          <div className="widget-header">
            <h3>Inventory Alerts</h3>
            <Link href="/inventory" className="widget-link">Manage</Link>
          </div>
          <div className="inventory-alerts-list">
            {sampleInventoryAlerts.map((item) => (
              <div key={item.id} className={`inventory-alert ${item.status}`}>
                <div className="alert-icon">
                  {item.status === 'warning' ? <FiAlertTriangle /> : <FiCheckCircle />}
                </div>
                <div className="alert-content">
                  <span className="alert-name">{item.name}</span>
                  <span className="alert-quantity">
                    {item.quantity} {item.unit} 
                    {item.status === 'warning' && ` (Min: ${item.minQuantity})`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="widget tasks-widget">
          <div className="widget-header">
            <h3>Upcoming Tasks</h3>
            <Link href="/tasks" className="widget-link">View All</Link>
          </div>
          <div className="tasks-list">
            {sampleUpcomingTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-priority">
                  <span className={`priority-dot ${task.priority}`}></span>
                </div>
                <div className="task-content">
                  <span className="task-title">{task.title}</span>
                  <div className="task-meta">
                    <span className="task-date">
                      <FiCalendar /> {task.dueDate}
                    </span>
                    <span className="task-assignee">{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="widget activity-widget">
          <div className="widget-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {sampleRecentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'harvest' && <FiCheckCircle />}
                  {activity.type === 'task' && <FiClock />}
                  {activity.type === 'alert' && <FiAlertTriangle />}
                  {activity.type === 'crop' && <FiGrid />}
                </div>
                <div className="activity-content">
                  <span className="activity-title">{activity.title}</span>
                  <div className="activity-meta">
                    <span className="activity-user">{activity.user}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
