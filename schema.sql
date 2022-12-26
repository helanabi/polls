BEGIN;

CREATE TABLE Users (
       id    	   SERIAL PRIMARY KEY,
       username	   TEXT UNIQUE NOT NULL,
       email	   TEXT UNIQUE NOT NULL,
       pwd_hash	   TEXT NOT NULL
);

CREATE TABLE Polls (
       id		SERIAL PRIMARY KEY,
       creator	   	INT REFERENCES Users ON DELETE SET NULL,
       title	   	TEXT NOT NULL,
       creation_time	TIMESTAMP NOT NULL
);

CREATE TABLE Choices (
       description TEXT,
       poll 	   INT REFERENCES Polls ON DELETE CASCADE,
       PRIMARY KEY (description, poll)
);

CREATE TABLE Votes (
       voter  	   INT REFERENCES Users ON DELETE CASCADE,
       poll  	   INT REFERENCES Polls ON DELETE CASCADE,
       choice	   TEXT,
       PRIMARY KEY (voter, poll, choice),
       FOREIGN KEY (poll, choice)
       REFERENCES Choices (poll, description) ON DELETE CASCADE
);

CREATE VIEW Vote_counts
       AS SELECT Choices.poll, description, COUNT(voter) AS votes
       FROM Choices LEFT JOIN Votes
       ON Choices.poll = Votes.poll AND Choices.description = Votes.choice
       GROUP BY Choices.poll, description;

COMMIT;
