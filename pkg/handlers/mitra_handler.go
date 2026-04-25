package handlers

import (
	"net/http"
	"strings"

	"pas-backend/pkg/models"
	"pas-backend/pkg/repository"

	"github.com/gin-gonic/gin"
)

func CreateMitra(c *gin.Context) {
	var item models.Mitra
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.CreateMitra(item); err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusOK, gin.H{"message": "Key Duplicate"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mitra created"})
}

func ListMitra(c *gin.Context) {
	items, err := repository.ListMitra()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.Mitra{}
	}
	c.JSON(http.StatusOK, items)
}
