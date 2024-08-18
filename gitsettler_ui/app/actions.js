"use server";

import {addIssue, getAllIssues, addBidWithBidder} from "../db/dbfuns"
import {addIssueSoroban} from "../sorobanfns/usesorrobanfns"





export async function getAllIssuesData() {

    try {
        const issues = await getAllIssues();

        return issues;
    }
    catch (error) {
        console.error(error);
        return false
    }
    
}



export async function formAddIssue( formdata) {
    // try{
    //     const result = await addIssueSoroban(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime);

    //     if(result){
    //         await addIssue(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime, formdata.description);
    //     }
    //     return result;
    // }
    // catch(error){
    //     console.error(error);
    //     return false
       
    // }


    try {   await addIssue(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime, formdata.description);

        return true
    }
    catch (error) {
        console.error(error);
        return false
    }

   

}




export async function AddBid(issueid, githubName, repositoryName, user,  userGithubName) {

    try {
        const bidid = await addBidWithBidder(issueid, githubName, repositoryName, user,  userGithubName);
        console.log(bidid);
        return bidid;
    }
    catch (error) {
        console.error(error);
        return false
    }
    
}
