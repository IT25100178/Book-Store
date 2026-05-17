@echo off
echo =============================================
echo   Luxury Books Java Backend - Build Script
echo =============================================

:: Create output directory
if not exist "out" mkdir out

:: Compile all Java source files
echo Compiling Java source files...
javac -d out -sourcepath src ^
  src\com\bookstore\Main.java ^
  src\com\bookstore\DataSeeder.java ^
  src\com\bookstore\models\User.java ^
  src\com\bookstore\models\Book.java ^
  src\com\bookstore\models\CartItem.java ^
  src\com\bookstore\models\Order.java ^
  src\com\bookstore\models\Review.java ^
  src\com\bookstore\models\WishlistItem.java ^
  src\com\bookstore\storage\FileStorage.java ^
  src\com\bookstore\services\AuthService.java ^
  src\com\bookstore\services\BookService.java ^
  src\com\bookstore\services\CartService.java ^
  src\com\bookstore\services\OrderService.java ^
  src\com\bookstore\services\UserService.java ^
  src\com\bookstore\server\BaseHandler.java ^
  src\com\bookstore\handlers\AuthHandler.java ^
  src\com\bookstore\handlers\BookHandler.java ^
  src\com\bookstore\handlers\CartHandler.java ^
  src\com\bookstore\handlers\OrderHandler.java ^
  src\com\bookstore\handlers\UserHandler.java

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Compilation failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo [OK] Compilation successful!
echo.
echo Starting server on http://localhost:8080 ...
echo Press Ctrl+C to stop.
echo.

:: Run the server (from Back-end directory so relative paths work)
java -cp out com.bookstore.Main

pause
