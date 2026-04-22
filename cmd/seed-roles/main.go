package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

type seedUser struct {
	Username  string
	Password  string
	Role      string
	Handphone string
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using environment variables")
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("ping db: %v", err)
	}

	users := []seedUser{
		{Username: "admin", Password: "Password123", Role: "Optima", Handphone: ""},
		{Username: "mitra", Password: "Mitra123", Role: "Mitra", Handphone: ""},
		{Username: "hero", Password: "Hero123", Role: "Hero", Handphone: ""},
	}

	for _, u := range users {
		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("bcrypt %s: %v", u.Username, err)
		}

		_, err = db.Exec(`
			INSERT INTO users (username, password, role, handphone, is_approved)
			VALUES (?, ?, ?, ?, true)
			ON DUPLICATE KEY UPDATE
				password   = VALUES(password),
				role       = VALUES(role),
				is_approved = true
		`, u.Username, string(hash), u.Role, u.Handphone)
		if err != nil {
			log.Fatalf("insert %s: %v", u.Username, err)
		}

		fmt.Printf("seeded user: %s (role=%s)\n", u.Username, u.Role)
	}

	fmt.Println("done")
}
