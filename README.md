# Web Rating

<p align="center">
<img src="https://github.com/user-attachments/assets/e0aafbef-e9ee-4a8c-8bc3-b7ad568a4d05" alt="myself" height="200">
</p>

Web Rating is a web application that allows users to rate and leave feedback on specific events. The main goal of the project is to provide a simple yet effective system for collecting ratings and comments that can be useful for improving the quality of future events.

## Features

- **Event Rating**: Users can express their appreciation for an event through a rating system.
- **Comments**: In addition to rating, users can leave textual comments to provide more detailed feedback.
- **Telegram Integration**: If enabled, the application can send photos and messages to a Telegram bot for easy sharing and viewing.

## Frontend Routes

The Angular application uses the following main routes:

- `/`: The homepage that displays recent events and allows users to navigate to the rating pages.
- `/events/add-rating/:eventId`: A page where users can add a rating and a comment for the specified event.
- `/**`: All other routes are redirected to the homepage.

## Backend API

The following APIs are available to interact with the backend:

- `GET /api/get-all-events`: Returns all the events available for rating.
- `GET /api/get-event/:eventId`: Retrieves the details of a single event.
- `POST /api/insert-rating/:eventId`: Submits a new rating for an event.
- `POST /api/insert-photo`: Uploads a photo related to an event to Telegram (if enabled).

## Database

(WIP - Section under development)

_**Note**: This section will be completed once the database dump is final._

## Design Concept Credits

This design was conceived by [Marco Tesselli](https://dribbble.com/marcotesselli).

## How to Contribute

Interested in contributing to the project? Great! You can start by forking the repository and submitting your pull requests. For more details on how to contribute, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.
