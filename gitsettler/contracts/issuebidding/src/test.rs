#![cfg(test)]
use super::*;
use soroban_sdk::{log, symbol_short, token, Address, Env, String};
use token::Client as TokenClient;
use token::StellarAssetClient as TokenAdminClient;






fn get_bidder_address(env: &Env) -> Address {
    let string_adr: String = String::from_str(&env,"GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR");
    Address::from_string(&string_adr)
}




fn get_admin_address(env: &Env) -> Address {
    let string_adr: String = String::from_str(&env,"GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR");
    Address::from_string(&string_adr)
}



fn get_native_asset_address(env: &Env) -> Address {
    let string_adr: String = String::from_str(&env,"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
    Address::from_string(&string_adr)
}






fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_address = e.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(e, &contract_address),
        TokenAdminClient::new(e, &contract_address),
    )
}


fn create_isssuebidding_contract<'a>(
    env: &'a Env,
    admin: &'a Address,
    token: &'a Address,
) -> IssueBiddingContractClient<'a> {
    let addr = String::from_str(&env,"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");

    // fn initialize(env: Env, admin: Address, token: Address, commission: i128) {
    
    let cid = Address::from_string(&addr);
    let client = IssueBiddingContractClient::new(env, &env.register_contract(&cid, IssueBiddingContract));
    client.initialize(admin,   &10);
    client
}





#[test]
fn test_with_native_assets() {
    let env = Env::default();
    env.mock_all_auths();

    let admin_address = get_admin_address(&env);
    let token_address = get_native_asset_address(&env);
    let client = create_isssuebidding_contract(&env, &admin_address, &token_address);

    log!(&env, "network_id: {}",client.env.ledger().network_id());

    // // Some test data
    // let issue_id: u64 = 1;
    // let github_name = symbol_short!("github1");
    // let github_name2 = symbol_short!("github2");
    // let repository_name = symbol_short!("repo");
    // let reward: i128 = 10;
    // let end_time= symbol_short!("June_12");


    // let (github_name_, repository_name_, issue_id_) = client.add_issue(
    //     &issue_id,
    //     &get_admin_address(&env),
    //     &github_name,
    //     &repository_name,
    //     &reward,
    //     &end_time,
    // );


    // assert_eq!(github_name, github_name_);
    // assert_eq!(repository_name, repository_name_);
    // assert_eq!(issue_id, issue_id_);

    // log!(&env, "issue_id: {}", issue_id_);
    // log!(&env, "github_name: {}", github_name_);
    // log!(&env, "repository_name: {}", repository_name_);



    // let i_id = client.place_bid(
    //     &issue_id,
    //     &get_bidder_address(&env),
    //     &github_name2,
    //     &github_name,
    //     &repository_name,
    // );


    // assert_eq!(i_id, 1);


    // let issue_id_eq = client.assigned_bid_to_user(
    //     &issue_id,
    //     &github_name2,
    //     &github_name,
    //     &repository_name,
    //     &get_admin_address(&env),
    // );

    // assert_eq!( issue_id_eq, 1);


    // let id = client.completed_bits(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );
    // assert_eq!(id, 1);



    // let id_released_paymet = client.release_payment(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );


    // assert_eq!(id_released_paymet, 1);


    // let id_of_removed= client.remove_issue(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );

    // assert_eq!(id_of_removed, 1);



}





#[test]
fn test_with_non_native() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = get_admin_address(&env);
    let (token, _token_admin) = create_token_contract(&env, &admin);

    let client = create_isssuebidding_contract(&env, &admin, &token.address);

    let (token, token_admin) = create_token_contract(&env, &admin);

    
       token_admin.mint(
           &get_admin_address(&env),
           &1000
       );

    assert_eq!(token.balance(&get_admin_address(&env)), 1000);
   
    // // Some test data
    // let issue_id: u64 = 1;
    // let github_name = symbol_short!("github1");
    // let github_name2 = symbol_short!("github2");
    // let repository_name = symbol_short!("repo");
    // let reward: i128 = 10;
    // let end_time: u64 = 1000;


    // let (github_name_, repository_name_, issue_id_) = client.start_issue(
    //     &issue_id,
    //     &get_admin_address(&env),
    //     &github_name,
    //     &repository_name,
    //     &reward,
    //     &end_time,
    // );


    // assert_eq!(github_name, github_name_);
    // assert_eq!(repository_name, repository_name_);
    // assert_eq!(issue_id, issue_id_);

    // log!(&env, "issue_id: {}", issue_id_);
    // log!(&env, "github_name: {}", github_name_);
    // log!(&env, "repository_name: {}", repository_name_);



    // let i_id = client.place_bid(
    //     &issue_id,
    //     &get_bidder_address(&env),
    //     &github_name2,
    //     &github_name,
    //     &repository_name,
    // );


    // assert_eq!(i_id, 1);


    // let issue_id_eq = client.assigned_bid_to_user(
    //     &issue_id,
    //     &github_name2,
    //     &github_name,
    //     &repository_name,
    //     &get_admin_address(&env),
    // );

    // assert_eq!( issue_id_eq, 1);


    // let id = client.completed_bits(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );
    // assert_eq!(id, 1);



    // let id_released_paymet = client.release_payment(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );


    // assert_eq!(id_released_paymet, 1);


    // let id_of_removed= client.remove_issue(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );

    // assert_eq!(id_of_removed, 1);








}
