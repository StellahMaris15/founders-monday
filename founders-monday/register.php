<?php
// register.php - User Registration

require_once 'config.php';
session_start();

header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Validate CSRF token
if (!isset($_POST['csrf_token']) || !Config::validateCSRFToken($_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit;
}

// Sanitize input data
$data = Config::sanitize($_POST);

// Validate required fields
$requiredFields = [
    'reg_full_name', 'reg_username', 'reg_email', 'reg_phone',
    'reg_password', 'reg_confirm_password', 'reg_account_type'
];

$errors = [];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $errors[$field] = "This field is required";
    }
}

// Validate email
if (!empty($data['reg_email']) && !Config::validateEmail($data['reg_email'])) {
    $errors['reg_email'] = "Invalid email address";
}

// Validate password match
if ($data['reg_password'] !== $data['reg_confirm_password']) {
    $errors['reg_confirm_password'] = "Passwords do not match";
}

// Validate password strength
if (strlen($data['reg_password']) < 8) {
    $errors['reg_password'] = "Password must be at least 8 characters";
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit;
}

try {
    $db = Config::getDB();
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $data['reg_email']]);
    
    if ($stmt->fetch()) {
        throw new Exception("Email already registered");
    }
    
    // Check if username already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute([':username' => $data['reg_username']]);
    
    if ($stmt->fetch()) {
        throw new Exception("Username already taken");
    }
    
    // Hash password
    $passwordHash = Config::hashPassword($data['reg_password']);
    
    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));
    
    // Insert user
    $stmt = $db->prepare("
        INSERT INTO users (
            full_name, username, email, phone, date_of_birth, gender,
            address, company, account_type, password_hash, verification_token,
            created_at, status
        ) VALUES (
            :full_name, :username, :email, :phone, :date_of_birth, :gender,
            :address, :company, :account_type, :password_hash, :verification_token,
            NOW(), 'pending'
        )
    ");
    
    $stmt->execute([
        ':full_name' => $data['reg_full_name'],
        ':username' => $data['reg_username'],
        ':email' => $data['reg_email'],
        ':phone' => $data['reg_phone'],
        ':date_of_birth' => $data['reg_dob'] ?? null,
        ':gender' => $data['reg_gender'] ?? null,
        ':address' => $data['reg_address'] ?? null,
        ':company' => $data['reg_company'] ?? null,
        ':account_type' => $data['reg_account_type'],
        ':password_hash' => $passwordHash,
        ':verification_token' => $verificationToken
    ]);
    
    $userId = $db->lastInsertId();
    
    // Send verification email
    sendVerificationEmail($data['reg_email'], $data['reg_full_name'], $verificationToken);
    
    // Send welcome email
    sendWelcomeEmail($data['reg_email'], $data['reg_full_name'], $data['reg_username']);
    
    // Create session
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $data['reg_email'];
    $_SESSION['user_name'] = $data['reg_full_name'];
    $_SESSION['account_type'] = $data['reg_account_type'];
    $_SESSION['verified'] = false;
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully! Please check your email to verify your account.',
        'user_id' => $userId,
        'redirect' => 'dashboard.php'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

// Send verification email
function sendVerificationEmail($to, $name, $token) {
    $subject = "Verify Your Founders Monday Account";
    $verificationLink = Config::SITE_URL . "/verify.php?token=" . $token;
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D4AF37, #B8860B); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #1E3A8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
            .code { background: #eee; padding: 10px; border-radius: 5px; font-family: monospace; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Account</h1>
            </div>
            <div class="content">
                <h2>Welcome ' . htmlspecialchars($name) . '!</h2>
                <p>Thank you for creating an account with Founders Monday Global.</p>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <a href="' . $verificationLink . '" class="button">Verify Email Address</a>
                <p>Or copy and paste this link in your browser:</p>
                <div class="code">' . $verificationLink . '</div>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Founders Monday Team</p>
            </div>
            <div class="footer">
                <p>© 2024 Founders Monday Global. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';
    
    Config::sendEmail($to, $subject, $message);
}

// Send welcome email
function sendWelcomeEmail($to, $name, $username) {
    $subject = "Welcome to Founders Monday Global!";
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E3A8A, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
            .feature { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #D4AF37; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome Aboard!</h1>
            </div>
            <div class="content">
                <h2>Hello ' . htmlspecialchars($name) . '!</h2>
                <p>Your account has been successfully created with username: <strong>' . htmlspecialchars($username) . '</strong></p>
                
                <div class="feature">
                    <h3>🚀 Get Started</h3>
                    <p>Here\'s what you can do now:</p>
                    <ul>
                        <li>Submit your startup for featuring</li>
                        <li>Connect with other founders</li>
                        <li>Access exclusive resources</li>
                        <li>Participate in community events</li>
                    </ul>
                </div>
                
                <div class="feature">
                    <h3>📅 Weekly Features</h3>
                    <p>Every Monday, we feature one founder and award UGX 100,000</p>
                </div>
                
                <p>Join our communities:</p>
                <a href="https://chat.whatsapp.com/Kliov7hj0QV6oG9JiuAorq" class="button">WhatsApp Group</a>
                <a href="' . Config::SITE_URL . '/community" class="button">Community Forum</a>
                
                <p style="margin-top: 30px;">Need help? Contact us at <a href="mailto:' . Config::SITE_EMAIL . '">' . Config::SITE_EMAIL . '</a></p>
                
                <p>Best regards,<br>The Founders Monday Team</p>
            </div>
            <div class="footer">
                <p>© 2024 Founders Monday Global. Empowering startup founders every Monday.</p>
            </div>
        </div>
    </body>
    </html>';
    
    Config::sendEmail($to, $subject, $message);
}
?>