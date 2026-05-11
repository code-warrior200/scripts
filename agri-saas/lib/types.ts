import { UserRole, GrowthStage, InventoryType, TaskPriority, TaskStatus, NotificationType } from '@prisma/client';

// Re-export Prisma types for convenience
export { UserRole, GrowthStage, InventoryType, TaskPriority, TaskStatus, NotificationType };

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: UserRole;
  organizationId?: string | null;
  emailVerified?: Date | null;
}

export interface SessionUser extends AuthUser {
  organization?: Organization | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

// ============================================
// ORGANIZATION TYPES
// ============================================
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  maxUsers: number;
  maxFarms: number;
  features: OrganizationFeatures;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationFeatures {
  analytics: boolean;
  apiAccess: boolean;
  multiUser: boolean;
}

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  organizationId: string;
  invitedById: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  createdAt: Date;
}

// ============================================
// FARM MANAGEMENT TYPES
// ============================================
export interface Farm {
  id: string;
  name: string;
  description?: string | null;
  region: string;
  address?: string | null;
  gpsCoordinates?: { lat: number; lng: number } | null;
  totalArea?: number | null;
  areaUnit: string;
  soilType?: string | null;
  irrigationType?: string | null;
  status: 'active' | 'inactive' | 'archived';
  organizationId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmWithDetails extends Farm {
  fields: Field[];
  crops: Crop[];
  inventories: Inventory[];
  equipment: Equipment[];
  weatherLogs: WeatherLog[];
  _count: {
    fields: number;
    crops: number;
    activeCropCycles: number;
  };
}

export interface Field {
  id: string;
  name: string;
  area?: number | null;
  areaUnit: string;
  soilType?: string | null;
  gpsBoundaries?: object | null;
  irrigationStatus: boolean;
  status: 'available' | 'planted' | 'fallow' | 'maintenance';
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CROP LIFECYCLE TYPES
// ============================================
export interface Crop {
  id: string;
  name: string;
  variety?: string | null;
  category?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CropCycle {
  id: string;
  name: string;
  cropId: string;
  fieldId: string;
  plantingDate?: Date | null;
  expectedHarvestDate?: Date | null;
  actualHarvestDate?: Date | null;
  growthStage: GrowthStage;
  estimatedYield?: number | null;
  actualYield?: number | null;
  yieldUnit: string;
  status: 'planned' | 'active' | 'completed' | 'failed';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CropCycleWithDetails extends CropCycle {
  crop: Crop;
  field: Field;
  activities: Activity[];
  harvestLogs: HarvestLog[];
  pestReports: PestReport[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  scheduledDate?: Date | null;
  completedDate?: Date | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  data?: object | null;
  fieldId: string;
  cropCycleId?: string | null;
  assignedToId?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PestReport {
  id: string;
  pestType: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string | null;
  affectedArea?: number | null;
  imageUrl?: string | null;
  cropCycleId: string;
  reportedById: string;
  status: 'open' | 'treated' | 'resolved';
  treatment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HarvestLog {
  id: string;
  cropCycleId: string;
  harvestDate: Date;
  quantity: number;
  unit: string;
  quality?: string | null;
  notes?: string | null;
  createdBy: string;
  createdAt: Date;
}

// ============================================
// INVENTORY & RESOURCE TYPES
// ============================================
export interface Inventory {
  id: string;
  name: string;
  type: InventoryType;
  category?: string | null;
  quantity: number;
  unit: string;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  unitPrice?: number | null;
  totalValue?: number | null;
  supplier?: string | null;
  expiryDate?: Date | null;
  storageLocation?: string | null;
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLog {
  id: string;
  inventoryId: string;
  type: 'purchase' | 'usage' | 'adjustment' | 'transfer';
  quantity: number;
  unit: string;
  reference?: string | null;
  userId: string;
  createdAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  purchaseDate?: Date | null;
  purchasePrice?: number | null;
  status: 'available' | 'in_use' | 'maintenance' | 'broken';
  condition: 'new' | 'good' | 'fair' | 'poor';
  lastMaintenance?: Date | null;
  nextMaintenance?: Date | null;
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TASK & WORKFORCE TYPES
// ============================================
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date | null;
  completedDate?: Date | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  type?: string | null;
  farmId?: string | null;
  fieldId?: string | null;
  cropCycleId?: string | null;
  assignedToId?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithDetails extends Task {
  assignedTo?: { id: string; name: string; email: string } | null;
  createdBy: { id: string; name: string; email: string };
  farm?: { id: string; name: string } | null;
  field?: { id: string; name: string } | null;
}

export interface Attendance {
  id: string;
  userId: string;
  date: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ANALYTICS & REPORTING TYPES
// ============================================
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  details?: object | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface WeatherLog {
  id: string;
  farmId: string;
  temperature?: number | null;
  humidity?: number | null;
  rainfall?: number | null;
  windSpeed?: number | null;
  conditions?: string | null;
  recordedAt: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalFarms: number;
  activeFarms: number;
  totalFields: number;
  plantedFields: number;
  totalCrops: number;
  activeCropCycles: number;
  pendingTasks: number;
  urgentTasks: number;
  lowInventoryItems: number;
  totalRevenue?: number;
  estimatedYield?: number;
}

export interface YieldTrend {
  month: string;
  yield: number;
  crop?: string;
}

export interface CropDistribution {
  crop: string;
  area: number;
  percentage: number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  actionUrl?: string | null;
  metadata?: object | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================
export interface Subscription {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  amount?: number | null;
  currency: string;
  paymentMethod?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  userId: string;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeatures {
  name: string;
  price: number;
  maxUsers: number;
  maxFarms: number;
  analytics: boolean;
  apiAccess: boolean;
  multiUser: boolean;
  priority: 'low' | 'normal' | 'high';
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// FORM INPUT TYPES
// ============================================
export interface FarmFormData {
  name: string;
  description?: string;
  region: string;
  address?: string;
  gpsCoordinates?: { lat: number; lng: number };
  totalArea?: number;
  soilType?: string;
  irrigationType?: string;
}

export interface FieldFormData {
  name: string;
  area?: number;
  soilType?: string;
  irrigationStatus: boolean;
}

export interface CropFormData {
  name: string;
  variety?: string;
  category?: string;
  description?: string;
}

export interface CropCycleFormData {
  name: string;
  cropId: string;
  fieldId: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  estimatedYield?: number;
  notes?: string;
}

export interface InventoryFormData {
  name: string;
  type: InventoryType;
  category?: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
  unitPrice?: number;
  supplier?: string;
  expiryDate?: Date;
  storageLocation?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
  type?: string;
  farmId?: string;
  fieldId?: string;
  assignedToId?: string;
}

// ============================================
// UTILITY TYPES
// ============================================
export type RolePermissions = {
  [key in UserRole]: {
    canManageUsers: boolean;
    canManageFarms: boolean;
    canManageCrops: boolean;
    canManageInventory: boolean;
    canManageTasks: boolean;
    canViewAnalytics: boolean;
    canManageSubscription: boolean;
    readOnly: boolean;
  };
};

export const GROWTH_STAGES_LABELS: Record<GrowthStage, string> = {
  PLANNING: 'Planning',
  PLANTED: 'Planted',
  GERMINATION: 'Germination',
  VEGETATIVE: 'Vegetative',
  FLOWERING: 'Flowering',
  FRUITING: 'Fruiting',
  MATURING: 'Maturing',
  HARVEST_READY: 'Harvest Ready',
  HARVESTED: 'Harvested',
  POST_HARVEST: 'Post Harvest'
};

export const INVENTORY_TYPE_LABELS: Record<InventoryType, string> = {
  SEED: 'Seeds',
  FERTILIZER: 'Fertilizers',
  PESTICIDE: 'Pesticides',
  HERBICIDE: 'Herbicides',
  EQUIPMENT: 'Equipment',
  TOOL: 'Tools',
  FUEL: 'Fuel',
  OTHER: 'Other'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  WEATHER: 'Weather Alert',
  INVENTORY: 'Inventory Alert',
  TASK: 'Task Notification',
  PEST: 'Pest Alert',
  HARVEST: 'Harvest Reminder',
  SYSTEM: 'System Notification',
  ALERT: 'Alert'
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  FARM_MANAGER: 'Farm Manager',
  STAFF: 'Staff',
  VIEWER: 'Viewer'
};