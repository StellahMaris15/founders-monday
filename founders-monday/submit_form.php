<?php
// submit_form.php - Founder Application Form Submission

require_once 'config.php';
session_start();

header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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
    'full_name', 'email', 'country', 'company_name', 'industry', 'stage',
    'bio', 'description', 'challenge', 'achievement', 'lesson', 'insight', 'advice'
];

$errors = [];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $errors[$field] = "This field is required";
    }
}

// Validate email
if (!empty($data['email']) && !Config::validateEmail($data['email'])) {
    $errors['email'] = "Invalid email address";
}

// Validate URLs if provided
$urlFields = ['linkedin', 'website', 'company_website', 'interview'];
foreach ($urlFields as $field) {
    if (!empty($data[$field]) && !filter_var($data[$field], FILTER_VALIDATE_URL)) {
        $errors[$field] = "Invalid URL format";
    }
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit;
}

try {
    $db = Config::getDB();
    
    // Begin transaction
    $db->beginTransaction();
    
    // Check if email already submitted this month
    $stmt = $db->prepare("
        SELECT id FROM founder_submissions 
        WHERE email = :email 
        AND MONTH(submission_date) = MONTH(CURRENT_DATE()) 
        AND YEAR(submission_date) = YEAR(CURRENT_DATE())
    ");
    $stmt->execute([':email' => $data['email']]);
    
    if ($stmt->fetch()) {
        throw new Exception("You have already submitted an application this month.");
    }
    
    // Handle file uploads
    $photoPath = null;
    $logoPath = null;
    
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == UPLOAD_ERR_OK) {
        $photoPath = uploadFile($_FILES['photo'], 'founder_photos/');
    }
    
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] == UPLOAD_ERR_OK) {
        $logoPath = uploadFile($_FILES['logo'], 'company_logos/');
    }
    
    // Insert submission
    $stmt = $db->prepare("
        INSERT INTO founder_submissions (
            full_name, email, phone, country, linkedin, website,
            company_name, industry, company_website, year_founded,
            stage, team_size, bio, description, challenge, achievement,
            lesson, insight, advice, social_media, interview,
            photo_path, logo_path, submission_date, status
        ) VALUES (
            :full_name, :email, :phone, :country, :linkedin, :website,
            :company_name, :industry, :company_website, :year_founded,
            :stage, :team_size, :bio, :description, :challenge, :achievement,
            :lesson, :insight, :advice, :social_media, :interview,
            :photo_path, :logo_path, NOW(), 'pending'
        )
    ");
    
    $stmt->execute([
        ':full_name' => $data['full_name'],
        ':email' => $data['email'],
        ':phone' => $data['phone'] ?? null,
        ':country' => $data['country'],
        ':linkedin' => $data['linkedin'] ?? null,
        ':website' => $data['website'] ?? null,
        ':company_name' => $data['company_name'],
        ':industry' => $data['industry'],
        ':company_website' => $data['company_website'] ?? null,
        ':year_founded' => $data['year_founded'] ?? null,
        ':stage' => $data['stage'],
        ':team_size' => $data['team_size'] ?? null,
        ':bio' => $data['bio'],
        ':description' => $data['description'],
        ':challenge' => $data['challenge'],
        ':achievement' => $data['achievement'],
        ':lesson' => $data['lesson'],
        ':insight' => $data['insight'],
        ':advice' => $data['advice'],
        ':social_media' => $data['social_media'] ?? null,
        ':interview' => $data['interview'] ?? null,
        ':photo_path' => $photoPath,
        ':logo_path' => $logoPath
    ]);
    
    $submissionId = $db->lastInsertId();
    
    // Send confirmation email
    sendConfirmationEmail($data['email'], $data['full_name']);
    
    // Send notification to admin
    sendAdminNotification($submissionId, $data['full_name'], $data['company_name']);
    
    // Commit transaction
    $db->commit();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully!',
        'submission_id' => $submissionId
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

// File upload function
function uploadFile($file, $directory) {
    $maxSize = Config::MAX_FILE_SIZE;
    $allowedTypes = Config::ALLOWED_TYPES;
    $uploadPath = Config::UPLOAD_PATH . $directory;
    
    // Check file size
    if ($file['size'] > $maxSize) {
        throw new Exception("File size exceeds maximum allowed size of 5MB");
    }
    
    // Check file type
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($fileExtension, $allowedTypes)) {
        throw new Exception("Invalid file type. Allowed types: " . implode(', ', $allowedTypes));
    }
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0777, true);
    }
    
    // Generate unique filename
    $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
    $filePath = $uploadPath . $fileName;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception("Failed to upload file");
    }
    
    return $filePath;
}

// Send confirmation email
function sendConfirmationEmail($to, $name) {
    $subject = "Founders Monday - Application Received";
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1E3A8A, #3B82F6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #D4AF37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Received!</h1>
            </div>
            <div class="content">
                <h2>Hello ' . htmlspecialchars($name) . '!</h2>
                <p>Thank you for submitting your application to Founders Monday Global.</p>
                <p>We have received your submission and our team will review it carefully. If selected, you\'ll be contacted for the next steps.</p>
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>Our team reviews all submissions weekly</li>
                    <li>Selected founders are notified every Monday</li>
                    <li>Featured founders win UGX 100,000</li>
                    <li>All applicants receive feedback</li>
                </ul>
                <p>In the meantime, feel free to join our community:</p>
                <a href="https://chat.whatsapp.com/Kliov7hj0QV6oG9JiuAorq" class="button">Join WhatsApp Group</a>
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

// Send admin notification
function sendAdminNotification($submissionId, $founderName, $companyName) {
    $adminEmail = Config::SITE_EMAIL;
    $subject = "New Founder Application Received";
    
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; }
            .alert { background: #ffeb3b; padding: 10px; border-left: 4px solid #ffc107; }
            .info { background: #e3f2fd; padding: 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="alert">
                <h2>📨 New Application Alert</h2>
            </div>
            <div class="info">
                <h3>Application Details:</h3>
                <p><strong>Submission ID:</strong> ' . $submissionId . '</p>
                <p><strong>Founder Name:</strong> ' . htmlspecialchars($founderName) . '</p>
                <p><strong>Company Name:</strong> ' . htmlspecialchars($companyName) . '</p>
                <p><strong>Submitted:</strong> ' . date('Y-m-d H:i:s') . '</p>
                <hr>
                <p><a href="' . Config::SITE_URL . '/admin/submissions/view.php?id=' . $submissionId . '">View Full Application</a></p>
            </div>
        </div>
    </body>
    </html>';
    
    Config::sendEmail($adminEmail, $subject, $message);
}
?>