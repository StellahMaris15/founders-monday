<?php
// dashboard/index.php - User Dashboard

require_once '../config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: ../index.html#login');
    exit;
}

$user_id = $_SESSION['user_id'];
$db = Config::getDB();

// Get user data
$stmt = $db->prepare("
    SELECT u.*, 
           COUNT(fs.id) as submissions_count,
           COUNT(ff.id) as features_count
    FROM users u
    LEFT JOIN founder_submissions fs ON u.id = fs.user_id
    LEFT JOIN featured_founders ff ON fs.id = ff.submission_id
    WHERE u.id = :user_id
    GROUP BY u.id
");
$stmt->execute([':user_id' => $user_id]);
$user = $stmt->fetch();

if (!$user) {
    session_destroy();
    header('Location: ../index.html#login');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Founders Monday Global</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <main class="dashboard-main">
        <div class="container">
            <div class="dashboard-header">
                <h1>Welcome, <?php echo htmlspecialchars($user['full_name']); ?>!</h1>
                <p>Account Type: <span class="badge badge-primary"><?php echo $user['account_type']; ?></span></p>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $user['submissions_count']; ?></h3>
                        <p>Submissions</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $user['features_count']; ?></h3>
                        <p>Features</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="stat-content">
                        <h3>0</h3>
                        <p>Upcoming Events</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>0</h3>
                        <p>Connections</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-actions">
                <a href="../index.html#get-featured" class="btn-primary">
                    <i class="fas fa-plus"></i> New Application
                </a>
                <a href="profile.php" class="btn-outline">
                    <i class="fas fa-user"></i> Edit Profile
                </a>
                <a href="submissions.php" class="btn-accent">
                    <i class="fas fa-list"></i> View Submissions
                </a>
            </div>
            
            <!-- Recent Activity -->
            <div class="recent-activity">
                <h2>Recent Activity</h2>
                <div class="activity-list">
                    <p>No recent activity.</p>
                </div>
            </div>
        </div>
    </main>
    
    <?php include '../includes/footer.php'; ?>
    
    <script>
        // Dashboard specific JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Dashboard loaded for user ID: <?php echo $user_id; ?>');
        });
    </script>
</body>
</html>