# MovieFusion

MovieFusion is a web application that allows users to explore movies, rate them, and add their favorites to a personalized list. The project is built using Django for the backend and React for the frontend.

## Features

- Browse a collection of movies with detailed information.
- Rate movies and view the average rating for each movie.
- Add movies to your list of favorite movies.
- Explore movie categories and filter movies accordingly.

## Technologies Used

- Django: Backend framework for building robust and scalable web applications.
- React: Frontend library for building interactive user interfaces.
- Django REST Framework: Toolkit for building Web APIs in Django applications.
- PostgreSQL: Database management system used to store movie and user data.

## Getting Started

### Prerequisites

- Node.js: Ensure that Node.js is installed on your machine.
- Python: Ensure that Python is installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/MovieFusion.git
   cd MovieFusion
   ```

2. Set up environment variables:
    Create a .env file in the root directory with the following content:
    ```bash
        DB_HOST=database
        DB_NAME=dbname
        DB_USER=dbuser
        DB_PASS=pass
    ```

3. Run Docker Compose:
    ```bash
        docker-compose up --build
    ```
    
4. Open your browser and visit http://localhost:8000 to access MovieFusion.


### Project Structure
    /MovieFusion: Django backend code and API.
    /frontend: React frontend code.
    docker-compose.yml: Docker Compose configuration file.
    

### Services

#### web-app
Django application running on port 8000.

#### database
PostgreSQL database.

#### redis
Redis for Celery and caching functionality.

#### worker
Celery worker for background tasks.

#### flower
Flower for monitoring Celery tasks, accessible at http://localhost:5556.

#### pgadmin
PgAdmin for database administration, accessible at http://localhost:8080.


### Contributing
We welcome contributions! If you find a bug or have a feature request, please open an issue. Feel free to fork the project and submit pull requests.