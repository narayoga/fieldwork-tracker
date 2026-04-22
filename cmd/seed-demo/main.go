// Package main seeds demo data for investor presentation.
//
// Idempotent: TRUNCATE all demo tables before inserting. Does NOT touch `users`.
// Deterministic: uses fixed random seed so every run yields identical data.
//
// Run:
//
//	cd backend
//	go run ./cmd/seed-demo
package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func main() {
	rand.Seed(42)

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

	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("begin tx: %v", err)
	}

	steps := []struct {
		name string
		fn   func(*sql.Tx) error
	}{
		{"truncate demo tables", truncateAll},
		{"seed mitra (3 vendors)", seedMitra},
		{"seed planning (30 LoPs)", seedPlanning},
		{"seed planning_odp (coordinates)", seedPlanningOdp},
		{"seed construction (20 records)", seedConstruction},
		{"seed odp (12 golive)", seedOdp},
	}

	for _, s := range steps {
		if err := s.fn(tx); err != nil {
			_ = tx.Rollback()
			log.Fatalf("step %q failed: %v", s.name, err)
		}
		fmt.Printf("  OK  %s\n", s.name)
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("commit: %v", err)
	}

	fmt.Println("\ndemo data seeded successfully")
	printSummary(db)
}

func truncateAll(tx *sql.Tx) error {
	// MySQL requires disabling FK checks before TRUNCATE
	statements := []string{
		"SET FOREIGN_KEY_CHECKS = 0",
		"TRUNCATE TABLE planning_odp",
		"TRUNCATE TABLE planning",
		"TRUNCATE TABLE construction_photos",
		"TRUNCATE TABLE construction",
		"TRUNCATE TABLE odp",
		"TRUNCATE TABLE mitra",
		"SET FOREIGN_KEY_CHECKS = 1",
	}
	for _, s := range statements {
		if _, err := tx.Exec(s); err != nil {
			return fmt.Errorf("%s: %w", s, err)
		}
	}
	return nil
}

func printSummary(db *sql.DB) {
	tables := []string{"mitra", "planning", "planning_odp", "construction", "odp"}
	fmt.Println("\nrow counts:")
	for _, t := range tables {
		var n int
		if err := db.QueryRow("SELECT COUNT(*) FROM " + t).Scan(&n); err != nil {
			fmt.Printf("  %s: error (%v)\n", t, err)
			continue
		}
		fmt.Printf("  %-15s %d\n", t, n)
	}
}
