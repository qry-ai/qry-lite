package internal

import (
	"fmt"
	"os"
)

func MustHave(key string) string {
	val := os.Getenv(key)
	if val == "" {
		panic(fmt.Sprintf("environment variable %q not set", key))
	}
	return val
}

func ShouldHave(key string, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}
