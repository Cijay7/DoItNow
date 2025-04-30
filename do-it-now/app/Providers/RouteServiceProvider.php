<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * @var string|null
     */
    protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define the routes for the application.
     */
    public function map()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    /**
     * Define the "api" routes for the application.
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api') // Ensure prefix is 'api'
            ->middleware('api') // Ensure API middleware is applied
            ->namespace($this->namespace . '\\Api') // Adjust to your namespace
            ->group(base_path('routes/api.php')); // Ensure the api.php file is loaded
    }

    /**
     * Define the "web" routes for the application.
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace) // Default namespace
            ->group(base_path('routes/web.php')); // Ensure web.php is loaded
    }
}
