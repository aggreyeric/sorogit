import { openDb } from "./db";


async function setup() {
  // Open SQLite connection
  const db = await openDb();

  // Define table schema
  await db.exec(`
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

  await db.exec(`
  CREATE TABLE Bidder  (
  id INTEGER PRIMARY KEY  AUTOINCREMENT,
  person TEXT NOT NULL,
  bidder_github_name TEXT NOT NULL

     );`);

  await db.exec(`
  CREATE TABLE Bid (
  id INTEGER PRIMARY KEY    AUTOINCREMENT,
  issueid INTEGER NOT NULL,
  github_name TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  bidder_id INTEGER NOT NULL,
  FOREIGN KEY (issueid, github_name, repository_name) REFERENCES IssueData(issueid, github_name, repository_name),
  FOREIGN KEY (bidder_id) REFERENCES Bidder(id)
);`);

 
  // Close connection
  await db.close();
}



async function addIssue(issueid, poster, githubName, repositoryName, reward, endTime, description) {
    const db = await openDb();
    await db.run(`
      INSERT INTO issues (issueid, poster, github_name, repository_name, reward, end_time, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [issueid, poster, githubName, repositoryName, reward, endTime, description]);
    await db.close();
  }
  
  async function addBidder(person, githubName) {
    const db = await openDb();
    const result = await db.run(`
      INSERT INTO Bidder (person, bidder_github_name)
      VALUES (?, ?)
    `, [person, githubName]);
    const bidderId = result.lastID;
    await db.close();
    return bidderId;
  }
  
  async function addBid(issueid, githubName, repositoryName, bidderId) {
    const db = await openDb();
    await db.run(`
      INSERT INTO Bid (issueid, github_name, repository_name, bidder_id)
      VALUES (?, ?, ?, ?)
    `, [issueid, githubName, repositoryName, bidderId]);
    await db.close();  
  }
  
  
  async function addBidWithBidder(issueid, githubName, repositoryName, user,  userGithubName) {
    try {
      const bidderId = await addBidder(user, userGithubName);
      await addBid(issueid, githubName, repositoryName, bidderId);
      return issueid
    } catch (error) {
      console.error('Error adding bid with bidder:', error);
      return false;
    }

  }
  

  async function linkBidToIssue(issueid, githubName, repositoryName, bidderId) {
    // This function is not needed as the foreign key constraint in the Bid table already links the bid to the issue
    // However, if you want to update the bid to link to a different issue, you can use this function
    const db = await openDb();
    await db.run(`
      UPDATE Bid
      SET issueid = ?, github_name = ?, repository_name = ?
      WHERE bidder_id = ?
    `, [issueid, githubName, repositoryName, bidderId]);
    await db.close();

  }


  async function removeIssueAndBids(issueid, githubName, repositoryName) {
    const db = await openDb();
    await db.run(`
      DELETE FROM issues
      WHERE issueid = ? AND github_name = ? AND repository_name = ?
    `, [issueid, githubName, repositoryName]);
    await db.run(`
      DELETE FROM Bid
      WHERE issueid = ? AND github_name = ? AND repository_name = ?
    `, [issueid, githubName, repositoryName]);
    await db.run(`
      DELETE FROM Bidder
      WHERE id NOT IN (
        SELECT bidder_id
        FROM Bid
      )
    `);
    await db.close();
  }



  async function getAllIssues() {
    const db = await openDb();
    const issues = await db.all(`
      SELECT * FROM issues
    `);
    await db.close();
    return issues;
  }
  
  async function getAllBiddersForIssue(issueid, githubName, repositoryName) {
    const db = await openDb();
    const bidders = await db.all(`
      SELECT b.id, b.person, b.bidder_github_name
      FROM Bidder b
      JOIN Bid bi ON b.id = bi.bidder_id
      WHERE bi.issueid = ? AND bi.github_name = ? AND bi.repository_name = ?
    `, [issueid, githubName, repositoryName]);
    await db.close();
    return bidders;
  }


  async function getAllIssuesWithBidForPerson(person) {
    const db = await openDb();
    const issues = await db.all(`
      SELECT DISTINCT b.issueid, b.github_name, b.repository_name
      FROM Bid b
      JOIN Bidder bd ON b.bidder_id = bd.id
      WHERE bd.person = ?
    `, [person]);
    await db.close();
    return issues;
  }



export {addIssue, addBidder, addBid, removeIssueAndBids, getAllBiddersForIssue, getAllIssues, addBidWithBidder, getAllIssuesWithBidForPerson}