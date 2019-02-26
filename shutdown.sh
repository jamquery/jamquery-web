# Script for turning off the server quickly
sudo kill $(ps -A | grep node | cut -d' ' -f2)
