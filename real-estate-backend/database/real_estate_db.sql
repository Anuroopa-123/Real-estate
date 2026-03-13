CREATE TABLE if not exists users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 role ENUM('SUPER_ADMIN','ADMIN','AGENT','BUYER') NOT NULL,
 status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ── 2. REFRESH TOKENS ────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT           NOT NULL,
  token        VARCHAR(512)  NOT NULL UNIQUE,
  expires_at   DATETIME      NOT NULL,
  revoked      TINYINT(1)    DEFAULT 0,
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token   (token(255)),
  INDEX idx_user_id (user_id)
);
 
-- ── 3. PROPERTY CATEGORIES ───────────────────────────────────
CREATE TABLE if not exists property_categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE   -- e.g. Apartment, Villa, Commercial, Plot
);
 
-- ── 4. PROPERTIES ────────────────────────────────────────────
CREATE TABLE if not exists properties (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  agent_id      INT            NOT NULL,
  category_id   INT            NOT NULL,
  title         VARCHAR(200)   NOT NULL,
  description   TEXT,
  price         DECIMAL(15,2)  NOT NULL,
  bedrooms      TINYINT        DEFAULT 0,
  bathrooms     TINYINT        DEFAULT 0,
  area_sqft     DECIMAL(10,2)  DEFAULT 0,
  address       VARCHAR(255),
  city          VARCHAR(100),
  state         VARCHAR(100),
  pincode       VARCHAR(10),
  latitude      DECIMAL(10,8)  DEFAULT NULL,
  longitude     DECIMAL(11,8)  DEFAULT NULL,
  status        ENUM('PENDING','APPROVED','REJECTED','SOLD') DEFAULT 'PENDING',
  is_featured   TINYINT(1)     DEFAULT 0,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id)    REFERENCES users(id)               ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES property_categories(id) ON DELETE RESTRICT,
  INDEX idx_status     (status),
  INDEX idx_agent      (agent_id),
  INDEX idx_city       (city),
  INDEX idx_price      (price),
  INDEX idx_featured   (is_featured),
  FULLTEXT idx_search  (title, description, city)
);
 
-- ── 5. PROPERTY IMAGES ───────────────────────────────────────
CREATE TABLE if not exists property_images (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  image_url    VARCHAR(500) NOT NULL,
  is_primary   TINYINT(1)   DEFAULT 0,
  sort_order   INT          DEFAULT 0,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property (property_id)
);
 
-- ── 6. APPOINTMENTS ──────────────────────────────────────────
CREATE TABLE if not exists appointments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  property_id     INT          NOT NULL,
  buyer_id        INT          NOT NULL,
  agent_id        INT          NOT NULL,
  scheduled_at    DATETIME     NOT NULL,
  duration_min    INT          DEFAULT 60,
  status          ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
  notes           TEXT         DEFAULT NULL,
  cancellation_reason VARCHAR(300) DEFAULT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id)    REFERENCES users(id)       ON DELETE CASCADE,
  FOREIGN KEY (agent_id)    REFERENCES users(id)       ON DELETE CASCADE,
  INDEX idx_buyer      (buyer_id),
  INDEX idx_agent      (agent_id),
  INDEX idx_property   (property_id),
  INDEX idx_status     (status),
  INDEX idx_scheduled  (scheduled_at)
);
 
-- ── 7. SAVED PROPERTIES ──────────────────────────────────────
CREATE TABLE if not exists saved_properties (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT       NOT NULL,
  property_id INT       NOT NULL,
  saved_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_save (user_id, property_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
 
-- ── 8. ADMIN LOGS (Audit Trail) ──────────────────────────────
CREATE TABLE if not exists admin_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  admin_id     INT          NOT NULL,
  action       VARCHAR(100) NOT NULL,   -- e.g. CREATE_USER, APPROVE_PROPERTY
  target_type  VARCHAR(50)  NOT NULL,   -- e.g. USER, PROPERTY, APPOINTMENT
  target_id    INT          DEFAULT NULL,
  meta         JSON         DEFAULT NULL,
  ip_address   VARCHAR(50)  DEFAULT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin  (admin_id),
  INDEX idx_action (action),
  INDEX idx_ts     (created_at)
);
 
-- ── 9. NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE if not exists notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  title       VARCHAR(150) NOT NULL,
  message     TEXT         NOT NULL,
  type        ENUM('INFO','SUCCESS','WARNING','ERROR') DEFAULT 'INFO',
  is_read     TINYINT(1)   DEFAULT 0,
  link        VARCHAR(300) DEFAULT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_unread (user_id, is_read)
);
 
-- ── 10. REVIEWS ──────────────────────────────────────────────
CREATE TABLE if not exists reviews (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT            NOT NULL,
  buyer_id    INT            NOT NULL,
  rating      TINYINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT           DEFAULT NULL,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review (property_id, buyer_id),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id)    REFERENCES users(id)       ON DELETE CASCADE
);

-- ── 11. Create admins──────────────────────────────────────────────

CREATE TABLE if not exists admins (
 id INT AUTO_INCREMENT PRIMARY KEY,

 user_id INT NOT NULL,

 phone VARCHAR(20),

 department VARCHAR(100),

 created_by INT,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE if not exists buyers (
 id INT AUTO_INCREMENT PRIMARY KEY,

 user_id INT NOT NULL,

 phone VARCHAR(20),

 budget DECIMAL(12,2),

 preferred_city VARCHAR(100),

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE if not exists agents (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 phone VARCHAR(20),
 experience_years INT DEFAULT 0,
 created_by INT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);