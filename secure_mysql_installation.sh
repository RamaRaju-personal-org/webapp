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

# # Set up the Docker repository
# sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo

# # Install the Docker engine
# sudo dnf install docker-ce docker-ce-cli containerd.io --nobest -y

# # Start and enable Docker service
# sudo systemctl start docker
# sudo systemctl enable docker

# # Pull the MySQL Docker image
# sudo docker pull mysql:5.7

# # Run the MySQL container
# sudo docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=restapi -e MYSQL_USER=ram -e MYSQL_PASSWORD=ram -d -p 3306:3306 mysql:5.7

# # Wait for MySQL to be ready (simple wait, check health or logs for a better approach)
# sleep 20

# # At this point, MySQL should be running in a Docker container
# # You can run additional commands to interact with it if needed
