package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"utility-backend/database"
	"utility-backend/models"
)

// GetMapData returns data for the interactive site map
func GetMapData(c *fiber.Ctx) error {
	// Get all clients
	var clients []models.Client
	result := database.DB.Find(&clients)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to load clients: " + result.Error.Error(),
		})
	}

	// If no clients found, return mock data
	if len(clients) == 0 {
		return c.Status(fiber.StatusOK).JSON(getMockMapData())
	}

	// Prepare map data
	mapData := models.MapData{
		TotalSites:  len(clients),
		ActiveSites: len(clients), // Assuming all are active
		Stats: struct {
			Normal   int `json:"normal"`
			Warnings int `json:"warnings"`
			Critical int `json:"critical"`
		}{
			Normal:   0,
			Warnings: 0,
			Critical: 0,
		},
		Sites: make([]models.MapSite, len(clients)),
	}

	// Populate sites and stats
	for i, client := range clients {
		// Count status types
		switch client.Status {
		case "good":
			mapData.Stats.Normal++
		case "warning":
			mapData.Stats.Warnings++
		case "danger":
			mapData.Stats.Critical++
		}

		// Get utility data for this client (last 7 days)
		var utilityData []models.UtilityData
		database.DB.Where("client_id = ?", client.ID).Order("date desc").Limit(7).Find(&utilityData)

		// Prepare usage history
		usageHistory := make([]models.Usage, len(utilityData))
		for j, data := range utilityData {
			// Convert date to readable format
			t, err := time.Parse("2006-01-02", data.Date)
			dateStr := data.Date
			if err == nil {
				dateStr = t.Format("Jan 2")
			}

			// Reverse order for ascending dates
			k := len(utilityData) - j - 1
			usageHistory[k] = models.Usage{
				Date:  dateStr,
				Value: data.WaterUsage,
			}
		}

		// If no utility data found, use mock data
		if len(usageHistory) == 0 {
			usageHistory = getMockUsageHistory()
		}

		// Add site to map data
		mapData.Sites[i] = models.MapSite{
			ID:           client.ID,
			Name:         client.Name,
			PlotNumber:   client.PlotNumber,
			Latitude:     client.Latitude,
			Longitude:    client.Longitude,
			Status:       client.Status,
			UsageHistory: usageHistory,
		}
	}

	// Return map data
	return c.Status(fiber.StatusOK).JSON(mapData)
}

// Helper functions for mock data
func getMockMapData() models.MapData {
	// Create mock map data
	mapData := models.MapData{
		TotalSites:  16,
		ActiveSites: 14,
		Stats: struct {
			Normal   int `json:"normal"`
			Warnings int `json:"warnings"`
			Critical int `json:"critical"`
		}{
			Normal:   10,
			Warnings: 3,
			Critical: 1,
		},
		Sites: []models.MapSite{
			{
				ID:           1,
				Name:         "Site A (Manufacturing)",
				PlotNumber:   "A-101",
				Latitude:     13.736717,
				Longitude:    100.523186,
				Status:       "good",
				UsageHistory: getMockUsageHistory(),
			},
			{
				ID:           2,
				Name:         "Site B (Storage)",
				PlotNumber:   "B-201",
				Latitude:     13.740061,
				Longitude:    100.529794,
				Status:       "warning",
				UsageHistory: getMockUsageHistory(),
			},
			{
				ID:           3,
				Name:         "Site C (Assembly)",
				PlotNumber:   "C-301",
				Latitude:     13.731690,
				Longitude:    100.521126,
				Status:       "good",
				UsageHistory: getMockUsageHistory(),
			},
			{
				ID:           4,
				Name:         "Site D (Office)",
				PlotNumber:   "D-401",
				Latitude:     13.746262,
				Longitude:    100.535211,
				Status:       "danger",
				UsageHistory: getMockUsageHistory(),
			},
		},
	}

	return mapData
}

func getMockUsageHistory() []models.Usage {
	// Generate usage history for the last 7 days
	now := time.Now()
	history := make([]models.Usage, 7)

	for i := 0; i < 7; i++ {
		date := now.AddDate(0, 0, i-6)
		value := 50.0 + float64(i*20)

		history[i] = models.Usage{
			Date:  date.Format("Jan 2"),
			Value: value,
		}
	}

	return history
} 