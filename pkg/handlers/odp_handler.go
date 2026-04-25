package handlers

import (
	"net/http"
	"strings"

	"pas-backend/pkg/models"
	"pas-backend/pkg/repository"

	"github.com/gin-gonic/gin"
)

func CreateOdp(c *gin.Context) {
	var item models.Odp
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.CreateOdp(item); err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusOK, gin.H{"message": "Key Duplicate"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ODP created"})
}

func ListOdp(c *gin.Context) {
	items, err := repository.ListOdp()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.Odp{}
	}
	c.JSON(http.StatusOK, items)
}
