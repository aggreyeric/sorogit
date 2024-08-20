"use server";

import {addIssue, getAllIssues, addBidWithBidder, getAllBiddersForIssue, getAllIssuesWithBidForPerson} from "../../db/dbfuns"
import {soroAddIssue} from "./usesorrobanfns"



export async function getAllIssuesWithBidForPersonAction(person) {

    try {
        const issues = await getAllIssuesWithBidForPerson(person);

        return issues;
    }
    catch (error) {
        console.error(error);
        return false
    }
    
}






export async function getAllBiddersForIssueAction(issueid, githubName, repositoryName) {

    try {
        const bidders = await getAllBiddersForIssue(issueid, githubName, repositoryName);

        return bidders;
    }
    catch (error) {
        console.error(error);
        return false
    }
    
}





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
    //    
    //     console.log(result)

    //     if(result){
    //         await addIssue(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime, formdata.description);
    //     }
    //     return result;
    // }
    // catch(error){
    //     console.error(error);
    //     return false
       
    // }


    try {   
        
        await soroAddIssue(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime);
        await addIssue(formdata.issueId, formdata.poster, formdata.githubName, formdata.repositoryName, formdata.reward, formdata.endTime, formdata.description);
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
