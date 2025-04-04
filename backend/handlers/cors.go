package handlers

import "github.com/gofiber/fiber/v2"
import "github.com/gofiber/fiber/v2/middleware/cors"

// SetupCORS configures CORS for the application
func SetupCORS(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*", // สามารถเปลี่ยนเป็น "https://your-frontend-domain.vercel.app" ในโปรดักชัน
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))
} 