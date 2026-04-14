package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"pas-backend/internal/models"
	"pas-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func CreateConstruction(c *gin.Context) {
	var item models.Construction
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.CreateConstruction(item); err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			c.JSON(http.StatusOK, gin.H{"message": "Key Duplicate"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Construction created"})
}

func ListConstruction(c *gin.Context) {
	items, err := repository.ListConstruction()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if items == nil {
		items = []models.Construction{}
	}
	c.JSON(http.StatusOK, items)
}

func UpdateConstruction(c *gin.Context) {
	var item models.Construction
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := repository.UpdateConstruction(item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Construction updated"})
}

func UploadPhoto(c *gin.Context) {
	file, err := c.FormFile("sendimage")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "File required"})
		return
	}

	namaLop := c.PostForm("nama_lop")
	step := c.PostForm("step")

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s_%s_%d%s", namaLop, step, time.Now().UnixNano(), ext)
	savePath := filepath.Join("uploads", filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save file"})
		return
	}

	photo := models.ConstructionPhoto{
		NamaLop: namaLop,
		Step:    step,
		Lokasi:  "/" + savePath,
	}

	if err := repository.SavePhoto(photo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Photo uploaded"})
}

func GetPhotos(c *gin.Context) {
	var req struct {
		NamaLop string `json:"nama_lop" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	photos, err := repository.GetPhotos(req.NamaLop)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Query Error"})
		return
	}
	if photos == nil {
		photos = []models.ConstructionPhoto{}
	}
	c.JSON(http.StatusOK, photos)
}
