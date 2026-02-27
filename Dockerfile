FROM python:3.14-slim

WORKDIR /app

# Copy requirements and install with verbose output
COPY backend/requirements-prod.txt .
RUN echo "=== Installing packages ===" && \
    pip install --no-cache-dir -v -r requirements-prod.txt && \
    echo "=== Installed packages ===" && \
    pip list

# Copy the rest of the app
COPY backend/ .

# Use the full path to python to run uvicorn
CMD ["/usr/local/bin/python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]