#!/usr/bin/env bash
set -e

sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user
sudo yum install -y git nginx
sudo systemctl enable nginx && sudo systemctl start nginx

echo "Init complete. Reconnect shell or run 'newgrp docker' to use docker without sudo."

