"use client";

import React,{useState, useEffect} from 'react';
import BidForm from './AddBid';
import {retrievePublicKey} from "../_fns/fns"
import {getAllIssuesWithBidForPersonAction} from "../_fns/actions"



const removeIssue = async (issueId) => {
    // API call to remove issue
    console.log(`Removing issue ${issueId}`);
  };
  
  const viewBids = async (issueId, githubName, repositoryName) => {
    // API call to get bids for issue
    console.log(`Viewing bids for issue ${issueId} on ${githubName}/${repositoryName}`);
    // Navigate to bids page
    // ...
  };



const IssueTableBits = ({ issues }) => {

  const [bidForms, setBidForms] = useState({});
  
  const handleOpenBidForm = (issueid) => {
    setBidForms((prevBidForms) => ({ ...prevBidForms, [issueid]: true }));
  };
  
  const handleCloseBidForm = (issueid) => {
    setBidForms((prevBidForms) => ({ ...prevBidForms, [issueid]: false }));
  };
  
  


  return (

    

    <div className="flex flex-col gap-4 bg-[#333] mx-6  ">
    
    <table className='table-auto  min-w-full bg-[#333] border border-gray-300'>
      <thead>
        <tr>
          <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue ID</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Poster</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Github Name</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Repository Name</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reward</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Time</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
          <th  className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.issueid}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.issueid}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.poster}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.github_name}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.repository_name}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.reward}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.end_time}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{issue.description}</td>
            <td  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
        
            {bidForms[issue.issueid] ? <BidForm  issueid={issue.issueid} githubName={issue.github_name} repositoryName={issue.repository_name}     open={handleCloseBidForm}  /> : <button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4 mb-4"      onClick={() => handleOpenBidForm(issue.issueid)}>Add Bid + </button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <br/>
    <br/>

    <h2 className='text-white text-2xl text-center'> Bids Made By You</h2>

    <Bidmgt />
  </div>
  );
};







const Bidmgt =   () => {
  const [bid, setbid] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      let user = await retrievePublicKey();

      const response = await getAllIssuesWithBidForPersonAction(user);
      setbid(response);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-[#333] mx-6">
    
        <div>
          <table className="table-auto min-w-full bg-[#333] border border-gray-300">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issue ID
                </th>


                <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                 Github Name
                </th>


                <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                 Repository Name
                </th>
                <th className="px-6 py-3 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bid.map((b) => (
                <tr key={b.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{b.issueid}</td>
                  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-300'> {b.github_name} </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">{b.repository_name}</td>
                   <td>
                    
                    <button
                      className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4 mb-4"
                      onClick={() => viewBids(issueid, github_name, repository_name)}
                    >
                      Complete_Project
                    </button>
                    <button
                      className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4 mb-4"
                      onClick={() => viewBids(issueid, github_name, repository_name)}
                    >
                      Check Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      
        </div>
   
    </div>
  );
};




export default IssueTableBits;