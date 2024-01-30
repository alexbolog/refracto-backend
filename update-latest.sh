echo "Stopping backend service"
pm2 stop refracto-backend
echo "Fetching latest changes"
git fetch
git pull
echo "Building backend"
npm run build
echo "Starting backend service"
pm2 start refracto-backend
echo "Script finished"