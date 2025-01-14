-- 1. Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('student', 'teacher') NOT NULL,
    faculty_number VARCHAR(20),
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    essay_id INT,
    project_id INT
);

-- 2. Essays Table
CREATE TABLE Essays (
    essay_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    resources TEXT,
    own_resources TEXT,
    content_of_presentation TEXT,
    content_of_examples TEXT,
    resume_of_presentation TEXT,
    keywords JSON,
    comments TEXT,
    user_id INT NOT NULL
);

-- 3. Projects Table
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    example_distribution TEXT,
    integration TEXT,
    requirements TEXT,
    own_resources TEXT,
    keywords JSON,
    comments TEXT
);

-- 4. Slot Table
CREATE TABLE Slot (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    start_hour TIME NOT NULL,
    end_hour TIME NOT NULL,
    user_id INT NOT NULL,
    essay_id INT,
    project_id INT,
);

-- 5. FAQ Table
CREATE TABLE FAQ (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

-- Add foreign keys to the tables
ALTER TABLE Users
    ADD CONSTRAINT fk_essay FOREIGN KEY (essay_id) REFERENCES Essays(essay_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE SET NULL;

ALTER TABLE Essays
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;

ALTER TABLE Slot
    ADD CONSTRAINT fk_user_slot FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
    CONSTRAINT fk_essay_slot FOREIGN KEY (essay_id) REFERENCES Essays(essay_id) ON DELETE SET NULL,
    CONSTRAINT fk_project_slot FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE SET NULL;