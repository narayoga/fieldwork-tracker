package handlers

import (
	"net/http"
	"pas-backend/pkg/models"
	"pas-backend/pkg/repository"

	"github.com/gin-gonic/gin"
)

func ListUsers(c *gin.Context) {
	users, err := repository.ListUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if users == nil {
		users = []models.User{}
	}
	c.JSON(http.StatusOK, users)
}

func ApproveUser(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.ApproveUser(req.Username); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User approved"})
}
