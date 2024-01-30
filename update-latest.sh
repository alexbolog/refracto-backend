echo -e "\e[32m[REFRACTO] Stopping backend service"
pm2 stop refracto-backend
echo -e "\e[32m[REFRACTO] Fetching latest changes\e[0m"
git fetch
git pull
echo -e "\e[32m[REFRACTO] Building backend\e[0m"
npm run build
echo -e "\e[32m[REFRACTO] Starting backend service\e[0m"
pm2 start refracto-backend
echo "Script finished"