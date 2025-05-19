

#!/bin/bash

# Check required commands
command -v jq >/dev/null 2>&1 || { echo >&2 "jq required but not installed. Aborting."; exit 1; }
command -v fortio >/dev/null 2>&1 || { echo >&2 "fortio required but not installed. Aborting."; exit 1; }

# Check base URL parameter
if [ -z "$1" ]; then
  echo "Usage: $0 <BASE_URL>"
  exit 1
fi

BASE_URL=$1
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
CSV_FILE="results_${TIMESTAMP}.csv"

# Define endpoints array
endpoints=(
  "/plain"
  "/html-template"
  "/sqlite/random-5fields/1"
  "/sqlite/random-5fields/5"
  "/sqlite/random-5fields/10"
  "/sqlite/random-30fields/1"
  "/sqlite/random-30fields/5"
  "/sqlite/random-30fields/10"
)

# Write CSV header
echo "Endpoint,Requests,Error Count,AvgMs,QPS" > "$CSV_FILE"

for endpoint in "${endpoints[@]}"; do
  URL="${BASE_URL}${endpoint}"
  
  echo "Testing: $URL"
  
  # Run fortio and save JSON output
  fortio load -json fortio_output.json -c 100 -t 60s -qps -1 "$URL" 
  
  # Parse metrics using jq
  requests=$(jq '.DurationHistogram.Count' fortio_output.json)
  error_count=$(jq  '.ErrorsDurationHistogram.Count' fortio_output.json)
  avg_ms=$(jq '(.DurationHistogram.Avg * 1000) | round' fortio_output.json)
  qps=$(jq -r '.ActualQPS | round' fortio_output.json)
  
  # Append to CSV
  echo "$endpoint,$requests,$error_count,$avg_ms,$qps" >> "$CSV_FILE"
  
  # Cleanup
#   rm fortio_output.json

done

echo "Benchmark completed. Results saved to $CSV_FILE"
 
