package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"utility-backend/database"
	"utility-backend/handlers"
	"utility-backend/middlewares"
)

func main() {
	log.Println("Starting utility monitoring backend...")
	
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found or error loading it")
	}

	// Initialize database
	log.Println("Initializing database connection...")
	if err := database.InitDB(); err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	log.Println("Database initialized successfully")

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError

			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}

			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		},
	})

	// Middleware
	app.Use(logger.New())

	// Setup CORS
	handlers.SetupCORS(app)

	// API routes
	api := app.Group("/api")

	// Public routes
	api.Post("/login", handlers.Login)

	// Protected routes
	api.Use(middlewares.AuthRequired)
	api.Get("/dashboard", handlers.GetDashboardData)
	api.Post("/submit-data", handlers.SubmitData)
	api.Get("/map-data", handlers.GetMapData)
	api.Get("/clients/:id", handlers.GetClient)

	// Health check endpoint for Render
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	// Server startup
	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}