package handlers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"

	"utility-backend/database"
	"utility-backend/models"
)

// GetClient returns detailed information for a specific client
func GetClient(c *fiber.Ctx) error {
	// Get client ID from URL parameter
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Client ID is required",
		})
	}

	// Convert ID to integer
	clientID, err := strconv.Atoi(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid client ID format",
		})
	}

	// Get client from database
	var client models.Client
	result := database.DB.First(&client, clientID)
	if result.Error != nil {
		// Return mock data for demo purposes
		return c.Status(fiber.StatusOK).JSON(getMockClientDetails(clientID))
	}

	// Get utility data for this client
	var utilityData []models.UtilityData
	database.DB.Where("client_id = ?", clientID).Order("date").Find(&utilityData)

	// If no utility data found, return mock data
	if len(utilityData) == 0 {
		return c.Status(fiber.StatusOK).JSON(getMockClientDetails(clientID))
	}

	// Prepare response
	response := models.ClientDetailResponse{
		ID:            client.ID,
		Name:          client.Name,
		Company:       "Industrial Solutions Co., Ltd.", // Mock company name
		PlotNumber:    client.PlotNumber,
		Industry:      client.Industry,
		Status:        client.Status,
		ContactPerson: client.ContactName,
		Position:      client.Position,
		Email:         client.Email,
		Phone:         client.Phone,
		ContractStart: "01 Jan 2023", // Mock contract dates
		ContractEnd:   "31 Dec 2025",
	}

	// Fill summary data
	var totalWaterUsage, totalChemicalUsage float64
	for _, data := range utilityData {
		totalWaterUsage += data.WaterUsage
		totalChemicalUsage += data.PacUsage + data.PolymerUsage + data.ChlorineUsage
	}

	response.Summary.WaterMonthlyAvg = totalWaterUsage / float64(len(utilityData))
	response.Summary.ChemicalMonthlyAvg = totalChemicalUsage / float64(len(utilityData))
	response.Summary.LastInspection = "15 Mar 2023" // Mock inspection dates
	response.Summary.NextInspection = "15 Jun 2023"

	// Prepare chart data
	// Limit to last 30 entries if there are more
	dataLength := len(utilityData)
	if dataLength > 30 {
		utilityData = utilityData[dataLength-30:]
		dataLength = 30
	}

	response.WaterUsage.Labels = make([]string, dataLength)
	response.WaterUsage.Data = make([]float64, dataLength)
	response.ChemicalUsage.Labels = make([]string, dataLength)
	response.ChemicalUsage.Pac = make([]float64, dataLength)
	response.ChemicalUsage.Polymer = make([]float64, dataLength)
	response.ChemicalUsage.Chlorine = make([]float64, dataLength)

	for i, data := range utilityData {
		// Format date for label
		t, err := time.Parse("2006-01-02", data.Date)
		if err != nil {
			response.WaterUsage.Labels[i] = data.Date
		} else {
			response.WaterUsage.Labels[i] = t.Format("Jan 2")
		}

		response.ChemicalUsage.Labels[i] = response.WaterUsage.Labels[i]
		response.WaterUsage.Data[i] = data.WaterUsage
		response.ChemicalUsage.Pac[i] = data.PacUsage
		response.ChemicalUsage.Polymer[i] = data.PolymerUsage
		response.ChemicalUsage.Chlorine[i] = data.ChlorineUsage
	}

	// Add mock notes
	response.Notes = []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	}{
		{
			Type:    "info",
			Title:   "Routine Maintenance",
			Message: "Scheduled maintenance completed on water treatment system",
			Date:    "02 Apr 2023",
		},
		{
			Type:    "warning",
			Title:   "Chemical Usage Increase",
			Message: "PAC usage has increased by 15% compared to last month",
			Date:    "28 Mar 2023",
		},
	}

	// Prepare table data (last 7 days)
	tableLength := 7
	if dataLength < 7 {
		tableLength = dataLength
	}

	startIdx := dataLength - tableLength
	response.TableData = make([]struct {
		Date     string  `json:"date"`
		Water    float64 `json:"water"`
		Pac      float64 `json:"pac"`
		Polymer  float64 `json:"polymer"`
		Chlorine float64 `json:"chlorine"`
	}, tableLength)

	for i := 0; i < tableLength; i++ {
		idx := startIdx + i
		data := utilityData[idx]

		// Format date for table
		t, err := time.Parse("2006-01-02", data.Date)
		dateStr := data.Date
		if err == nil {
			dateStr = t.Format("Jan 2, 2006")
		}

		response.TableData[i] = struct {
			Date     string  `json:"date"`
			Water    float64 `json:"water"`
			Pac      float64 `json:"pac"`
			Polymer  float64 `json:"polymer"`
			Chlorine float64 `json:"chlorine"`
		}{
			Date:     dateStr,
			Water:    data.WaterUsage,
			Pac:      data.PacUsage,
			Polymer:  data.PolymerUsage,
			Chlorine: data.ChlorineUsage,
		}
	}

	// Add mock documents
	response.Documents = []struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		DateAdded   string `json:"dateAdded"`
		FileSize    string `json:"fileSize"`
	}{
		{
			Name:        "Service Contract 2023-2025.pdf",
			Description: "Utility service contract with terms and conditions",
			DateAdded:   "01 Jan 2023",
			FileSize:    "2.4 MB",
		},
		{
			Name:        "Water Quality Report - Q1 2023.pdf",
			Description: "Quarterly water quality analysis report",
			DateAdded:   "05 Apr 2023",
			FileSize:    "1.8 MB",
		},
		{
			Name:        "Maintenance Schedule 2023.xlsx",
			Description: "Annual maintenance schedule for water treatment facilities",
			DateAdded:   "10 Jan 2023",
			FileSize:    "845 KB",
		},
	}

	// Return the response
	return c.Status(fiber.StatusOK).JSON(response)
}

