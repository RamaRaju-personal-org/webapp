#!/bin/bash
# Configuring Cloud Ops agent

# Path where the log file will be created
LOG_FILE="/var/log/google-cloud-ops-agent/myapp.log"

# The user and group that should own the log file
# Assuming the application runs as csye6225
LOG_OWNER="csye6225"
LOG_GROUP="csye6225"

# Create an empty log file if it doesn't exist and set the correct owner and permissions
if [ ! -f "$LOG_FILE" ]; then
    echo "Creating an empty log file $LOG_FILE..."
    sudo touch "$LOG_FILE"
    sudo chown $LOG_OWNER:$LOG_GROUP "$LOG_FILE"
    sudo chmod 640 "$LOG_FILE" # Owner can read/write, group can read, others no access
else
    echo "Log file $LOG_FILE already exists."
    sudo chown $LOG_OWNER:$LOG_GROUP "$LOG_FILE"
    sudo chmod 640 "$LOG_FILE" # Ensure correct permissions and ownership even if the file exists
fi

# Constants for configuration
CONFIG_FILE="/etc/google-cloud-ops-agent/config.yaml"
BACKUP_FILE="${CONFIG_FILE}.bak"

# New or updated configuration lines
read -r -d '' NEW_CONFIG <<'EOF'
logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/google-cloud-ops-agent/myapp.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%L%Z"
    change_severity:
      type: modify_fields
      fields:
        severity:
          copy_from: jsonPayload.severity
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor, change_severity]
EOF

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "The configuration file $CONFIG_FILE does not exist."
    exit 1
fi

# Create a backup of the original config file
if sudo cp "$CONFIG_FILE" "$BACKUP_FILE"; then
    echo "A backup of the original configuration has been created at $BACKUP_FILE."
else
    echo "Failed to create a backup of the configuration file."
    exit 2
fi

# Update the configuration file
echo "Updating the configuration file $CONFIG_FILE..."
echo "$NEW_CONFIG" | sudo tee "$CONFIG_FILE" > /dev/null

# Check if the update was successful
if [ $? -eq 0 ]; then
    echo "The configuration file has been updated successfully."
else
    echo "Failed to update the configuration file."
    exit 3
fi

# Restart the Google Cloud Ops agent to apply the changes
echo "Restarting the Google Cloud Ops agent..."
if sudo systemctl restart google-cloud-ops-agent; then
    echo "The Google Cloud Ops agent has been restarted successfully."
else
    echo "Failed to restart the Google Cloud Ops agent."
    exit 4
fi

echo "Configuration update and restart process completed."
