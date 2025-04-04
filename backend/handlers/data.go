package handlers

import (
	"github.com/gofiber/fiber/v2"

	"utility-backend/database"
	"utility-backend/models"
)

// SubmitDataRequest represents the structure of the submit data request
type SubmitDataRequest struct {
	SiteID       uint    `json:"siteId"`
	Date         string  `json:"date"`
	WaterMeter   float64 `json:"waterMeter"`
	Pac          float64 `json:"pac"`
	Polymer      float64 `json:"polymer"`
	Chlorine     float64 `json:"chlorine"`
	Notes        string  `json:"notes"`
}

// SubmitData handles the submission of utility data
func SubmitData(c *fiber.Ctx) error {
	// Check if the user is authorized (operator or admin)
	role := c.Locals("role")
	if role != "operator" && role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "Insufficient permissions",
		})
	}

	// Parse request body
	var req SubmitDataRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	// Validate input
	if req.SiteID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Site ID is required",
		})
	}

	if req.Date == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Date is required",
		})
	}

	// Check if the client exists
	var client models.Client
	result := database.DB.First(&client, req.SiteID)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Site not found",
		})
	}

	// Create utility data record
	utilityData := models.UtilityData{
		ClientID:      req.SiteID,
		Date:          req.Date,
		WaterUsage:    req.WaterMeter,
		PacUsage:      req.Pac,
		PolymerUsage:  req.Polymer,
		ChlorineUsage: req.Chlorine,
		Notes:         req.Notes,
	}

	// Save to database
	result = database.DB.Create(&utilityData)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to save data: " + result.Error.Error(),
		})
	}

	// Return success response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Data submitted successfully",
		"data": utilityData,
	})
} 