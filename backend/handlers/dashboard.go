package handlers

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/gofiber/fiber/v2"

	"utility-backend/database"
	"utility-backend/models"
)

// GetDashboardData returns summarized utility data for the dashboard
func GetDashboardData(c *fiber.Ctx) error {
	// Get total water usage
	var totalWaterUsage float64
	database.DB.Model(&models.UtilityData{}).Select("SUM(water_usage)").Scan(&totalWaterUsage)

	// Get total chemical usage
	var totalPacUsage, totalPolymerUsage, totalChlorineUsage float64
	database.DB.Model(&models.UtilityData{}).Select("SUM(pac_usage)").Scan(&totalPacUsage)
	database.DB.Model(&models.UtilityData{}).Select("SUM(polymer_usage)").Scan(&totalPolymerUsage)
	database.DB.Model(&models.UtilityData{}).Select("SUM(chlorine_usage)").Scan(&totalChlorineUsage)

	// Get data for the last 30 days
	var utilityData []models.UtilityData
	database.DB.Order("date desc").Limit(30).Find(&utilityData)

	// If no data is found, use mock data for demo
	if len(utilityData) == 0 {
		return c.Status(fiber.StatusOK).JSON(getMockDashboardData())
	}

	// Prepare dashboard data
	dashboardData := models.DashboardData{}

	// Fill summary data
	dashboardData.Summary.TotalWaterUsage = totalWaterUsage
	dashboardData.Summary.WaterChange = 3.5 // Mock value - would calculate from previous period in real app
	dashboardData.Summary.TotalPacUsage = totalPacUsage
	dashboardData.Summary.AvgPacUsage = totalPacUsage / float64(len(utilityData))
	dashboardData.Summary.TotalPolymerUsage = totalPolymerUsage
	dashboardData.Summary.AvgPolymerUsage = totalPolymerUsage / float64(len(utilityData))
	dashboardData.Summary.TotalChlorineUsage = totalChlorineUsage
	dashboardData.Summary.AvgChlorineUsage = totalChlorineUsage / float64(len(utilityData))

	// Prepare chart data - need to reverse as we want date ascending
	// Sort utilityData by date (ascending)
	length := len(utilityData)
	labels := make([]string, length)
	waterData := make([]float64, length)
	pacData := make([]float64, length)
	polymerData := make([]float64, length)
	chlorineData := make([]float64, length)

	for i, data := range utilityData {
		// Reverse index to get ascending order by date
		j := length - i - 1
		
		// Parse date string to time
		t, err := time.Parse("2006-01-02", data.Date)
		if err != nil {
			// If date parsing fails, use index
			labels[j] = fmt.Sprintf("Day %d", j+1)
		} else {
			// Format date as MMM D
			labels[j] = t.Format("Jan 2")
		}
		
		waterData[j] = data.WaterUsage
		pacData[j] = data.PacUsage
		polymerData[j] = data.PolymerUsage
		chlorineData[j] = data.ChlorineUsage
	}

	dashboardData.WaterUsage.Labels = labels
	dashboardData.WaterUsage.Data = waterData

	dashboardData.ChemicalUsage.Labels = labels
	dashboardData.ChemicalUsage.Pac = pacData
	dashboardData.ChemicalUsage.Polymer = polymerData
	dashboardData.ChemicalUsage.Chlorine = chlorineData

	// Add mock alerts for demo
	dashboardData.Alerts = []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	}{
		{
			Type:    "danger",
			Title:   "High Water Usage",
			Message: "Zone B water usage exceeds normal by 25%. Please investigate.",
			Date:    time.Now().Format("2006-01-02"),
		},
		{
			Type:    "warning",
			Title:   "PAC Supply Low",
			Message: "PAC inventory is below the minimum threshold. Please reorder.",
			Date:    time.Now().Format("2006-01-02"),
		},
		{
			Type:    "info",
			Title:   "Maintenance Schedule",
			Message: "Routine equipment maintenance scheduled for next Monday.",
			Date:    time.Now().Format("2006-01-02"),
		},
	}

	return c.Status(fiber.StatusOK).JSON(dashboardData)
}

// getMockDashboardData returns mock data for the dashboard when no real data is available
func getMockDashboardData() models.DashboardData {
	// Mock data for demo purposes
	dashboardData := models.DashboardData{}

	// Set mock summary data
	dashboardData.Summary.TotalWaterUsage = 12542
	dashboardData.Summary.WaterChange = 3.5
	dashboardData.Summary.TotalPacUsage = 345
	dashboardData.Summary.AvgPacUsage = 11.5
	dashboardData.Summary.TotalPolymerUsage = 127
	dashboardData.Summary.AvgPolymerUsage = 4.2
	dashboardData.Summary.TotalChlorineUsage = 89
	dashboardData.Summary.AvgChlorineUsage = 3.0

	// Generate dates for the last 30 days
	now := time.Now()
	labels := make([]string, 30)
	waterData := make([]float64, 30)
	pacData := make([]float64, 30)
	polymerData := make([]float64, 30)
	chlorineData := make([]float64, 30)

	for i := 0; i < 30; i++ {
		date := now.AddDate(0, 0, i-29)
		labels[i] = date.Format("Jan 2")
		
		// Generate random data with some patterns
		waterData[i] = 200 + rand.Float64()*100
		pacData[i] = 5 + rand.Float64()*10
		polymerData[i] = 2 + rand.Float64()*6
		chlorineData[i] = 1 + rand.Float64()*4
	}

	dashboardData.WaterUsage.Labels = labels
	dashboardData.WaterUsage.Data = waterData

	dashboardData.ChemicalUsage.Labels = labels
	dashboardData.ChemicalUsage.Pac = pacData
	dashboardData.ChemicalUsage.Polymer = polymerData
	dashboardData.ChemicalUsage.Chlorine = chlorineData

	// Add mock alerts
	dashboardData.Alerts = []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	}{
		{
			Type:    "danger",
			Title:   "High Water Usage",
			Message: "Zone B water usage exceeds normal by 25%. Please investigate.",
			Date:    now.Format("2006-01-02"),
		},
		{
			Type:    "warning",
			Title:   "PAC Supply Low",
			Message: "PAC inventory is below the minimum threshold. Please reorder.",
			Date:    now.Format("2006-01-02"),
		},
		{
			Type:    "info",
			Title:   "Maintenance Schedule",
			Message: "Routine equipment maintenance scheduled for next Monday.",
			Date:    now.Format("2006-01-02"),
		},
	}

	return dashboardData
} 