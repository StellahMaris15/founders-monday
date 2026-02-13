<?php
// config.php - Database Configuration

class Config {
    // Database Configuration
    const DB_HOST = 'localhost';
    const DB_NAME = 'founders_monday';
    const DB_USER = 'root';
    const DB_PASS = '';
    
    // Site Configuration
    const SITE_NAME = 'Founders Monday Global';
    const SITE_URL = 'http://localhost/founders-monday';
    const SITE_EMAIL = 'hello@foundersmonday.com';
    
    // Security
    const SECRET_KEY = 'your-secret-key-here';
    const JWT_SECRET = 'your-jwt-secret-here';
    
    // File Upload
    const MAX_FILE_SIZE = 5242880; // 5MB
    const ALLOWED_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    const UPLOAD_PATH = 'uploads/';
    
    // Email Configuration
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USER = 'your-email@gmail.com';
    const SMTP_PASS = 'your-password';
    
    // Prize Configuration
    const WEEKLY_PRIZE = 100000; // UGX 100,000
    
    // Get Database Connection
    public static function getDB() {
        try {
            $dsn = "mysql:host=" . self::DB_HOST . ";dbname=" . self::DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, self::DB_USER, self::DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    // Generate CSRF Token
    public static function generateCSRFToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    // Validate CSRF Token
    public static function validateCSRFToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }
    
    // Sanitize Input
    public static function sanitize($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitize'], $input);
        }
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
    
    // Validate Email
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    
    // Generate Random String
    public static function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    
    // Hash Password
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
    
    // Verify Password
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    // Send Email
    public static function sendEmail($to, $subject, $message, $headers = []) {
        $defaultHeaders = [
            'From' => self::SITE_EMAIL,
            'Reply-To' => self::SITE_EMAIL,
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Mailer' => 'PHP/' . phpversion()
        ];
        
        $headers = array_merge($defaultHeaders, $headers);
        
        $headerString = '';
        foreach ($headers as $key => $value) {
            $headerString .= "$key: $value\r\n";
        }
        
        return mail($to, $subject, $message, $headerString);
    }
}
// In config.php, add this for debugging:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>