#!/bin/bash

# Update system packages
# sudo dnf update -y

# Install unzip and zip just in case they're not available on the CentOS image
sudo dnf install -y unzip zip

# Create csye6225 group if it doesn't exist
sudo groupadd -f csye6225

# Create csye6225 user with no login shell, add to group
sudo useradd -g csye6225 -s /usr/sbin/nologin -d /opt/csye6225 -m csye6225

# Copy the application artifact to the /opt directory
sudo cp /tmp/application.zip /opt/application.zip

# Unzip the application archive in the /opt directory
sudo unzip /opt/application.zip -d /opt/csye6225

# Change ownership of the /opt directory recursively to csye6225:csye6225
sudo chown -R csye6225:csye6225 /opt/csye6225
sudo chmod -R 755 /opt/csye6225


# Switch to csye6225 user to execute commands
sudo -u csye6225 bash << 'EOF'

cd /opt/csye6225

#Create or overwrite the .env file with environment variables
echo "DB_NAME=restapi" > .env
echo "DB_USER=root" >> .env
echo "DB_PASSWORD=ram" >> .env
echo "DB_HOST=localhost" >> .env
echo "PORT=3307" >> .env
echo "TOKEN_SECRET=my-secret" >> .env

# # Change the permissions to be readable only by csye6225
chmod 600 .env

# Install Node.js application dependencies

npm install

# Exit the sudo -u csye6225 bash session
exit
EOF

sudo chmod -R 750 /opt/csye6225
