// MongoDB Schema and Sample Data for Utility Monitoring System

// Create Users Collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password", "role"],
      properties: {
        username: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        password: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        role: {
          bsonType: "string",
          enum: ["admin", "operator"],
          description: "Must be either 'admin' or 'operator' and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the user was created"
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the user was last updated"
        }
      }
    }
  }
});

// Create Clients Collection
db.createCollection("clients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "status"],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        address: {
          bsonType: "string",
          description: "Must be a string"
        },
        contactPerson: {
          bsonType: "string",
          description: "Must be a string"
        },
        contactEmail: {
          bsonType: "string",
          description: "Must be a string"
        },
        contactPhone: {
          bsonType: "string",
          description: "Must be a string"
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive"],
          description: "Must be either 'active' or 'inactive' and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the client was created"
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the client was last updated"
        }
      }
    }
  }
});

// Create Sites Collection
db.createCollection("sites", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["clientId", "name", "status"],
      properties: {
        clientId: {
          bsonType: "objectId",
          description: "Must be an objectId and is required"
        },
        name: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        location: {
          bsonType: "string",
          description: "Must be a string"
        },
        zoneId: {
          bsonType: "string",
          description: "Must be a string"
        },
        status: {
          bsonType: "string",
          enum: ["good", "warning", "danger"],
          description: "Must be one of 'good', 'warning', or 'danger' and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the site was created"
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the site was last updated"
        }
      }
    }
  }
});

// Create Utility Readings Collection
db.createCollection("utilityReadings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["siteId", "readingDate"],
      properties: {
        siteId: {
          bsonType: "objectId",
          description: "Must be an objectId and is required"
        },
        readingDate: {
          bsonType: "date",
          description: "Must be a date and is required"
        },
        waterUsage: {
          bsonType: "double",
          description: "Must be a double"
        },
        pacUsage: {
          bsonType: "double",
          description: "Must be a double"
        },
        polymerUsage: {
          bsonType: "double",
          description: "Must be a double"
        },
        chlorineUsage: {
          bsonType: "double",
          description: "Must be a double"
        },
        notes: {
          bsonType: "string",
          description: "Must be a string"
        },
        recordedBy: {
          bsonType: "objectId",
          description: "Must be an objectId"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the reading was created"
        }
      }
    }
  }
});

// Create Zones Collection
db.createCollection("zones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["zoneId", "name", "shapeType", "coordinates", "status"],
      properties: {
        zoneId: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        name: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        shapeType: {
          bsonType: "string",
          enum: ["polygon", "circle", "rectangle"],
          description: "Must be one of 'polygon', 'circle', or 'rectangle' and is required"
        },
        coordinates: {
          bsonType: "array",
          description: "Must be an array and is required",
          items: {
            bsonType: "object",
            required: ["x", "y"],
            properties: {
              x: {
                bsonType: "double",
                description: "Must be a double and is required"
              },
              y: {
                bsonType: "double",
                description: "Must be a double and is required"
              }
            }
          }
        },
        status: {
          bsonType: "string",
          enum: ["good", "warning", "danger"],
          description: "Must be one of 'good', 'warning', or 'danger' and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the zone was created"
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the zone was last updated"
        }
      }
    }
  }
});

// Create Alerts Collection
db.createCollection("alerts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["siteId", "alertType", "message", "status"],
      properties: {
        siteId: {
          bsonType: "objectId",
          description: "Must be an objectId and is required"
        },
        alertType: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        message: {
          bsonType: "string",
          description: "Must be a string and is required"
        },
        status: {
          bsonType: "string",
          enum: ["active", "resolved"],
          description: "Must be either 'active' or 'resolved' and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "Date when the alert was created"
        },
        resolvedAt: {
          bsonType: "date",
          description: "Date when the alert was resolved"
        }
      }
    }
  }
});

