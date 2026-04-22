package router

import (
	"os"

	"pas-backend/internal/handlers"
	"pas-backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	// Static files for uploaded photos — env override for serverless.
	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads"
	}
	r.Static("/uploads", uploadDir)

	opda := r.Group("/opda")
	{
		// Auth (no middleware)
		opda.POST("/login/", handlers.Login)
		opda.POST("/register/", handlers.Register)

		// Protected routes
		auth := opda.Group("")
		auth.Use(middleware.AuthMiddleware())
		{
			// Admin
			auth.POST("/admin/", handlers.ListUsers)
			auth.POST("/admin/approve/", handlers.ApproveUser)

			// Planning
			auth.POST("/planning/", handlers.CreatePlanning)
			auth.POST("/planning/read/", handlers.ListPlanning)
			auth.POST("/planning/update/", handlers.UpdatePlanning)
			auth.POST("/planning/odp/", handlers.SaveOdpCoords)
			auth.POST("/planning/odp/read/", handlers.GetOdpCoords)

			// Construction
			auth.POST("/construction/", handlers.CreateConstruction)
			auth.POST("/construction/read/", handlers.ListConstruction)
			auth.POST("/construction/update/", handlers.UpdateConstruction)
			auth.POST("/construction/upload/", handlers.UploadPhoto)
			auth.POST("/construction/photo/", handlers.GetPhotos)

			// ODP Go-Live
			auth.POST("/odp/", handlers.CreateOdp)
			auth.POST("/odp/read/", handlers.ListOdp)

			// Mitra
			auth.POST("/mitra/", handlers.CreateMitra)
			auth.POST("/mitra/read/", handlers.ListMitra)

			// Dashboard
			auth.GET("/dashboard/planning/", handlers.PlanningRecap)
			auth.GET("/dashboard/construction/", handlers.ConstructionRecap)
		}
	}

	return r
}
