package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func CreateUser(req models.RegisterRequest, hashedPassword string) error {
	_, err := config.DB.Exec(
		"INSERT INTO users (username, password, role, handphone) VALUES ($1, $2, $3, $4)",
		req.Username, hashedPassword, req.Role, req.Handphone,
	)
	return err
}

func GetUserByUsername(username string) (*models.User, error) {
	user := &models.User{}
	err := config.DB.QueryRow(
		"SELECT id, username, password, role, handphone, is_approved FROM users WHERE username = $1",
		username,
	).Scan(&user.ID, &user.Username, &user.Password, &user.Role, &user.Handphone, &user.IsApproved)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func ListUsers() ([]models.User, error) {
	rows, err := config.DB.Query("SELECT id, username, role, handphone, is_approved FROM users ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Username, &u.Role, &u.Handphone, &u.IsApproved); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func ApproveUser(username string) error {
	_, err := config.DB.Exec("UPDATE users SET is_approved = TRUE WHERE username = $1", username)
	return err
}
