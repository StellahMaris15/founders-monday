<?php
// create-htaccess.php - Creates the .htaccess file
$htaccess_content = '# Founders Monday - Security File
Options -Indexes

# Block access to important files
<FilesMatch "\.(sql|bak|env|log|ini)$">
    Deny from all
</FilesMatch>

# Block PHP files in uploads folder
<FilesMatch "\.(php|php5|phtml)$">
    Deny from all
</FilesMatch>

# Increase upload size
php_value upload_max_filesize 5M
php_value post_max_size 10M

# Simple error pages
ErrorDocument 404 /404.html
ErrorDocument 403 /403.html
ErrorDocument 500 /500.html

# Protect this file
<Files .htaccess>
    Deny from all
</Files>';

if (file_put_contents('.htaccess', $htaccess_content)) {
    echo "✅ .htaccess file created successfully!<br>";
    echo "You can delete this create-htaccess.php file now.";
} else {
    echo "❌ Could not create .htaccess file. Check permissions.";
}
?>