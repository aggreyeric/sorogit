use soroban_sdk::{contracttype, vec, Address, Env, Symbol, Vec};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    IssueData(Symbol, Symbol, u64),
    AdminData,
   
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AdminData {
    pub admin: Address,
    pub commission: i128,
    pub accepted_token: Address,

   
}


// pub struct AllIssues(Vec<IssueData>);



#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub enum StateofIssue {
    Created,
    Started,
    Completed,
    Accepted,
    Rejected,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Bidder {
    pub person: Address,
    pub bidder_github_name: Symbol,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IssueData {
    pub isssueid: u64,
    pub poster: Address,
    pub github_name: Symbol,
    pub  repository_name: Symbol,
    pub reward: i128,
    pub start_time: u64,
    pub bidders: Vec<Bidder>,
    pub end_time: Symbol,
    pub state: StateofIssue,
    pub assigned_to: Address,
}

  impl IssueData {
    pub fn new_issue(
        env: Env,
        isssueid: u64,
        poster: Address,
        github_name: Symbol,
        repository_name: Symbol,
        reward: i128,
        end_time: Symbol,
    ) -> IssueData {
        // will leter be changed to the winner developer
        let assigned_to = poster.clone();
        IssueData {
            isssueid,
            poster,
            github_name,
            repository_name,
            reward,
            start_time: env.ledger().timestamp(),
            bidders: vec![&env],
            end_time,
            state: StateofIssue::Created,
            assigned_to: assigned_to,
        }
    }
}

