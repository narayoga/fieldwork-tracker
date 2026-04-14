package handlers

import (
	"net/http"
	"strings"

	"pas-backend/internal/models"
	"pas-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func CreatePlanning(c *gin.Context) {
	var p models.Planning
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.CreatePlanning(p); err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusOK, gin.H{"message": "Key Duplicate"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Planning created"})
}

func ListPlanning(c *gin.Context) {
	items, err := repository.ListPlanning()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.Planning{}
	}
	c.JSON(http.StatusOK, items)
}

func UpdatePlanning(c *gin.Context) {
	var req models.PlanningUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.UpdatePlanning(req); err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Planning updated"})
}

func SaveOdpCoords(c *gin.Context) {
	var req models.PlanningOdpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.SaveOdpCoords(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Coordinates saved"})
}

func GetOdpCoords(c *gin.Context) {
	var req struct {
		NamaLop string `json:"nama_lop" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	odp, err := repository.GetOdpCoords(req.NamaLop)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "No data found", "koordinat": []string{}})
		return
	}

	c.JSON(http.StatusOK, odp)
}
