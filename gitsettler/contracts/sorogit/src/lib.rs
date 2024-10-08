/*
    Date: 2024
    Author: Aggrey Eric Majuk
    MIT License
*/

#![no_std]
mod types;
use types::{AdminData, DataKey, IssueData, Bidder, StateofIssue};
use soroban_sdk::{
    contract, contractimpl, contractmeta, symbol_short, token, vec, Address, BytesN, Env, String, Symbol, Vec
};


contractmeta!(
    key = "desc",
    val = "Soroban Contract for Biding on GitHub Issues and Get Paid in Crypto"
);

#[contract]
pub struct SoroGitContract;

 pub trait SoroGitContractTrait {
    // Upgrade this contract.
    // Admin authorization required.

    fn upgrade(e: Env, wasm_hash: BytesN<32>);
    // Retrieve the contract version.
    fn version(env: Env) -> Vec<u32>;
    
     fn initialize(env:Env, admin:Address,  commission: i128);

    fn add_issue(
        env: Env,
        isssueid: u64,
        poster: Address,
        github_name: Symbol,
        repository_name: Symbol,
        reward: i128,
        end_time: Symbol,
   
    )->(Symbol, Symbol, u64);




    fn place_bid(env: Env, issue_id: u64, person: Address, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol)->u64;

    fn assigned_bid_to_user(env: Env, issue_id: u64, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol,admin: Address)->u64; 

    fn completed_bits(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, person: Address)->u64;

    fn release_payment(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, admin: Address)->u64;
    
    fn reject_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, poster: Address)->u64;

    fn admin_force_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->u64;
    fn get_data(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->IssueData;
    fn return_bidder(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->Vec<Bidder>;

    fn  return_bidder_status(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->(Address, Symbol);

   
    
}









#[contractimpl]
impl  SoroGitContractTrait for  SoroGitContract {


    fn upgrade(env: Env, wasm_hash: BytesN<32>) {
        let admin = get_admin_data(&env).0;
        admin.require_auth();
        env.deployer().update_current_contract_wasm(wasm_hash);
    }

     fn initialize(env: Env, admin: Address, commission: i128) {
        assert!( !env.storage().persistent().has(&DataKey::AdminData),   "already initialized");
        let token = get_native_asset_address(&env);
        put_admin_data(&env, admin, commission, token);
    }



    
    fn add_issue(
        env: Env,
        isssueid: u64,
        poster: Address,
        github_name: Symbol,
        repository_name: Symbol,
        reward: i128,
        end_time: Symbol,
    
    ) -> (Symbol, Symbol, u64) {


        poster.require_auth();

    
        let issue_data = IssueData::new_issue(
            env.clone(),
            isssueid,
            poster.clone(),
            github_name.clone(),
            repository_name.clone(),
            reward,
            end_time,
        );
      
        pay_to_contract(&env, &poster, reward);
   
        env.storage().persistent().set(&DataKey::IssueData(github_name.clone(), repository_name.clone(),isssueid), &issue_data);
        (github_name, repository_name, isssueid)
    }


   


    fn place_bid(env: Env, issue_id: u64, person: Address, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol)->u64 {

        person.require_auth();
        // Retrieve the issue data
        let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");

        // Add the bidder to the issue data
        issue_data.bidders.push_back(Bidder { person, bidder_github_name });

        // Update the issue data in storage
        env.storage().persistent().set(&DataKey::IssueData(github_name, repository_name,issue_id), &issue_data);
       

        issue_id
    }





    fn assigned_bid_to_user(env: Env, issue_id: u64, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol,poster: Address)->u64 {

        poster.require_auth();
        // Retrieve the issue data
        let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");
        assert_eq!(issue_data.poster, poster);

        // Find the bidder and assign the issue to them
        let bidder_index = issue_data
            .bidders
            .iter()
            .position(|b| b.bidder_github_name == bidder_github_name)
            .expect("Bidder not found");

        issue_data.assigned_to = issue_data.bidders.get(bidder_index as u32).unwrap().person;
        issue_data.state = StateofIssue::Started;

        // Update the issue data in storage
        env.storage().persistent().set(&DataKey::IssueData(github_name, repository_name,issue_id), &issue_data);

        issue_id
    }



    fn completed_bits(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, user:Address)->u64 {
       user.require_auth();
        let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");
        issue_data.state = StateofIssue::Completed;
        assert_eq!(issue_data.assigned_to, user);
       
        env.storage().persistent().set(&DataKey::IssueData(github_name, repository_name,issue_id), &issue_data);
        issue_id

        
    }


    

    fn release_payment(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, poster:Address)->u64 {
        poster.require_auth();
        let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");
        issue_data.state = StateofIssue::Accepted;
        assert_eq!(issue_data.poster, poster);
        assert!(get_contract_balance(&env)> issue_data.reward);

                // Transfer the amount to the winner
        transfer_to_gituser(&env, &issue_data.assigned_to,  &issue_data.reward);
    
        // Update the issue data in storage
        env.storage().persistent().set(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id), &issue_data);
        remove_issue(env, issue_id, github_name, repository_name);
        issue_id
   
}


  fn admin_force_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->u64 {

        let admin_data = get_admin_data(&env);
        let admin = admin_data.0;
        admin.require_auth();

        let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");
        issue_data.state = StateofIssue::Accepted;
        assert!(get_contract_balance(&env)> issue_data.reward);
        // Transfer the amount to the winner
        transfer_to_gituser(&env, &issue_data.assigned_to,  &issue_data.reward);
    
        // Update the issue data in storage
        env.storage().persistent().set(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id), &issue_data);

        remove_issue(env, issue_id, github_name, repository_name);
        issue_id
}


fn reject_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, poster: Address)->u64 {
 
    poster.require_auth();
    let mut issue_data:IssueData = env.storage().persistent().get(&DataKey::IssueData(github_name.clone(), repository_name.clone(),issue_id)).expect("Issue not found");
    issue_data.state = StateofIssue::Rejected;
    // Update the issue data in storage
    env.storage().persistent().set(&DataKey::IssueData(github_name, repository_name,issue_id), &issue_data);
    issue_id

}


