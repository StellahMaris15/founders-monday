-- ============================================
-- FOUNDERS MONDAY GLOBAL - DATABASE SCHEMA
-- Version: 1.0
-- Created: 2024
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS founders_monday;
USE founders_monday;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    address TEXT,
    company VARCHAR(100),
    account_type ENUM('founder', 'member', 'investor', 'mentor', 'admin') NOT NULL DEFAULT 'member',
    password_hash VARCHAR(255) NOT NULL,
    verification_token VARCHAR(64),
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(255),
    bio TEXT,
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_handle VARCHAR(50),
    
    -- Account status
    status ENUM('active', 'pending', 'suspended', 'banned') DEFAULT 'pending',
    last_login DATETIME,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME,
    
    -- Preferences
    newsletter_subscribed BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status),
    INDEX idx_account_type (account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FOUNDER SUBMISSIONS TABLE
-- ============================================
CREATE TABLE founder_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    
    -- Personal Information
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    linkedin_url VARCHAR(255),
    personal_website VARCHAR(255),
    
    -- Company Details
    company_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    company_website VARCHAR(255),
    year_founded YEAR,
    stage ENUM('idea', 'mvp', 'early-stage', 'growth', 'scaling') NOT NULL,
    team_size INT,
    
    -- Founder Story
    bio TEXT NOT NULL,
    startup_description TEXT NOT NULL,
    biggest_challenge TEXT NOT NULL,
    key_achievement TEXT NOT NULL,
    lesson TEXT NOT NULL,
    
    -- Monday Insight
    monday_insight TEXT NOT NULL,
    advice TEXT NOT NULL,
    
    -- Media
    photo_path VARCHAR(255),
    logo_path VARCHAR(255),
    interview_link VARCHAR(255),
    social_media_handles TEXT,
    
    -- Submission Status
    status ENUM('pending', 'reviewed', 'approved', 'rejected', 'featured') DEFAULT 'pending',
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Review Information
    reviewer_id INT,
    review_date DATETIME,
    review_notes TEXT,
    score INT CHECK (score >= 0 AND score <= 100),
    
    -- Feature Information
    feature_date DATE,
    prize_awarded DECIMAL(10,2),
    prize_paid BOOLEAN DEFAULT FALSE,
    payment_date DATETIME,
    
    -- Stats
    views_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_submission_date (submission_date),
    INDEX idx_feature_date (feature_date),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FEATURED FOUNDERS TABLE
-- ============================================
CREATE TABLE featured_founders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    
    -- Feature Details
    feature_date DATE NOT NULL,
    feature_title VARCHAR(200),
    feature_summary TEXT,
    full_story LONGTEXT,
    
    -- Media
    featured_image VARCHAR(255),
    gallery_images JSON,
    video_links JSON,
    
    -- Prize Information
    prize_amount DECIMAL(10,2) NOT NULL,
    prize_currency VARCHAR(10) DEFAULT 'UGX',
    prize_paid BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Stats
    views_count INT DEFAULT 0,
    unique_views INT DEFAULT 0,
    social_shares INT DEFAULT 0,
    engagement_score DECIMAL(5,2),
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    slug VARCHAR(200) UNIQUE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (submission_id) REFERENCES founder_submissions(id) ON DELETE CASCADE,
    
    -- Indexes
    UNIQUE KEY unique_feature_date (feature_date),
    INDEX idx_slug (slug),
    INDEX idx_views (views_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COMMUNITY MEMBERS TABLE
-- ============================================
CREATE TABLE community_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Community Platforms
    whatsapp_number VARCHAR(20),
    telegram_username VARCHAR(50),
    discord_id VARCHAR(50),
    
    -- Community Info
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME,
    member_level ENUM('new', 'active', 'core', 'ambassador') DEFAULT 'new',
    
    -- Engagement
    posts_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    likes_given INT DEFAULT 0,
    reports_count INT DEFAULT 0,
    
    -- Badges
    badges JSON,
    achievements JSON,
    
    -- Preferences
    notification_preferences JSON,
    privacy_settings JSON,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_member_level (member_level),
    INDEX idx_join_date (join_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Event Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type ENUM('workshop', 'networking', 'pitch', 'conference', 'webinar') NOT NULL,
    
    -- Timing
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    
    -- Location
    location_type ENUM('virtual', 'physical', 'hybrid') DEFAULT 'virtual',
    venue_name VARCHAR(200),
    venue_address TEXT,
    virtual_link VARCHAR(255),
    meeting_id VARCHAR(100),
    
    -- Organizer
    organizer_id INT,
    co_organizers JSON,
    
    -- Capacity
    max_attendees INT,
    waiting_list_enabled BOOLEAN DEFAULT TRUE,
    
    -- Registration
    registration_open BOOLEAN DEFAULT TRUE,
    registration_deadline DATETIME,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'UGX',
    
    -- Event Status
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    
    -- Media
    banner_image VARCHAR(255),
    gallery_images JSON,
    
    -- SEO
    slug VARCHAR(200) UNIQUE,
    meta_description TEXT,
    
    -- Stats
    views_count INT DEFAULT 0,
    registrations_count INT DEFAULT 0,
    attendance_count INT DEFAULT 0,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_start_date (start_date),
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    UNIQUE KEY unique_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Registration Details
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    registration_status ENUM('pending', 'confirmed', 'cancelled', 'attended', 'no_show') DEFAULT 'pending',
    
    -- Payment
    payment_status ENUM('pending', 'paid', 'refunded', 'cancelled') DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_date DATETIME,
    
    -- Attendee Info
    dietary_preferences TEXT,
    special_requirements TEXT,
    
    -- Check-in
    check_in_time DATETIME,
    check_out_time DATETIME,
    
    -- Feedback
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    feedback_date DATETIME,
    
    -- Foreign Keys
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    UNIQUE KEY unique_event_user (event_id, user_id),
    INDEX idx_registration_status (registration_status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Resource Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content LONGTEXT,
    resource_type ENUM('article', 'template', 'video', 'toolkit', 'course', 'checklist') NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- Media
    cover_image VARCHAR(255),
    file_path VARCHAR(255),
    file_size INT,
    file_type VARCHAR(50),
    
    -- Access
    access_level ENUM('free', 'premium', 'members_only') DEFAULT 'free',
    requires_login BOOLEAN DEFAULT FALSE,
    
    -- SEO
    slug VARCHAR(200) UNIQUE,
    meta_title VARCHAR(200),
    meta_description TEXT,
    keywords TEXT,
    
    -- Stats
    views_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Author
    author_id INT,
    contributor_ids JSON,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME,
    
    -- Status
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    
    -- Foreign Key
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_resource_type (resource_type),
    INDEX idx_access_level (access_level),
    INDEX idx_status (status),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    
    -- Testimonial Content
    content TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    
    -- Author Info (if not a registered user)
    author_name VARCHAR(100),
    author_title VARCHAR(100),
    author_company VARCHAR(100),
    author_image VARCHAR(255),
    
    -- Display
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verification_date DATETIME,
    
    -- Status
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_featured (featured),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NEWSLETTER SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE newsletter_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    
    -- Subscription Details
    subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    subscription_source VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Preferences
    categories JSON,
    frequency ENUM('weekly', 'monthly', 'quarterly') DEFAULT 'weekly',
    
    -- Status
    status ENUM('active', 'unsubscribed', 'bounced', 'complained') DEFAULT 'active',
    unsubscribed_at DATETIME,
    unsubscribe_reason TEXT,
    
    -- Verification
    verification_token VARCHAR(64),
    verified BOOLEAN DEFAULT FALSE,
    verification_date DATETIME,
    
    -- Stats
    emails_sent INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    last_email_sent DATETIME,
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Sender Info
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    
    -- Message
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('general', 'support', 'partnership', 'media', 'other') DEFAULT 'general',
    
    -- Status
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    
    -- Response
    assigned_to INT,
    response TEXT,
    responded_at DATETIME,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer_url VARCHAR(500),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    
    -- Session Data
    data TEXT,
    
    -- Security
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Action Details
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    
    -- Changes
    old_values JSON,
    new_values JSON,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    url VARCHAR(500),
    
    -- Timestamp
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Setting Details
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json', 'array') DEFAULT 'string',
    category VARCHAR(50),
    
    -- Metadata
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'Founders Monday Global', 'string', 'general', 'Website name'),
('site_email', 'hello@foundersmonday.com', 'string', 'general', 'Default email address'),
('site_url', 'http://localhost/founders-monday', 'string', 'general', 'Website URL'),
('weekly_prize', '100000', 'integer', 'prize', 'Weekly prize amount in UGX'),
('currency', 'UGX', 'string', 'prize', 'Currency code'),
('contact_phone', '+256 XXX XXX XXX', 'string', 'contact', 'Contact phone number'),
('contact_address', 'Kampala, Uganda', 'string', 'contact', 'Physical address'),
('social_whatsapp', 'https://chat.whatsapp.com/Kliov7hj0QV6oG9JiuAorq', 'string', 'social', 'WhatsApp group link'),
('social_instagram', 'https://www.instagram.com/foundersmondayglobal', 'string', 'social', 'Instagram profile'),
('social_twitter', 'https://x.com/NaddambaL70150', 'string', 'social', 'Twitter/X profile'),
('theme_primary_color', '#D4AF37', 'string', 'theme', 'Primary color (gold)'),
('theme_secondary_color', '#1E3A8A', 'string', 'theme', 'Secondary color (blue)'),
('theme_background_color', '#FFFFFF', 'string', 'theme', 'Background color'),
('theme_text_color', '#1A1A1A', 'string', 'theme', 'Text color'),
('enable_registration', 'true', 'boolean', 'users', 'Allow new user registration'),
('enable_verification', 'true', 'boolean', 'users', 'Require email verification'),
('max_file_size', '5242880', 'integer', 'uploads', 'Maximum file size in bytes (5MB)'),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf"]', 'json', 'uploads', 'Allowed file extensions'),
('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode');

-- ============================================
-- CREATE TRIGGERS
-- ============================================

-- Update updated_at timestamp on founder_submissions
DELIMITER $$
CREATE TRIGGER before_founder_submissions_update
BEFORE UPDATE ON founder_submissions
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Create audit log entry for user updates
DELIMITER $$
CREATE TRIGGER after_users_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action_type, table_name, record_id, old_values, new_values)
    VALUES (NEW.id, 'UPDATE', 'users', NEW.id, 
           JSON_OBJECT('email', OLD.email, 'status', OLD.status, 'account_type', OLD.account_type),
           JSON_OBJECT('email', NEW.email, 'status', NEW.status, 'account_type', NEW.account_type));
END$$
DELIMITER ;

-- Create audit log for founder submissions
DELIMITER $$
CREATE TRIGGER after_founder_submissions_insert
AFTER INSERT ON founder_submissions
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (user_id, action_type, table_name, record_id, new_values)
    VALUES (NEW.user_id, 'INSERT', 'founder_submissions', NEW.id,
           JSON_OBJECT('full_name', NEW.full_name, 'company_name', NEW.company_name, 'status', NEW.status));
END$$
DELIMITER ;

-- ============================================
-- CREATE VIEWS
-- ============================================

-- View for active featured founders
CREATE VIEW vw_featured_founders AS
SELECT 
    ff.*,
    fs.full_name,
    fs.company_name,
    fs.industry,
    fs.country,
    fs.photo_path,
    fs.logo_path,
    u.username,
    u.email as founder_email
FROM featured_founders ff
JOIN founder_submissions fs ON ff.submission_id = fs.id
LEFT JOIN users u ON fs.user_id = u.id
WHERE ff.feature_date <= CURDATE()
ORDER BY ff.feature_date DESC;

-- View for community statistics
CREATE VIEW vw_community_stats AS
SELECT 
    COUNT(DISTINCT u.id) as total_members,
    COUNT(DISTINCT CASE WHEN u.account_type = 'founder' THEN u.id END) as total_founders,
    COUNT(DISTINCT CASE WHEN u.account_type = 'investor' THEN u.id END) as total_investors,
    COUNT(DISTINCT CASE WHEN u.account_type = 'mentor' THEN u.id END) as total_mentors,
    COUNT(DISTINCT fs.id) as total_submissions,
    COUNT(DISTINCT ff.id) as total_featured,
    AVG(CASE WHEN t.rating > 0 THEN t.rating END) as average_rating
FROM users u
LEFT JOIN founder_submissions fs ON u.id = fs.user_id
LEFT JOIN featured_founders ff ON fs.id = ff.submission_id
LEFT JOIN testimonials t ON u.id = t.user_id
WHERE u.status = 'active';

-- View for upcoming events
CREATE VIEW vw_upcoming_events AS
SELECT 
    e.*,
    u.full_name as organizer_name,
    COUNT(er.id) as registered_count,
    CASE 
        WHEN e.max_attendees IS NOT NULL AND e.max_attendees > 0 
        THEN ROUND((COUNT(er.id) * 100.0 / e.max_attendees), 2)
        ELSE NULL
    END as registration_percentage
FROM events e
LEFT JOIN users u ON e.organizer_id = u.id
LEFT JOIN event_registrations er ON e.id = er.event_id AND er.registration_status = 'confirmed'
WHERE e.start_date >= CURDATE() 
    AND e.status = 'published'
GROUP BY e.id
ORDER BY e.start_date ASC;

-- ============================================
-- CREATE STORED PROCEDURES
-- ============================================

-- Procedure to select weekly winner
DELIMITER $$
CREATE PROCEDURE SelectWeeklyWinner(IN week_date DATE)
BEGIN
    DECLARE winner_id INT;
    
    -- Select random approved submission that hasn't been featured
    SELECT fs.id INTO winner_id
    FROM founder_submissions fs
    WHERE fs.status = 'approved'
        AND fs.id NOT IN (SELECT submission_id FROM featured_founders)
    ORDER BY RAND()
    LIMIT 1;
    
    -- If winner found, mark as featured
    IF winner_id IS NOT NULL THEN
        -- Update submission status
        UPDATE founder_submissions 
        SET status = 'featured', 
            feature_date = week_date,
            prize_awarded = (SELECT setting_value FROM settings WHERE setting_key = 'weekly_prize')
        WHERE id = winner_id;
        
        -- Insert into featured founders
        INSERT INTO featured_founders (submission_id, feature_date, prize_amount)
        SELECT 
            winner_id,
            week_date,
            (SELECT setting_value FROM settings WHERE setting_key = 'weekly_prize')
        FROM dual;
        
        -- Return winner details
        SELECT 
            'success' as result,
            fs.full_name,
            fs.company_name,
            fs.email,
            fs.prize_awarded
        FROM founder_submissions fs
        WHERE fs.id = winner_id;
    ELSE
        SELECT 'error' as result, 'No eligible submissions found' as message;
    END IF;
END$$
DELIMITER ;

-- Procedure to send weekly newsletter
DELIMITER $$
CREATE PROCEDURE SendWeeklyNewsletter(IN newsletter_date DATE)
BEGIN
    -- Get featured founder of the week
    SELECT 
        ff.feature_date,
        fs.full_name,
        fs.company_name,
        fs.industry,
        fs.country,
        ff.prize_amount,
        fs.startup_description
    INTO @feature_date, @founder_name, @company_name, @industry, @country, @prize_amount, @description
    FROM featured_founders ff
    JOIN founder_submissions fs ON ff.submission_id = fs.id
    WHERE ff.feature_date = newsletter_date
    LIMIT 1;
    
    -- Get upcoming events
    SELECT 
        GROUP_CONCAT(CONCAT(e.title, ' - ', DATE_FORMAT(e.start_date, '%W, %M %d at %h:%i %p')) SEPARATOR '||') 
    INTO @upcoming_events
    FROM events e
    WHERE e.start_date BETWEEN newsletter_date AND DATE_ADD(newsletter_date, INTERVAL 7 DAY)
        AND e.status = 'published';
    
    -- Get new resources
    SELECT 
        GROUP_CONCAT(CONCAT(r.title, ' - ', r.resource_type) SEPARATOR '||') 
    INTO @new_resources
    FROM resources r
    WHERE r.created_at >= DATE_SUB(newsletter_date, INTERVAL 7 DAY)
        AND r.status = 'published';
    
    -- Return newsletter data
    SELECT 
        @feature_date as feature_date,
        @founder_name as founder_name,
        @company_name as company_name,
        @industry as industry,
        @country as country,
        @prize_amount as prize_amount,
        @description as description,
        @upcoming_events as upcoming_events,
        @new_resources as new_resources;
END$$
DELIMITER ;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Add composite indexes for common queries
CREATE INDEX idx_user_status ON users(status, account_type);
CREATE INDEX idx_submission_status_date ON founder_submissions(status, submission_date);
CREATE INDEX idx_event_status_date ON events(status, start_date);
CREATE INDEX idx_resource_status_date ON resources(status, created_at);

-- Add fulltext indexes for search
ALTER TABLE founder_submissions ADD FULLTEXT idx_search_submissions (full_name, company_name, industry, bio, startup_description);
ALTER TABLE resources ADD FULLTEXT idx_search_resources (title, description, content, keywords);
ALTER TABLE events ADD FULLTEXT idx_search_events (title, description, venue_name);

-- ============================================
-- INSERT SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert sample admin user (password: Admin123!)
INSERT INTO users (full_name, username, email, phone, account_type, password_hash, status, email_verified) 
VALUES ('Admin User', 'admin', 'admin@foundersmonday.com', '+256700000000', 'admin', 
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE);

-- Insert sample founder user (password: Founder123!)
INSERT INTO users (full_name, username, email, phone, account_type, password_hash, status, email_verified) 
VALUES ('John Founder', 'jfounder', 'john@example.com', '+256700000001', 'founder', 
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE);

-- Insert sample submissions
INSERT INTO founder_submissions (
    user_id, full_name, email, phone, country, company_name, industry, stage,
    bio, startup_description, biggest_challenge, key_achievement, lesson,
    monday_insight, advice, status, submission_date
) VALUES 
(2, 'John Founder', 'john@example.com', '+256700000001', 'Uganda', 'TechSolutions', 
 'Technology', 'growth', 'Experienced tech entrepreneur', 'AI-powered business solutions',
 'Finding technical talent', 'Secured first major client', 'Start with customer validation',
 'Focus on solving real problems', 'Build a strong team early', 'approved', '2024-01-01'),
(2, 'Sarah Entrepreneur', 'sarah@example.com', '+256700000002', 'Kenya', 'AgriTech Africa', 
 'Agriculture', 'early-stage', 'Passionate about agriculture innovation', 'Mobile farming platform',
 'Access to funding', 'Reached 1000 farmers', 'Network is key to success',
 'Consistency beats intensity', 'Start small, think big', 'approved', '2024-01-08');

-- Insert sample featured founders
INSERT INTO featured_founders (submission_id, feature_date, prize_amount, feature_title) 
VALUES 
(1, '2024-01-01', 100000, 'Tech Innovator of the Week'),
(2, '2024-01-08', 100000, 'Agriculture Pioneer');

-- Insert sample events
INSERT INTO events (title, description, event_type, start_date, end_date, location_type, 
                   virtual_link, organizer_id, status) 
VALUES 
('Pitch Perfect Workshop', 'Learn how to craft the perfect investor pitch', 'workshop', 
 '2024-01-15 14:00:00', '2024-01-15 16:00:00', 'virtual', 'https://meet.google.com/xyz',
 1, 'published'),
('Investor Connect Session', 'Meet angel investors looking for startups', 'networking',
 '2024-01-22 15:00:00', '2024-01-22 17:00:00', 'virtual', 'https://meet.google.com/abc',
 1, 'published');

-- Insert sample resources
INSERT INTO resources (title, description, resource_type, category, content, 
                      access_level, author_id, status, published_at) 
VALUES 
('Pitch Deck Template', 'Professional pitch deck template for startups', 'template', 
 'funding', 'Download our comprehensive pitch deck template...', 'free', 1, 'published', NOW()),
('Startup Funding Guide', 'Complete guide to startup funding in Africa', 'article',
 'funding', 'This guide covers all funding options...', 'free', 1, 'published', NOW());

-- Insert sample testimonials
INSERT INTO testimonials (user_id, content, rating, author_name, author_title, 
                         author_company, featured, status) 
VALUES 
(2, 'Founders Monday gave my startup the visibility it needed. Highly recommended!', 5,
 'John Founder', 'CEO', 'TechSolutions', TRUE, 'approved'),
(NULL, 'The community support has been invaluable for growing my business.', 5,
 'Sarah Entrepreneur', 'Founder', 'AgriTech Africa', TRUE, 'approved');