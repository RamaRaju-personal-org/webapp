#!/bin/bash

# This script is for installing Node.js v16.x on CentOS 8

# Using NodeSource repository
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -

# Install Node.js and npm
sudo yum install -y nodejs

# Verify the installation
node -v
npm -v
