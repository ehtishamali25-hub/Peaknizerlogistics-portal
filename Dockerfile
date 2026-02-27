# Use official Python image
FROM python:3.14-slim

# Set working directory inside container
WORKDIR /app

# Copy only requirements first (for better caching)
COPY backend/requirements-prod.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements-prod.txt

# Copy the entire backend folder into the container
COPY backend/ .

# Render provides a dynamic PORT environment variable – use it
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT