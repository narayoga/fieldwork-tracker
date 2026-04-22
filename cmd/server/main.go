package main

import (
	"log"
	"os"
	"pas-backend/internal/config"
	"pas-backend/internal/router"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	// Connect database
	if err := config.ConnectDB(); err != nil {
		log.Fatal("DB connect failed:", err)
	}
	defer config.DB.Close()

	// Setup router
	r := router.SetupRouter()

	// Start server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("✓ Server running on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
