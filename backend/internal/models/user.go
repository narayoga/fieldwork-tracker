package models

import "time"

type User struct {
	ID         int       `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"-"`
	Role       string    `json:"role"`
	Handphone  string    `json:"handphone"`
	IsApproved bool      `json:"is_approved"`
	CreatedAt  time.Time `json:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Username    string `json:"username"`
	Role        string `json:"role"`
	Handphone   string `json:"handphone"`
	Message     string `json:"message"`
	AccessToken string `json:"accessToken"`
}

type RegisterRequest struct {
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Role      string `json:"role" binding:"required"`
	Handphone string `json:"handphone"`
}
