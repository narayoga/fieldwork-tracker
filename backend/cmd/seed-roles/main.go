package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
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

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("postgres", connStr)
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
			VALUES ($1, $2, $3, $4, true)
			ON CONFLICT (username) DO UPDATE
			SET password = EXCLUDED.password,
			    role = EXCLUDED.role,
			    is_approved = true
		`, u.Username, string(hash), u.Role, u.Handphone)
		if err != nil {
			log.Fatalf("insert %s: %v", u.Username, err)
		}

		fmt.Printf("seeded user: %s (role=%s)\n", u.Username, u.Role)
	}

	fmt.Println("done")
}
