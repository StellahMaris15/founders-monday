<?php
// test-forms.php - Test All Forms
echo "<!DOCTYPE html>";
echo "<html><head><title>Form Tests</title>";
echo "<style>
    body{font-family:Arial;padding:20px;max-width:800px;margin:0 auto;}
    .test-section{border:2px solid #ddd;padding:20px;margin:20px 0;border-radius:10px;}
    .success{color:green;}
    .error{color:red;}
    .btn{display:inline-block;padding:10px 20px;background:#D4AF37;color:white;text-decoration:none;border-radius:5px;margin:5px;}
</style>";
echo "</head><body>";
echo "<h1>🧪 Form Testing Center</h1>";
echo "<p>Test all forms from one page</p>";

// Test CSRF token
session_start();
$csrf_token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $csrf_token;
?>

<div class="test-section">
    <h2>1️⃣ Registration Form Test</h2>
    <form id="testRegisterForm" onsubmit="return testRegistration()">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        
        <label>Full Name:</label>
        <input type="text" name="reg_full_name" value="Test User" required><br><br>
        
        <label>Username:</label>
        <input type="text" name="reg_username" value="testuser<?php echo rand(100,999); ?>" required><br><br>
        
        <label>Email:</label>
        <input type="email" name="reg_email" value="test<?php echo rand(100,999); ?>@example.com" required><br><br>
        
        <label>Phone:</label>
        <input type="text" name="reg_phone" value="+256700000000"><br><br>
        
        <label>Account Type:</label>
        <select name="reg_account_type">
            <option value="founder">Founder</option>
            <option value="member">Member</option>
            <option value="investor">Investor</option>
        </select><br><br>
        
        <label>Password:</label>
        <input type="password" name="reg_password" value="Test123!" required><br><br>
        
        <label>Confirm Password:</label>
        <input type="password" name="reg_confirm_password" value="Test123!" required><br><br>
        
        <button type="submit" class="btn">Test Registration</button>
    </form>
    <div id="registerResult"></div>
</div>

<div class="test-section">
    <h2>2️⃣ Login Form Test</h2>
    <p>Try these test credentials:</p>
    <ul>
        <li>Admin: admin@foundersmonday.com / Admin123!</li>
        <li>Founder: john@example.com / Founder123!</li>
    </ul>
    
    <form id="testLoginForm" onsubmit="return testLogin()">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        
        <label>Email:</label>
        <input type="email" name="login_email" id="login_email" value="admin@foundersmonday.com" required><br><br>
        
        <label>Password:</label>
        <input type="password" name="login_password" id="login_password" value="Admin123!" required><br><br>
        
        <button type="submit" class="btn">Test Login</button>
        <button type="button" class="btn" onclick="useFounderCreds()">Use Founder Account</button>
    </form>
    <div id="loginResult"></div>
</div>

<div class="test-section">
    <h2>3️⃣ Founder Application Test</h2>
    <form id="testFounderForm" onsubmit="return testFounderApplication()" enctype="multipart/form-data">
        <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        
        <h4>Personal Information</h4>
        <input type="text" name="full_name" placeholder="Full Name" value="Test Founder" required><br>
        <input type="email" name="email" placeholder="Email" value="founder<?php echo rand(100,999); ?>@test.com" required><br>
        <input type="text" name="country" placeholder="Country" value="Uganda" required><br>
        
        <h4>Company Details</h4>
        <input type="text" name="company_name" placeholder="Company Name" value="Test Startup Inc" required><br>
        <input type="text" name="industry" placeholder="Industry" value="Technology" required><br>
        <select name="stage" required>
            <option value="early-stage">Early Stage</option>
            <option value="growth">Growth</option>
            <option value="scaling">Scaling</option>
        </select><br>
        
        <h4>Founder Story (Required fields)</h4>
        <textarea name="bio" placeholder="Bio" rows="3" required>Test bio for demo purposes.</textarea><br>
        <textarea name="description" placeholder="Startup Description" rows="3" required>Test startup description.</textarea><br>
        <textarea name="challenge" placeholder="Biggest Challenge" rows="3" required>Test challenge description.</textarea><br>
        <textarea name="achievement" placeholder="Key Achievement" rows="3" required>Test achievement description.</textarea><br>
        <textarea name="lesson" placeholder="Lesson Learned" rows="3" required>Test lesson learned.</textarea><br>
        
        <h4>Monday Insight & Advice</h4>
        <textarea name="insight" placeholder="Monday Insight" rows="3" required>Test Monday insight.</textarea><br>
        <textarea name="advice" placeholder="Advice for Founders" rows="3" required>Test advice for founders.</textarea><br>
        
        <button type="submit" class="btn">Test Application Submit</button>
    </form>
    <div id="founderResult"></div>
</div>

<script>
// Test Registration
async function testRegistration() {
    event.preventDefault();
    const form = document.getElementById('testRegisterForm');
    const resultDiv = document.getElementById('registerResult');
    resultDiv.innerHTML = "⏳ Testing registration...";
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch('register.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<span class="success">✅ Registration successful!<br>User ID: ${data.user_id}<br>Redirecting to: ${data.redirect}</span>`;
        } else {
            resultDiv.innerHTML = `<span class="error">❌ Registration failed:<br>${data.message}`;
            if (data.errors) {
                resultDiv.innerHTML += '<br>Errors:<br>';
                for (const [field, error] of Object.entries(data.errors)) {
                    resultDiv.innerHTML += `${field}: ${error}<br>`;
                }
            }
            resultDiv.innerHTML += '</span>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
    }
    return false;
}

// Test Login
async function testLogin() {
    event.preventDefault();
    const form = document.getElementById('testLoginForm');
    const resultDiv = document.getElementById('loginResult');
    resultDiv.innerHTML = "⏳ Testing login...";
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<span class="success">✅ Login successful!<br>Welcome ${data.user.name}<br>Account Type: ${data.user.account_type}<br>Redirecting to: ${data.redirect}</span>`;
        } else {
            resultDiv.innerHTML = `<span class="error">❌ Login failed: ${data.message}</span>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
    }
    return false;
}

// Use founder credentials
function useFounderCreds() {
    document.getElementById('login_email').value = 'john@example.com';
    document.getElementById('login_password').value = 'Founder123!';
}

// Test Founder Application
async function testFounderApplication() {
    event.preventDefault();
    const form = document.getElementById('testFounderForm');
    const resultDiv = document.getElementById('founderResult');
    resultDiv.innerHTML = "⏳ Submitting application...";
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch('submit_form.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<span class="success">✅ Application submitted!<br>Submission ID: ${data.submission_id}<br>${data.message}<br>Redirecting to: ${data.redirect}</span>`;
        } else {
            resultDiv.innerHTML = `<span class="error">❌ Submission failed:<br>${data.message}`;
            if (data.errors) {
                resultDiv.innerHTML += '<br>Errors:<br>';
                for (const [field, error] of Object.entries(data.errors)) {
                    resultDiv.innerHTML += `${field}: ${error}<br>`;
                }
            }
            resultDiv.innerHTML += '</span>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">❌ Error: ${error.message}</span>`;
    }
    return false;
}
</script>

<div style="margin-top: 40px; padding: 20px; background: #e8f4f8; border-radius: 10px;">
    <h2>📊 Quick Navigation</h2>
    <a href="test-db.php" class="btn">Test Database</a>
    <a href="index.html" class="btn">Main Website</a>
    <a href="http://localhost/phpmyadmin" class="btn" target="_blank">phpMyAdmin</a>
    <a href="test-upload.php" class="btn">Test Uploads</a>
</div>

</body></html>