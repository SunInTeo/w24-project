CREATE TABLE
    Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        user_type ENUM ('student', 'teacher') NOT NULL,
        faculty_number VARCHAR(20),
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        essay_id INT,
        project_id INT
    );

CREATE TABLE
    Essays (
        essay_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        resources TEXT,
        own_resources TEXT,
        content_of_presentation TEXT,
        content_of_examples TEXT,
        resume_of_presentation TEXT,
        keywords TEXT,
        comments TEXT,
        user_id INT NOT NULL
    );

CREATE TABLE
    Projects (
        project_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        example_distribution TEXT,
        integration TEXT,
        requirements TEXT,
        own_resources TEXT,
        keywords TEXT,
        comments TEXT
    );

CREATE TABLE
    FAQ (
        faq_id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
    );

CREATE TABLE
    PresentationDay (
        day_id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        date DATE NOT NULL,
        start_hour TIME NOT NULL,
        end_hour TIME NOT NULL,
        presentation_type ENUM ('Essay', 'Project') NOT NULL,
        duration INT NOT NULL, -- duration of each slot in minutes
        FOREIGN KEY (teacher_id) REFERENCES Users (user_id) ON DELETE CASCADE
    );

CREATE TABLE
    Slot (
        slot_id INT AUTO_INCREMENT PRIMARY KEY,
        day_id INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        essay_id INT,
        project_id INT,
        FOREIGN KEY (day_id) REFERENCES PresentationDay (day_id) ON DELETE CASCADE,
        FOREIGN KEY (essay_id) REFERENCES Essays (essay_id) ON DELETE SET NULL,
        FOREIGN KEY (project_id) REFERENCES Projects (project_id) ON DELETE SET NULL,
        CHECK (
            (
                essay_id IS NULL
                AND project_id IS NOT NULL
            )
            OR (
                essay_id IS NOT NULL
                AND project_id IS NULL
            )
        )
    );
-- 3. Projects Table
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
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE TeamMembers (
    team_member_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL, 
    user_id INT NOT NULL, 
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- 4. Slot Table
CREATE TABLE Slot (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    start_hour TIME NOT NULL,
    end_hour TIME NOT NULL,
    user_id INT NOT NULL,
    essay_id INT,
    project_id INT
);


-- 5. FAQ Table
CREATE TABLE FAQ (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

ALTER TABLE Users
ADD CONSTRAINT fk_essay FOREIGN KEY (essay_id) REFERENCES Essays (essay_id) ON DELETE SET NULL,
ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES Projects (project_id) ON DELETE SET NULL;

ALTER TABLE Essays
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE;