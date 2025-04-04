package models

import (
	"gorm.io/gorm"
)

// User represents an application user with role-based access
type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null" json:"username"`
	Password string `gorm:"not null" json:"-"`
	Role     string `gorm:"not null;default:'operator'" json:"role"` // admin or operator
}

// Client represents an industrial park client with utility monitoring
type Client struct {
	gorm.Model
	Name        string  `gorm:"not null" json:"name"`
	PlotNumber  string  `gorm:"not null" json:"plotNumber"`
	Industry    string  `json:"industry"`
	Status      string  `gorm:"default:'good'" json:"status"` // good, warning, danger
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	ContactName string  `json:"contactName"`
	Position    string  `json:"position"`
	Email       string  `json:"email"`
	Phone       string  `json:"phone"`
	Notes       string  `json:"notes"`

	// Relationships
	UtilityData []UtilityData `gorm:"foreignKey:ClientID" json:"-"`
}

// UtilityData represents daily utility usage records
type UtilityData struct {
	gorm.Model
	ClientID      uint    `gorm:"not null" json:"clientId"`
	Date          string  `gorm:"not null" json:"date"` // YYYY-MM-DD format
	WaterUsage    float64 `json:"waterUsage"`           // in cubic meters
	PacUsage      float64 `json:"pacUsage"`             // in kg
	PolymerUsage  float64 `json:"polymerUsage"`         // in kg
	ChlorineUsage float64 `json:"chlorineUsage"`        // in kg
	Notes         string  `json:"notes"`
}

// HashPassword applies password hashing (simplified for demo)
func (u *User) HashPassword() {
	// In a real application, use a proper hashing algorithm
	// For demo purposes, we'll keep the password as is
}

// CheckPassword verifies the provided password (simplified for demo)
func (u *User) CheckPassword(password string) bool {
	// In a real application, use a proper password verification
	// For demo purposes, we'll do a direct comparison
	return u.Password == password
}

// ClientWithStats extends Client with usage statistics
type ClientWithStats struct {
	Client
	WaterMonthlyAvg    float64 `json:"waterMonthlyAvg"`
	ChemicalMonthlyAvg float64 `json:"chemicalMonthlyAvg"`
	LastInspection     string  `json:"lastInspection"`
	NextInspection     string  `json:"nextInspection"`
}

// DashboardData represents the data structure for the dashboard API
type DashboardData struct {
	Summary struct {
		TotalWaterUsage    float64 `json:"totalWaterUsage"`
		WaterChange        float64 `json:"waterChange"`
		TotalPacUsage      float64 `json:"totalPacUsage"`
		AvgPacUsage        float64 `json:"avgPacUsage"`
		TotalPolymerUsage  float64 `json:"totalPolymerUsage"`
		AvgPolymerUsage    float64 `json:"avgPolymerUsage"`
		TotalChlorineUsage float64 `json:"totalChlorineUsage"`
		AvgChlorineUsage   float64 `json:"avgChlorineUsage"`
	} `json:"summary"`
	WaterUsage struct {
		Labels []string  `json:"labels"`
		Data   []float64 `json:"data"`
	} `json:"waterUsage"`
	ChemicalUsage struct {
		Labels   []string  `json:"labels"`
		Pac      []float64 `json:"pac"`
		Polymer  []float64 `json:"polymer"`
		Chlorine []float64 `json:"chlorine"`
	} `json:"chemicalUsage"`
	Alerts []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	} `json:"alerts"`
}

// MapData represents the data structure for the map API
type MapData struct {
	TotalSites  int `json:"totalSites"`
	ActiveSites int `json:"activeSites"`
	Stats       struct {
		Normal   int `json:"normal"`
		Warnings int `json:"warnings"`
		Critical int `json:"critical"`
	} `json:"stats"`
	Sites []MapSite `json:"sites"`
}

// MapSite represents a site on the map
type MapSite struct {
	ID            uint     `json:"id"`
	Name          string   `json:"name"`
	PlotNumber    string   `json:"plotNumber"`
	Latitude      float64  `json:"latitude"`
	Longitude     float64  `json:"longitude"`
	Status        string   `json:"status"`
	UsageHistory  []Usage  `json:"usageHistory"`
}

// Usage represents a single usage data point
type Usage struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}

// ClientDetailResponse represents the data structure for the client detail API
type ClientDetailResponse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Company       string `json:"company"`
	PlotNumber    string `json:"plotNumber"`
	Industry      string `json:"industry"`
	Status        string `json:"status"`
	ContactPerson string `json:"contactPerson"`
	Position      string `json:"position"`
	Email         string `json:"email"`
	Phone         string `json:"phone"`
	ContractStart string `json:"contractStart"`
	ContractEnd   string `json:"contractEnd"`
	
	Summary struct {
		WaterMonthlyAvg    float64 `json:"waterMonthlyAvg"`
		ChemicalMonthlyAvg float64 `json:"chemicalMonthlyAvg"`
		LastInspection     string  `json:"lastInspection"`
		NextInspection     string  `json:"nextInspection"`
	} `json:"summary"`
	
	WaterUsage struct {
		Labels []string  `json:"labels"`
		Data   []float64 `json:"data"`
	} `json:"waterUsage"`
	
	ChemicalUsage struct {
		Labels   []string  `json:"labels"`
		Pac      []float64 `json:"pac"`
		Polymer  []float64 `json:"polymer"`
		Chlorine []float64 `json:"chlorine"`
	} `json:"chemicalUsage"`
	
	Notes []struct {
		Type    string `json:"type"`
		Title   string `json:"title"`
		Message string `json:"message"`
		Date    string `json:"date"`
	} `json:"notes"`
	
	TableData []struct {
		Date     string  `json:"date"`
		Water    float64 `json:"water"`
		Pac      float64 `json:"pac"`
		Polymer  float64 `json:"polymer"`
		Chlorine float64 `json:"chlorine"`
	} `json:"tableData"`
	
	Documents []struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		DateAdded   string `json:"dateAdded"`
		FileSize    string `json:"fileSize"`
	} `json:"documents"`
} 