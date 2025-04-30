# Do It Now
## Project Setup Guide
Welcome, below is a simple step-by-step guide to get started.
### 1. Initial Installation
After cloning the repo, install both PHP and Node dependencies
```
cd do-it-now
composer install
npm install
```

### 2. Generate App Key
Generate the app key for this Laravel project
```
php artisan key:generate
```

### 3. Set Up the Database and .env
Ask me for the .env file - Faiza

Then, run the migration:
```
php artisan migrate
```

### 4. Run the Server
In the terminal, run:
```
php artisan serve
```

Then open another terminal tab, make sure you are in the correct path (./do-it-now), and run:
```
npm run dev
```
This will open up the server and compile the project with vite. Open http://127.0.0.1:8000 in your browser to access the app.