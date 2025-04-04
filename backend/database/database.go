package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"utility-backend/models"
)

var DB *gorm.DB

// InitDB initializes the database connection based on environment variables
func InitDB() error {
	var err error
	dbType := os.Getenv("DB_TYPE")

	switch dbType {
	case "postgres":
		// PostgreSQL connection
		dsn := fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_PORT"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
		)
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	case "sqlite", "":
		// Default to SQLite for development or if not specified
		DB, err = gorm.Open(sqlite.Open("utility.db"), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	default:
		return fmt.Errorf("unsupported database type: %s", dbType)
	}

	if err != nil {
		return err
	}

	// Auto-migrate database models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Client{},
		&models.UtilityData{},
	)
	if err != nil {
		return err
	}

	// Seed initial data if database is empty
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		log.Println("Seeding initial data...")
		seedData()
	}

	return nil
}

// seedData creates initial data for the application
func seedData() {
	// Create admin and operator users
	users := []models.User{
		{
			Username: "admin",
			Password: "admin",
			Role:     "admin",
		},
		{
			Username: "operator",
			Password: "operator",
			Role:     "operator",
		},
		{
			Username: "line_user",
			Password: "line_password",
			Role:     "operator",
		},
	}

	for _, user := range users {
		// Hash password in a real application
		user.HashPassword()
		DB.Create(&user)
	}

	// Create sample clients
	clients := []models.Client{
		{
			Name:        "Site A (Manufacturing)",
			PlotNumber:  "A-101",
			Industry:    "Manufacturing",
			Status:      "good",
			Latitude:    13.736717,
			Longitude:   100.523186,
			ContactName: "John Smith",
			Email:       "john.smith@example.com",
			Phone:       "+66 2 123 4567",
		},
		{
			Name:        "Site B (Storage)",
			PlotNumber:  "B-201",
			Industry:    "Logistics",
			Status:      "warning",
			Latitude:    13.740061,
			Longitude:   100.529794,
			ContactName: "Jane Doe",
			Email:       "jane.doe@example.com",
			Phone:       "+66 2 234 5678",
		},
		{
			Name:        "Site C (Assembly)",
			PlotNumber:  "C-301",
			Industry:    "Electronics",
			Status:      "good",
			Latitude:    13.731690,
			Longitude:   100.521126,
			ContactName: "Bob Johnson",
			Email:       "bob.johnson@example.com",
			Phone:       "+66 2 345 6789",
		},
		{
			Name:        "Site D (Office)",
			PlotNumber:  "D-401",
			Industry:    "Services",
			Status:      "danger",
			Latitude:    13.746262,
			Longitude:   100.535211,
			ContactName: "Sarah Williams",
			Email:       "sarah.williams@example.com",
			Phone:       "+66 2 456 7890",
		},
	}

	for _, client := range clients {
		DB.Create(&client)
	}

	// Create sample utility data
	for clientID := uint(1); clientID <= 4; clientID++ {
		for day := 1; day <= 30; day++ {
			waterUsage := 150 + (day % 10) * 20 // Simulate some variation
			pacUsage := 5 + (day % 5)
			polymerUsage := 2 + (day % 3)
			chlorineUsage := 1 + (day % 2)

			utilityData := models.UtilityData{
				ClientID:      clientID,
				Date:          fmt.Sprintf("2023-03-%02d", day),
				WaterUsage:    float64(waterUsage),
				PacUsage:      float64(pacUsage),
				PolymerUsage:  float64(polymerUsage),
				ChlorineUsage: float64(chlorineUsage),
				Notes:         "",
			}

			DB.Create(&utilityData)
		}
	}
} 