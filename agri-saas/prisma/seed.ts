import { UserRole, GrowthStage, InventoryType, TaskPriority, TaskStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data
  await prisma.activityLog.deleteMany();
  await prisma.weatherLog.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.harvestLog.deleteMany();
  await prisma.pestReport.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.cropCycle.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.organizationInvitation.deleteMany();
  await prisma.field.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // Create organizations
  const org1 = await prisma.organization.create({
    data: {
      name: 'Sunny Acres Farm',
      slug: 'sunny-acres',
      plan: 'pro',
      status: 'active',
      maxUsers: 10,
      maxFarms: 5,
      features: {
        analytics: true,
        apiAccess: false,
        multiUser: true
      }
    }
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Green Valley Co-op',
      slug: 'green-valley',
      plan: 'enterprise',
      status: 'active',
      maxUsers: 50,
      maxFarms: 20,
      features: {
        analytics: true,
        apiAccess: true,
        multiUser: true
      }
    }
  });

  const org3 = await prisma.organization.create({    data: {
      name: 'Demo Farm',
      slug: 'demo-farm',
      plan: 'free',
      status: 'active',
      maxUsers: 1,
      maxFarms: 3,
      features: {
        analytics: false,
        apiAccess: false,
        multiUser: false
      }
    }
  });

  void org3;

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users for org1
  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@sunnyacres.com',
      password: hashedPassword,
      name: 'John Mitchell',
      role: UserRole.ADMIN,
      organizationId: org1.id,
      emailVerified: new Date()
    }
  });

  const manager1 = await prisma.user.create({
    data: {
      email: 'maya@sunnyacres.com',
      password: hashedPassword,
      name: 'Maya Collins',
      role: UserRole.FARM_MANAGER,
      organizationId: org1.id,
      emailVerified: new Date()
    }
  });

  const staff1 = await prisma.user.create({
    data: {
      email: 'noah@sunnyacres.com',
      password: hashedPassword,
      name: 'Noah Bennett',
      role: UserRole.STAFF,
      organizationId: org1.id,
      emailVerified: new Date()
    }
  });

  // Create users for org2
  const admin2 = await prisma.user.create({
    data: {
      email: 'admin@greenvalley.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: UserRole.ADMIN,
      organizationId: org2.id,
      emailVerified: new Date()
    }
  });

  // Create demo user (no organization)
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      role: UserRole.ADMIN,
      emailVerified: new Date()
    }
  });

  void demoUser;

  console.log('👥 Created users');

  // Create crops
  const cornCrop = await prisma.crop.create({
    data: {
      name: 'Corn',
      variety: 'Sweet Corn',
      category: 'Grain',
      description: 'High-yield sweet corn variety',
      organizationId: org1.id
    }
  });

  const wheatCrop = await prisma.crop.create({
    data: {
      name: 'Wheat',
      variety: 'Hard Red Winter',
      category: 'Grain',
      description: 'Premium wheat for flour production',
      organizationId: org1.id
    }
  });

  const soybeanCrop = await prisma.crop.create({
    data: {
      name: 'Soybean',
      variety: 'Early Maturity',
      category: 'Legume',
      description: 'Fast-maturing soybean variety',
      organizationId: org1.id
    }
  });

  const potatoCrop = await prisma.crop.create({
    data: {
      name: 'Potato',
      variety: 'Russet',
      category: 'Vegetable',
      description: 'Popular baking potato',
      organizationId: org1.id
    }
  });

  console.log('🌽 Created crops');

  // Create farms
  const farm1 = await prisma.farm.create({
    data: {
      name: 'Sunny Acres Main Farm',
      description: 'Primary farming location with diverse crops',
      region: 'California',
      address: '123 Farm Road, Fresno, CA 93721',
      gpsCoordinates: { lat: 36.7378, lng: -119.7871 },
      totalArea: 150,
      areaUnit: 'acres',
      soilType: 'Loam',
      irrigationType: 'drip',
      status: 'active',
      organizationId: org1.id,
      ownerId: admin1.id
    }
  });

  const farm2 = await prisma.farm.create({
    data: {
      name: 'Riverbend Ranch',
      description: 'Secondary farm specializing in root vegetables',
      region: 'California',
      address: '456 River Road, Bakersfield, CA 93301',
      gpsCoordinates: { lat: 35.3733, lng: -119.0187 },
      totalArea: 80,
      areaUnit: 'acres',
      soilType: 'Sandy Loam',
      irrigationType: 'sprinkler',
      status: 'active',
      organizationId: org1.id,
      ownerId: admin1.id
    }
  });

  console.log('🚜 Created farms');

  // Create fields
  const field1 = await prisma.field.create({
    data: {
      name: 'North Field A',
      area: 40,
      areaUnit: 'acres',
      soilType: 'Loam',
      irrigationStatus: true,
      status: 'planted',
      farmId: farm1.id
    }
  });

  const field2 = await prisma.field.create({
    data: {
      name: 'South Field B',
      area: 35,
      areaUnit: 'acres',
      soilType: 'Loam',
      irrigationStatus: true,
      status: 'planted',
      farmId: farm1.id
    }
  });

  const field3 = await prisma.field.create({
    data: {
      name: 'East Field C',
      area: 25,
      areaUnit: 'acres',
      soilType: 'Silty Clay',
      irrigationStatus: false,
      status: 'fallow',
      farmId: farm1.id
    }
  });

  const field4 = await prisma.field.create({
    data: {
      name: 'Potato Field',
      area: 30,
      areaUnit: 'acres',
      soilType: 'Sandy Loam',
      irrigationStatus: true,
      status: 'planted',
      farmId: farm2.id
    }
  });

  console.log('📍 Created fields');

  // Create crop cycles
  const cornCycle = await prisma.cropCycle.create({
    data: {
      name: '2024 Spring Corn',
      cropId: cornCrop.id,
      fieldId: field1.id,
      plantingDate: new Date('2024-03-15'),
      expectedHarvestDate: new Date('2024-07-20'),
      growthStage: GrowthStage.VEGETATIVE,
      estimatedYield: 180,
      yieldUnit: 'tons',
      status: 'active',
      notes: 'Excellent germination rate this season'
    }
  });

  const wheatCycle = await prisma.cropCycle.create({
    data: {
      name: '2024 Winter Wheat',
      cropId: wheatCrop.id,
      fieldId: field2.id,
      plantingDate: new Date('2023-11-10'),
      expectedHarvestDate: new Date('2024-06-15'),
      growthStage: GrowthStage.MATURING,
      estimatedYield: 95,
      yieldUnit: 'tons',
      status: 'active',
      notes: 'Good winter survival, monitoring for rust'
    }
  });

  const potatoCycle = await prisma.cropCycle.create({
    data: {
      name: '2024 Spring Potatoes',
      cropId: potatoCrop.id,
      fieldId: field4.id,
      plantingDate: new Date('2024-02-20'),
      expectedHarvestDate: new Date('2024-06-01'),
      growthStage: GrowthStage.HARVEST_READY,
      estimatedYield: 120,
      yieldUnit: 'tons',
      status: 'active',
      notes: 'Ready for harvest, scheduling equipment'
    }
  });

  console.log('🌱 Created crop cycles');

  // Create activities
  await prisma.activity.create({
    data: {
      type: 'fertilizing',
      title: 'Nitrogen Application - North Field',
      description: 'Apply 50kg/ha of nitrogen fertilizer',
      scheduledDate: new Date('2024-05-10'),
      completedDate: new Date('2024-05-10'),
      status: 'completed',
      data: { fertilizerType: 'Urea', amount: 2000, unit: 'kg' },
      fieldId: field1.id,
      cropCycleId: cornCycle.id,
      assignedToId: staff1.id,
      createdById: manager1.id
    }
  });

  await prisma.activity.create({
    data: {
      type: 'irrigation',
      title: 'Irrigation Check - South Field',
      description: 'Check and adjust drip irrigation system',
      scheduledDate: new Date('2024-05-12'),
      status: 'pending',
      fieldId: field2.id,
      cropCycleId: wheatCycle.id,
      assignedToId: staff1.id,
      createdById: manager1.id
    }
  });

  await prisma.activity.create({
    data: {
      type: 'pest_control',
      title: 'Wheat Rust Prevention',
      description: 'Apply fungicide to prevent wheat rust',
      scheduledDate: new Date('2024-05-15'),
      status: 'pending',
      data: { pesticide: 'Propiconazole', amount: 5, unit: 'liters' },
      fieldId: field2.id,
      cropCycleId: wheatCycle.id,
      assignedToId: staff1.id,
      createdById: manager1.id
    }
  });

  console.log('📋 Created activities');

  // Create inventory items
  const inventory1 = await prisma.inventory.create({
    data: {
      name: 'Urea Fertilizer',
      type: InventoryType.FERTILIZER,
      category: 'Nitrogen',
      quantity: 5000,
      unit: 'kg',
      minQuantity: 1000,
      maxQuantity: 10000,
      unitPrice: 0.50,
      totalValue: 2500,
      supplier: 'AgriSupply Co.',
      storageLocation: 'Warehouse A',
      farmId: farm1.id
    }
  });

  const inventory2 = await prisma.inventory.create({
    data: {
      name: 'Corn Seeds',
      type: InventoryType.SEED,
      category: 'Hybrid Seeds',
      quantity: 200,
      unit: 'kg',
      minQuantity: 50,
      maxQuantity: 500,
      unitPrice: 8.00,
      totalValue: 1600,
      supplier: 'SeedMax Inc.',
      expiryDate: new Date('2025-03-01'),
      storageLocation: 'Cold Storage',
      farmId: farm1.id
    }
  });

  const inventory3 = await prisma.inventory.create({
    data: {
      name: 'Herbicide - Glyphosate',
      type: InventoryType.HERBICIDE,
      category: 'Weed Control',
      quantity: 25,
      unit: 'liters',
      minQuantity: 10,
      maxQuantity: 100,
      unitPrice: 15.00,
      totalValue: 375,
      supplier: 'ChemFarm Ltd.',
      expiryDate: new Date('2025-12-01'),
      storageLocation: 'Chemical Storage',
      farmId: farm1.id
    }
  });

  const inventory4 = await prisma.inventory.create({
    data: {
      name: 'Diesel Fuel',
      type: InventoryType.FUEL,
      category: 'Fuel',
      quantity: 2000,
      unit: 'liters',
      minQuantity: 500,
      maxQuantity: 5000,
      unitPrice: 1.20,
      totalValue: 2400,
      supplier: 'FuelDirect',
      storageLocation: 'Fuel Tank',
      farmId: farm1.id
    }
  });

  console.log('📦 Created inventory items');

  // Create equipment
  await prisma.equipment.create({
    data: {
      name: 'John Deere Tractor',
      type: 'Tractor',
      model: '8R 370',
      serialNumber: 'JD8R370-2022-001',
      purchaseDate: new Date('2022-03-15'),
      purchasePrice: 250000,
      status: 'available',
      condition: 'good',
      lastMaintenance: new Date('2024-04-01'),
      nextMaintenance: new Date('2024-07-01'),
      farmId: farm1.id
    }
  });

  await prisma.equipment.create({
    data: {
      name: 'Center Pivot Irrigator',
      type: 'Irrigator',
      model: 'Valley 8000',
      serialNumber: 'VL8000-2021-042',
      purchaseDate: new Date('2021-06-20'),
      purchasePrice: 85000,
      status: 'in_use',
      condition: 'good',
      lastMaintenance: new Date('2024-03-15'),
      nextMaintenance: new Date('2024-09-15'),
      farmId: farm1.id
    }
  });

  await prisma.equipment.create({
    data: {
      name: 'Potato Harvester',
      type: 'Harvester',
      model: 'Grimme SE 150',
      serialNumber: 'GR150-2023-008',
      purchaseDate: new Date('2023-01-10'),
      purchasePrice: 180000,
      status: 'maintenance',
      condition: 'good',
      lastMaintenance: new Date('2024-05-01'),
      nextMaintenance: new Date('2024-05-20'),
      farmId: farm2.id
    }
  });

  console.log('🚜 Created equipment');

  // Create tasks
  await prisma.task.create({
    data: {
      title: 'Inspect irrigation system',
      description: 'Check all irrigation lines for leaks and proper pressure',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2024-05-12'),
      type: 'maintenance',
      farmId: farm1.id,
      fieldId: field1.id,
      assignedToId: staff1.id,
      createdById: manager1.id
    }
  });

  await prisma.task.create({
    data: {
      title: 'Schedule potato harvest',
      description: 'Coordinate with harvesting team and equipment',
      priority: TaskPriority.URGENT,
      status: TaskStatus.PENDING,
      dueDate: new Date('2024-05-18'),
      type: 'harvesting',
      farmId: farm2.id,
      fieldId: field4.id,
      assignedToId: manager1.id,
      createdById: admin1.id
    }
  });

  await prisma.task.create({
    data: {
      title: 'Order fertilizer supply',
      description: 'Place order for additional urea fertilizer before stock runs low',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      dueDate: new Date('2024-05-20'),
      type: 'procurement',
      assignedToId: manager1.id,
      createdById: admin1.id
    }
  });

  console.log('✅ Created tasks');

  // Create notifications
  await prisma.notification.create({
    data: {
      title: 'Low Inventory Alert',
      message: 'Urea Fertilizer stock is below minimum threshold (1000kg). Current stock: 5000kg',
      type: NotificationType.INVENTORY,
      priority: 'high',
      userId: admin1.id,
      actionUrl: '/inventory',
      metadata: { inventoryId: inventory1.id, currentStock: 5000, minStock: 1000 }
    }
  });

  await prisma.notification.create({
    data: {
      title: 'Harvest Reminder',
      message: 'Potato harvest is due in 2 weeks. Please schedule equipment and labor.',
      type: NotificationType.HARVEST,
      priority: 'normal',
      userId: manager1.id,
      actionUrl: '/crops/potato-cycle',
      metadata: { cropCycleId: potatoCycle.id, harvestDate: '2024-06-01' }
    }
  });

  await prisma.notification.create({
    data: {
      title: 'Equipment Maintenance Due',
      message: 'Potato Harvester maintenance is scheduled for May 20, 2024.',
      type: NotificationType.SYSTEM,
      priority: 'normal',
      userId: manager1.id,
      actionUrl: '/equipment',
      metadata: { equipmentType: 'maintenance' }
    }
  });

  console.log('🔔 Created notifications');

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      plan: 'pro',
      status: 'active',
      currentPeriodStart: new Date('2024-05-01'),
      currentPeriodEnd: new Date('2024-06-01'),
      amount: 99.00,
      currency: 'USD',
      paymentMethod: 'card',
      userId: admin1.id,
      organizationId: org1.id
    }
  });

  await prisma.subscription.create({
    data: {
      plan: 'enterprise',
      status: 'active',
      currentPeriodStart: new Date('2024-05-01'),
      currentPeriodEnd: new Date('2024-06-01'),
      amount: 299.00,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      userId: admin2.id,
      organizationId: org2.id
    }
  });

  console.log('💳 Created subscriptions');

  // Create weather logs
  await prisma.weatherLog.create({
    data: {
      farmId: farm1.id,
      temperature: 28.5,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12.5,
      conditions: 'sunny'
    }
  });

  await prisma.weatherLog.create({
    data: {
      farmId: farm2.id,
      temperature: 27.8,
      humidity: 68,
      rainfall: 2.5,
      windSpeed: 8.2,
      conditions: 'partly cloudy'
    }
  });

  console.log('🌤️  Created weather logs');

  // Create a pest report
  await prisma.pestReport.create({
    data: {
      pestType: 'disease',
      name: 'Wheat Rust',
      severity: 'medium',
      description: 'Early signs of wheat rust detected in South Field',
      affectedArea: 5,
      cropCycleId: wheatCycle.id,
      reportedById: staff1.id,
      status: 'open',
      treatment: 'Scheduled fungicide application'
    }
  });

  console.log('🐛 Created pest reports');

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   Organizations: 3`);
  console.log(`   Users: 5`);
  console.log(`   Farms: 2`);
  console.log(`   Fields: 4`);
  console.log(`   Crops: 4`);
  console.log(`   Crop Cycles: 3`);
  console.log(`   Activities: 3`);
  console.log(`   Inventory Items: 4`);
  console.log(`   Equipment: 3`);
  console.log(`   Tasks: 3`);
  console.log(`   Notifications: 3`);
  console.log('');
  console.log('🔑 Demo Credentials:');
  console.log('   Email: admin@sunnyacres.com / Password: password123');
  console.log('   Email: demo@example.com / Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });