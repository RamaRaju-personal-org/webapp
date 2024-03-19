#!/bin/bash  
# install_ops_agent

# Exit if any command fails
set -e

# Add the Google Cloud Ops Agent repository
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