// Insert Sample Users
db.users.insertMany([
  {
    username: "admin",
    password: "$2a$10$qJIAlzjH6VxnVOm.f5Veru5aTGGGMEZh39m1h7jUlxK3MS9MSywPW", // password: admin
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "operator",
    password: "$2a$10$qJIAlzjH6VxnVOm.f5Veru5aTGGGMEZh39m1h7jUlxK3MS9MSywPW", // password: operator
    role: "operator",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get User IDs for Reference
const adminUser = db.users.findOne({ username: "admin" });

// Insert Sample Clients
db.clients.insertMany([
  {
    name: "Thai Eastern Industrial Park",
    address: "88 Moo 5, Pluakdaeng, Rayong 21140",
    contactPerson: "Somchai Jaidee",
    contactEmail: "somchai@example.com",
    contactPhone: "0812345678",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Map Ta Phut Industrial Estate",
    address: "9 I-7 Road, Map Ta Phut, Muang, Rayong 21150",
    contactPerson: "Wichai Sangtong",
    contactEmail: "wichai@example.com",
    contactPhone: "0823456789",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Amata City Chonburi",
    address: "700/2 Moo 1, Klong Tamru, Muang, Chonburi 20000",
    contactPerson: "Malee Rakdee",
    contactEmail: "malee@example.com",
    contactPhone: "0834567890",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get Client IDs for Reference
const thaiEastern = db.clients.findOne({ name: "Thai Eastern Industrial Park" });
const mapTaPhut = db.clients.findOne({ name: "Map Ta Phut Industrial Estate" });
const amataCity = db.clients.findOne({ name: "Amata City Chonburi" });

// Insert Sample Sites
db.sites.insertMany([
  {
    clientId: thaiEastern._id,
    name: "Factory A1",
    location: "Zone A, Plot 1",
    zoneId: "A1",
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: thaiEastern._id,
    name: "Factory A2",
    location: "Zone A, Plot 2",
    zoneId: "A2",
    status: "warning",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: thaiEastern._id,
    name: "Factory B1",
    location: "Zone B, Plot 1",
    zoneId: "B1",
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: thaiEastern._id,
    name: "Factory B2",
    location: "Zone B, Plot 2",
    zoneId: "B2",
    status: "danger",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: mapTaPhut._id,
    name: "Chemical Plant 1",
    location: "Zone C, Plot 1",
    zoneId: "C1",
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: mapTaPhut._id,
    name: "Chemical Plant 2",
    location: "Zone C, Plot 2",
    zoneId: "C2",
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: amataCity._id,
    name: "Assembly Line 1",
    location: "Zone D, Plot 1",
    zoneId: "D1",
    status: "warning",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: amataCity._id,
    name: "Assembly Line 2",
    location: "Zone D, Plot 2",
    zoneId: "D2",
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Get Site IDs for Reference
const factoryA1 = db.sites.findOne({ name: "Factory A1" });
const factoryA2 = db.sites.findOne({ name: "Factory A2" });
const factoryB2 = db.sites.findOne({ name: "Factory B2" });
const assemblyLine1 = db.sites.findOne({ name: "Assembly Line 1" });

// Insert Sample Zones
db.zones.insertMany([
  {
    zoneId: "A1",
    name: "Factory A1",
    shapeType: "polygon",
    coordinates: [
      { x: 100, y: 100 },
      { x: 150, y: 100 },
      { x: 150, y: 150 },
      { x: 100, y: 150 }
    ],
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    zoneId: "A2",
    name: "Factory A2",
    shapeType: "polygon",
    coordinates: [
      { x: 160, y: 100 },
      { x: 210, y: 100 },
      { x: 210, y: 150 },
      { x: 160, y: 150 }
    ],
    status: "warning",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    zoneId: "B1",
    name: "Factory B1",
    shapeType: "polygon",
    coordinates: [
      { x: 100, y: 160 },
      { x: 150, y: 160 },
      { x: 150, y: 210 },
      { x: 100, y: 210 }
    ],
    status: "good",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    zoneId: "B2",
    name: "Factory B2",
    shapeType: "polygon",
    coordinates: [
      { x: 160, y: 160 },
      { x: 210, y: 160 },
      { x: 210, y: 210 },
      { x: 160, y: 210 }
    ],
    status: "danger",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... more zones ...
]);

// Insert Sample Utility Readings (for Factory A1)
const now = new Date();
const readings = [];

for (let i = 30; i >= 1; i--) {
  const date = new Date(now);
  date.setDate(date.getDate() - i);
  
  // Fluctuating values for realistic data
  const baseWater = 120;
  const basePac = 15;
  const basePolymer = 5;
  const baseChlorine = 2;
  
  const waterVariation = Math.random() * 15 - 5; // -5 to +10
  const pacVariation = Math.random() * 2 - 0.5;  // -0.5 to +1.5
  const polymerVariation = Math.random() * 1 - 0.3; // -0.3 to +0.7
  const chlorineVariation = Math.random() * 0.5 - 0.1; // -0.1 to +0.4
  
  readings.push({
    siteId: factoryA1._id,
    readingDate: date,
    waterUsage: parseFloat((baseWater + waterVariation).toFixed(2)),
    pacUsage: parseFloat((basePac + pacVariation).toFixed(2)),
    polymerUsage: parseFloat((basePolymer + polymerVariation).toFixed(2)),
    chlorineUsage: parseFloat((baseChlorine + chlorineVariation).toFixed(2)),
    notes: i % 7 === 0 ? "Higher than normal usage" : "Normal operation",
    recordedBy: adminUser._id,
    createdAt: date
  });
}

db.utilityReadings.insertMany(readings);

// Insert Sample Alerts
db.alerts.insertMany([
  {
    siteId: factoryA2._id,
    alertType: "High Water Usage",
    message: "Water usage exceeds expected levels by 15%",
    status: "active",
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    resolvedAt: null
  },
  {
    siteId: factoryB2._id,
    alertType: "Chemical Imbalance",
    message: "PAC levels critical",
    status: "active",
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    resolvedAt: null
  },
  {
    siteId: assemblyLine1._id,
    alertType: "Low Chlorine",
    message: "Chlorine levels below minimum threshold",
    status: "resolved",
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    resolvedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
]); 