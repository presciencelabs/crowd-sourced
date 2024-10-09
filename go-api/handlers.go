package main

import (
	"bufio"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Response struct {
	ID      uuid.UUID
	ImageID uuid.UUID
	Text    *string
	Audio   *string
}

func CreateResponse(c echo.Context) error {
	// Reference: https://echo.labstack.com/docs/cookbook/file-upload

	// Generate a unique id for response
	responseID, err := uuid.NewV7()
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}

	// image_id
	imageIDStr := c.FormValue("image_id")
	if imageIDStr == "" {
		return c.String(http.StatusBadRequest, "Bad Request; Missing Required Field")
	}
	imageID, err := uuid.Parse(imageIDStr)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Bad Request; Could Not Parse image_id")
	}

	// Filenames
	basename := strings.Join([]string{imageID.String(), responseID.String()}, "_")

	resp := Response{ID: responseID, ImageID: imageID}
	pResp := &resp

	// text input
	text := c.FormValue("text")
	if text != "" {
		fname := strings.Join([]string{basename, "text"}, "_")
		f, err := os.Create(fname)
		if err != nil {
			return c.String(http.StatusInternalServerError, "Internal Server Error")
		}
		defer f.Close()

		w := bufio.NewWriter(f)
		if _, err := w.WriteString(text); err != nil {
			return c.String(http.StatusInternalServerError, "Internal Server Error")
		}
		if err := w.Flush(); err != nil {
			return c.String(http.StatusInternalServerError, "Internal Server Error")
		}
		pResp.Text = &fname
	}

	// audio input
	a, err := c.FormFile("audio")
	// If audio file is not provided, c.FormFile() will return
	// a http.ErrMissingFile. Only attempt to store audio file
	// if one is included in the request.
	if err == nil {
		fname := strings.Join([]string{basename, "audio"}, "_")

		src, err := a.Open()
		if err != nil {
			return err
		}
		defer src.Close()
		dst, err := os.Create(fname)
		if err != nil {
			return err
		}
		defer dst.Close()
		if _, err = io.Copy(dst, src); err != nil {
			return err
		}
		pResp.Audio = &fname
	}

	return c.JSON(http.StatusAccepted, &resp)
}
