package main

import (
	"log"
	"net/http"

	"github.com/kelseyhightower/envconfig"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Specification struct {
	AllowOrigins []string
}

func main() {

	var s Specification
	err := envconfig.Process("api", &s)
	if err != nil {
		log.Fatal(err.Error())
	}

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: s.AllowOrigins,
	}))

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.POST("/responses", func(c echo.Context) error {
		return c.String(http.StatusAccepted, "POST /responses; TODO - Implement")
	})
	e.Logger.Fatal(e.Start(":8080"))
}
