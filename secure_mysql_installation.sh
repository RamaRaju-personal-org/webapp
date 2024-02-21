#!/bin/bash


# Install MySQL
sudo dnf install @mysql -y

# Start and enable MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Wait for MySQL to start and then secure installation
sleep 10


# Set the root password
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'ram';"


# Display status to confirm MySQL is active
sudo systemctl status mysqld