fn get_data(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->IssueData{
    get_issue_data(env, issue_id, github_name, repository_name).unwrap()
}

fn return_bidder(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->Vec<Bidder>{
    get_issue_data(env, issue_id, github_name, repository_name).unwrap().bidders


}

fn  return_bidder_status(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->(Address, Symbol){


    let issue_data:IssueData = get_issue_data(env, issue_id, github_name, repository_name).expect("Issue not found");


    let state: Symbol = match issue_data.state {

        StateofIssue::Created => symbol_short!("Created"),
        StateofIssue::Started => symbol_short!("Started"),
        StateofIssue::Completed => symbol_short!("Completed"),
        StateofIssue::Rejected => symbol_short!("Rejected"),
        StateofIssue::Accepted => symbol_short!("Accepted"),
        
    };

    (issue_data.assigned_to, state)
}

// returns version  "0.1.0"
fn version(env: Env) -> Vec<u32> {
    vec![&env, 0, 1, 0] 
}

}



// Helper functions


fn put_admin_data(env: &Env, admin: Address, commission: i128, accepted_token: Address) {
    env.storage().persistent().set(&DataKey::AdminData, &AdminData { admin, commission, accepted_token });
}


fn get_admin_data(env: &Env) -> (Address, i128, Address) {
   let admin_data :AdminData = env.storage()
        .persistent()
        .get(&DataKey::AdminData)
        .expect("not initialized");
   (admin_data.admin, admin_data.commission, admin_data.accepted_token)


}


fn get_contract_balance(env: &Env) -> i128 {
    
    let admin_data :AdminData = env.storage()
        .persistent()
        .get(&DataKey::AdminData)
        .expect("not initialized");
    let client = token::Client::new(env, &admin_data.accepted_token);
    client.balance(&env.current_contract_address())
}


// Transfer tokens from the contract to the recipient
 fn transfer_to_gituser(env: &Env, to: &Address, amount: &i128) {
     let admin_data = get_admin_data(env);
    let client = token::Client::new(env, &admin_data.2);
    client.transfer(&env.current_contract_address(), to, amount);
}


// Transfer tokens from the poster to the contract 
fn pay_to_contract(env: &Env, from_poster: &Address, reward: i128) {
    let admin_data = get_admin_data(env);
   let client = token::Client::new(env, &admin_data.2);
   let total = admin_data.1 + reward;
   client.transfer(from_poster, &env.current_contract_address(), &total );
}


fn get_issue_data(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol) -> Option<IssueData> {
    env.storage().persistent().get(&DataKey::IssueData(github_name, repository_name,issue_id))
}


fn remove_issue(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->u64 {

    env.storage().persistent().remove(&DataKey::IssueData(github_name, repository_name,issue_id));
    issue_id
 
 }
 
 fn get_native_asset_address(env: &Env) -> Address {
    let string_adr: String = String::from_str(&env,"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
    Address::from_string(&string_adr)
}







mod test;
