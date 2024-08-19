import {exe, contractInt} from "./seedfns.mjs"
import { nativeToScVal, Address } from "@stellar/stellar-sdk"

const accountToScVal = (account) => new Address(account).toScVal();

const stringToSymbol = (value) => {
    return nativeToScVal(value, {type: "symbol"})
}

const numberToI128 = (value) => {
    return nativeToScVal(value, {type: "i128"})
}



const numberToU64= (value) => {
    return nativeToScVal(value, {type: "u64"})
}






async function initialize() {
    let admin = accountToScVal("GCIWZIHX75NU4PSIZAWPHMSBLXS4QEA5ECB2YRUV54AABDKBSMLEN4II")
    let commission = numberToI128(10)
    let values = [admin,commission]
    let result = await contractInt('initialize', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function addIssue() {
    let issue_id = numberToU64(5)
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
    let  github_name  = stringToSymbol("gitname5")
    let  repository_name  = stringToSymbol("reponame5")
    let reward = numberToI128(10)
    let end_time = stringToSymbol("June10")
    let values = [issue_id,poster, github_name, repository_name, reward, end_time]
    let result = await contractInt('add_issue', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function placeBit() {
    let issue_id = numberToU64(1)
    let person = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
    let  bidder_github_name  = stringToSymbol("bidgitname1")
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")

    let values = [issue_id,person,bidder_github_name, github_name, repository_name]
    let result = await contractInt('place_bid', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function assignedToUser() {
    let issue_id = numberToU64(1)
    let  bidder_github_name  = stringToSymbol("bidgitname1")
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id,bidder_github_name, github_name, repository_name,poster]
    let result = await contractInt('assigned_bid_to_user', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}





async function CompleteBid() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let user = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,user]
    let result = await contractInt('completed_bits', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function ReleasePayment() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,poster]
    let result = await contractInt('release_payment', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}




async function RejectWork() {
    let issue_id = numberToU64(1)
    let  github_name  = stringToSymbol("gitname1")
    let  repository_name  = stringToSymbol("reponame1")
    let poster = accountToScVal("GA7KOUZLPX7T45WLNYY6KFZZGJYMNI4H5J5TN3HHSVGL5BFQ4YCTQ4QR")
   

    let values = [issue_id, github_name, repository_name,poster]
    let result = await contractInt('release_payment', values);
    console.log(result)
    // console.log((result._value[0]._value).toString());
    // console.log((result._value[1]._value).toString());
}
initialize()