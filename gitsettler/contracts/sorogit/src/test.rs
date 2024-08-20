#![cfg(test)]
use super::*;
use soroban_sdk::{symbol_short, token, Address, Env, String};
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



fn _get_native_asset_address(env: &Env) -> Address {
    let string_adr: String = String::from_str(&env,"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
    Address::from_string(&string_adr)
}






fn _create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_address = e.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(e, &contract_address),
        TokenAdminClient::new(e, &contract_address),
    )
}


fn create_isssuebidding_contract<'a>(
    env: &'a Env,
    admin: &'a Address,
 
) -> SoroGitContractClient<'a> {
    let addr = String::from_str(&env,"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");

    // fn initialize(env: Env, admin: Address, token: Address, commission: i128) {
    
    let cid = Address::from_string(&addr);
    let client = SoroGitContractClient::new(env, &env.register_contract(&cid, SoroGitContract));
    client.initialize(admin,   &10);
    client
}





#[test]
fn test_with_native_assets() {
    let env = Env::default();
    env.mock_all_auths();

    let admin_address = get_admin_address(&env);
    // let token_address = get_native_asset_address(&env);
    let client = create_isssuebidding_contract(&env, &admin_address);



    // Some test data
    let issue_id: u64 = 1;
    let github_name = symbol_short!("github1");
    let github_name2 = symbol_short!("github2");
    let repository_name = symbol_short!("repo");
    let reward: i128 = 10;
    let end_time= symbol_short!("June12");


    let (github_name_, repository_name_, issue_id_) = client.add_issue(
        &issue_id,
        &get_admin_address(&env),
        &github_name,
        &repository_name,
        &reward,
        &end_time,
    );


    assert_eq!(github_name, github_name_);
    assert_eq!(repository_name, repository_name_);
    assert_eq!(issue_id, issue_id_);

    // log!(&env, "issue_id: {}", issue_id_);
    // log!(&env, "github_name: {}", github_name_);
    // log!(&env, "repository_name: {}", repository_name_);



    let i_id = client.place_bid(
        &issue_id,
        &get_bidder_address(&env),
        &github_name2,
        &github_name,
        &repository_name,
    );


    assert_eq!(i_id, 1);


    let issue_id_eq = client.assigned_bid_to_user(
        &issue_id,
        &github_name2,
        &github_name,
        &repository_name,
        &get_admin_address(&env),
    );

    assert_eq!( issue_id_eq, 1);


    let id = client.completed_bits(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );
    assert_eq!(id, 1);



    let id_released_paymet = client.release_payment(&issue_id, &github_name, &repository_name, &get_admin_address(&env) );


    assert_eq!(id_released_paymet, 1);



}





// #[test]
// fn test_with_non_native() {
//     let env = Env::default();
//     env.mock_all_auths();

//     let admin = get_admin_address(&env);
//     let (token, _token_admin) = create_token_contract(&env, &admin);

//     let client = create_isssuebidding_contract(&env, &admin, &token.address);

//     let (token, token_admin) = create_token_contract(&env, &admin);

    
//        token_admin.mint(
//            &get_admin_address(&env),
//            &1000
//        );

//     assert_eq!(token.balance(&get_admin_address(&env)), 1000);
   
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








// }



// fn place_bid(env: Env, issue_id: u64, person: Address, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol)->u64;

// fn assigned_bid_to_user(env: Env, issue_id: u64, bidder_github_name: Symbol, github_name:Symbol, repository_name:Symbol,admin: Address)->u64; 

// fn completed_bits(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, person: Address)->u64;

// fn release_payment(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, admin: Address)->u64;

// fn reject_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol, poster: Address)->u64;

// fn admin_force_complete(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->u64;
// fn get_data(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->IssueData;
// fn return_bidder(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->Vec<Bidder>;

// fn  return_bidder_status(env: Env, issue_id: u64, github_name:Symbol, repository_name:Symbol)->(Address, Symbol);