// Helper function for mock client data
func getMockClientDetails(id int) models.ClientDetailResponse {
	// Generate mock client details
	response := models.ClientDetailResponse{
		ID:            uint(id),
		Name:          fmt.Sprintf("Site %s (Client Site)", string(rune(64+id))),
		Company:       "Industrial Solutions Co., Ltd.",
		PlotNumber:    fmt.Sprintf("%s-10%d", string(rune(64+id)), id),
		Industry:      "Manufacturing",
		Status:        []string{"good", "warning", "danger"}[id%3],
		ContactPerson: "John Smith",
		Position:      "Facility Manager",
		Email:         "john.smith@example.com",
		Phone:         "+66 2 123 4567",
		ContractStart: "01 Jan 2023",
		ContractEnd:   "31 Dec 2025",
	}

	// Set summary data
	response.Summary.WaterMonthlyAvg = 750.5
	response.Summary.ChemicalMonthlyAvg = 45.2
	response.Summary.LastInspection = "15 Mar 2023"
	response.Summary.NextInspection = "15 Jun 2023"

	// Generate data for the last 30 days
	now := time.Now()
	daysInMonth := 30

	labels := make([]string, daysInMonth)
	waterData := make([]float64, daysInMonth)
	pacData := make([]float64, daysInMonth)
	polymerData := make([]float64, daysInMonth)
	chlorineData := make([]float64, daysInMonth)

	for i := 0; i < daysInMonth; i++ {
		date := now.AddDate(0, 0, i-daysInMonth+1)
		labels[i] = date.Format("Jan 2")

		// Generate random data with some patterns
		waterData[i] = 50.0 + float64(i*5) + float64(id*10)
		pacData[i] = 2.0 + float64(i%5) + float64(id%3)
		polymerData[i] = 1.0 + float64(i%3) + float64(id%2)
		chlorineData[i] = 0.5 + float64(i%2) + float64(id%2)
	}

	response.WaterUsage.Labels = labels
	response.WaterUsage.Data = waterData
	response.ChemicalUsage.Labels = labels
	response.ChemicalUsage.Pac = pacData
	response.ChemicalUsage.Polymer = polymerData
	response.ChemicalUsage.Chlorine = chlorineData

	// Add mock notes
	response.Notes = []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	}{
		{
			Type:    "info",
			Title:   "Routine Maintenance",
			Message: "Scheduled maintenance completed on water treatment system",
			Date:    "02 Apr 2023",
		},
		{
			Type:    "warning",
			Title:   "Chemical Usage Increase",
			Message: "PAC usage has increased by 15% compared to last month",
			Date:    "28 Mar 2023",
		},
	}

	// Generate table data for the last 7 days
	response.TableData = make([]struct {
		Date     string  `json:"date"`
		Water    float64 `json:"water"`
		Pac      float64 `json:"pac"`
		Polymer  float64 `json:"polymer"`
		Chlorine float64 `json:"chlorine"`
	}, 7)

	for i := 0; i < 7; i++ {
		date := now.AddDate(0, 0, i-6)
		dateStr := date.Format("Jan 2, 2006")

		response.TableData[i] = struct {
			Date     string  `json:"date"`
			Water    float64 `json:"water"`
			Pac      float64 `json:"pac"`
			Polymer  float64 `json:"polymer"`
			Chlorine float64 `json:"chlorine"`
		}{
			Date:     dateStr,
			Water:    50.0 + float64(i*20) + float64(id*5),
			Pac:      2.0 + float64(i%5) + float64(id%3),
			Polymer:  1.0 + float64(i%3) + float64(id%2),
			Chlorine: 0.5 + float64(i%2) + float64(id%2),
		}
	}

	// Add mock documents
	response.Documents = []struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		DateAdded   string `json:"dateAdded"`
		FileSize    string `json:"fileSize"`
	}{
		{
			Name:        "Service Contract 2023-2025.pdf",
			Description: "Utility service contract with terms and conditions",
			DateAdded:   "01 Jan 2023",
			FileSize:    "2.4 MB",
		},
		{
			Name:        "Water Quality Report - Q1 2023.pdf",
			Description: "Quarterly water quality analysis report",
			DateAdded:   "05 Apr 2023",
			FileSize:    "1.8 MB",
		},
		{
			Name:        "Maintenance Schedule 2023.xlsx",
			Description: "Annual maintenance schedule for water treatment facilities",
			DateAdded:   "10 Jan 2023",
			FileSize:    "845 KB",
		},
	}

	return response
} 