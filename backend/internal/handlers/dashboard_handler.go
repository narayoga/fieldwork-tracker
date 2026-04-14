package handlers

import (
	"net/http"
	"pas-backend/internal/models"
	"pas-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func PlanningRecap(c *gin.Context) {
	items, err := repository.GetPlanningRecap()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.PlanningRecap{}
	}
	c.JSON(http.StatusOK, items)
}

func ConstructionRecap(c *gin.Context) {
	items, err := repository.GetConstructionRecap()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.ConstructionRecap{}
	}
	c.JSON(http.StatusOK, items)
}
