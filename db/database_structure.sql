CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM ('student', 'teacher') NOT NULL,
    faculty_number VARCHAR(20) UNIQUE NULL,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    essay_id INT NULL,
    project_id INT NULL,
    essay_presentation_datetime DATETIME,
    project_presentation_datetime DATETIME
);

CREATE TABLE Essays (
    essay_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    resources TEXT,
    own_resources TEXT,
    content_of_presentation TEXT,
    content_of_examples TEXT,
    resume_of_presentation TEXT,
    keywords TEXT,
    comments TEXT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);

CREATE TABLE FAQ (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

CREATE TABLE PresentationDays (
    day_id INT AUTO_INCREMENT PRIMARY KEY,
    day_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    interval_count INT NOT NULL,
    presentation_type ENUM ('Essay', 'Project') NOT NULL
);

CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    example_distribution_1 TEXT,
    example_distribution_2 TEXT,
    example_distribution_3 TEXT,
    integration TEXT,
    requirements TEXT,
    comments TEXT
);

CREATE TABLE Teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    team_comments TEXT,
    sample_distribution_1 TEXT,
    sample_distribution_2 TEXT,
    sample_distribution_3 TEXT,
    FOREIGN KEY (project_id) REFERENCES Projects (project_id) ON DELETE CASCADE
);

CREATE TABLE TeamMembers (
    team_member_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Teams (team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);

CREATE TABLE ProposedTopics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    proposal_type ENUM ('Essay', 'Project') NOT NULL,
    topic_label VARCHAR(255) NOT NULL,
    topic_info TEXT NOT NULL,
    proposed_by_user_id VARCHAR(20), 
    proposed_by_user_name TEXT NOT NULL,
    FOREIGN KEY (proposed_by_user_id) REFERENCES Users(faculty_number) ON DELETE CASCADE
);

ALTER TABLE Users 
ADD CONSTRAINT fk_essay FOREIGN KEY (essay_id) REFERENCES Essays (essay_id) ON DELETE SET NULL,
ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES Projects (project_id) ON DELETE SET NULL;
