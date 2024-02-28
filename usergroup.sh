#!/bin/bash

# Install unzip and zip just in case they're not available on the CentOS image
sudo dnf install -y unzip zip

# Create csye6225 group if it doesn't exist
sudo groupadd -f csye6225

# sudo touch /opt/csye6225/.env

# Create csye6225 user with no login shell, add to group
sudo useradd -g csye6225 -s /usr/sbin/nologin -d /opt/csye6225 -m csye6225

# Copy the application artifact to the /opt directory
sudo cp /tmp/application.zip /opt/application.zip

# Unzip the application archive in the /opt directory
sudo unzip /opt/application.zip -d /opt/csye6225

# Change ownership of the /opt directory recursively to csye6225:csye6225
sudo chown -R csye6225:csye6225 /opt/csye6225

# sudo npm install

# # Switch to the csye6225 user to execute the following commands
sudo -u csye6225 /bin/bash <<'EOF'

# Go to the application directory
cd /opt/csye6225

touch .env


# Install npm dependencies
npm install

# Exit the sudo -u csye6225 bash session
exit
EOF
