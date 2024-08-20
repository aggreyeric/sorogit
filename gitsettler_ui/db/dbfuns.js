// import { openDb } from "./db";
import { turso } from "./db";

async function addIssue(
  issueid,
  poster,
  githubName,
  repositoryName,
  reward,
  endTime,
  description
) {
  await turso.execute(
    `
      INSERT INTO issues (issueid, poster, github_name, repository_name, reward, end_time, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [issueid, poster, githubName, repositoryName, reward, endTime, description]
  );
}

async function addBidder(person, githubName) {
  const result = await turso.execute(
    `
      INSERT INTO Bidder (person, bidder_github_name)
      VALUES (?, ?)
    `,
    [person, githubName]
  );
  const bidderId = result.lastID;
  return bidderId;
}

async function addBid(issueid, githubName, repositoryName, bidderId) {
  await turso.execute(
    `
      INSERT INTO Bid (issueid, github_name, repository_name, bidder_id)
      VALUES (?, ?, ?, ?)
    `,
    [issueid, githubName, repositoryName, bidderId]
  );
}

async function addBidWithBidder(
  issueid,
  githubName,
  repositoryName,
  user,
  userGithubName
) {
  try {
    const bidderId = await addBidder(user, userGithubName);
    console.log("bidderId:", bidderId);
    await addBid(issueid, githubName, repositoryName, bidderId);
    return issueid;
  } catch (error) {
    console.error("Error adding bid with bidder:", error);
    return false;
  }
}

async function linkBidToIssue(issueid, githubName, repositoryName, bidderId) {
  // This function is not needed as the foreign key constraint in the Bid table already links the bid to the issue
  // However, if you want to update the bid to link to a different issue, you can use this function

  await turso.execute(
    `
      UPDATE Bid
      SET issueid = ?, github_name = ?, repository_name = ?
      WHERE bidder_id = ?
    `,
    [issueid, githubName, repositoryName, bidderId]
  );
}

async function removeIssueAndBids(issueid, githubName, repositoryName) {
  await turso.execute(
    `
      DELETE FROM issues
      WHERE issueid = ? AND github_name = ? AND repository_name = ?
    `,
    [issueid, githubName, repositoryName]
  );
  await turso.execute(
    `
      DELETE FROM Bid
      WHERE issueid = ? AND github_name = ? AND repository_name = ?
    `,
    [issueid, githubName, repositoryName]
  );
  await turso.execute(`
      DELETE FROM Bidder
      WHERE id NOT IN (
        SELECT bidder_id
        FROM Bid
      )
    `);
}

async function getAllIssues() {
  const issues = await turso.execute(`
      SELECT * FROM issues
    `);

  return issues.rows;
}

async function getAllBiddersForIssue(issueid, githubName, repositoryName) {
  const bidders = await turso.execute(
    `
      SELECT b.id, b.person, b.bidder_github_name
      FROM Bidder b
      JOIN Bid bi ON b.id = bi.bidder_id
      WHERE bi.issueid = ? AND bi.github_name = ? AND bi.repository_name = ?
    `,
    [issueid, githubName, repositoryName]
  );
  return bidders.rows;
}

async function getAllIssuesWithBidForPerson(person) {
  const issues = await turso.execute(
    `
      SELECT DISTINCT b.issueid, b.github_name, b.repository_name
      FROM Bid b
      JOIN Bidder bd ON b.bidder_id = bd.id
      WHERE bd.person = ?`,
    [person]
  );
  return issues.rows;
}

async function setup() {
  // Open SQLite connection

  // Define table schema
  await turso.execute(`
       CREATE TABLE issues (
        issueid INTEGER NOT NULL,
        poster TEXT,
        github_name TEXT,
        repository_name TEXT,
        reward INTEGER,
        end_time TEXT,
        description TEXT,
        PRIMARY KEY (issueid, github_name, repository_name)
    );
      `);

  await turso.execute(`
    CREATE TABLE Bidder  (
    id INTEGER PRIMARY KEY  AUTOINCREMENT,
    person TEXT NOT NULL,
    bidder_github_name TEXT NOT NULL
  
       );`);

  await turso.execute(`
    CREATE TABLE Bid (
    id INTEGER PRIMARY KEY    AUTOINCREMENT,
    issueid INTEGER NOT NULL,
    github_name TEXT NOT NULL,
    repository_name TEXT NOT NULL,
    bidder_id INTEGER NOT NULL,
    FOREIGN KEY (issueid, github_name, repository_name) REFERENCES IssueData(issueid, github_name, repository_name),
    FOREIGN KEY (bidder_id) REFERENCES Bidder(id)
  );`);
}

export {
  addIssue,
  addBidder,
  addBid,
  removeIssueAndBids,
  getAllBiddersForIssue,
  getAllIssues,
  addBidWithBidder,
  getAllIssuesWithBidForPerson,
};
