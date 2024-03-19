#!/bin/bash  
# sudo chmod 744 /tmp/nodeapp.service

#nodeapp service file setup

sudo cp /opt/csye6225/nodeapp.service /etc/systemd/system/


# Reload systemd to recognize the new service file
sudo systemctl daemon-reload

# # Enable, start, and show the status of the service
sudo systemctl start nodeapp
sudo systemctl enable nodeapp
sudo systemctl status nodeapp
