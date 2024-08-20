"use client";
import  PopupNotification  from "../_components/PopupNotification";
import {formAddIssue} from "../_fns/actions"
import { useState } from "react";
import {retrievePublicKey} from "../_fns/fns"


const IssueForm = ({ open }) => {



  const [issueId, setIssueId] = useState("");
  const [githubName, setGithubName] = useState("");
  const [repositoryName, setRepositoryName] = useState("");
  const [reward, setReward] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);




  function formatDate(dateString) {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${year} ${month} ${day}`;
  }
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    let poster = await retrievePublicKey();


    const issueData = {
      issueId,
      poster,
      githubName,
      repositoryName,
      reward,
      endTime:formatDate(endTime),
      description,
    };

    try {
      const response = await formAddIssue(issueData);
      if (!response) {
        setIsError(true);
        open(false);
        return;
      }
      setIsSubmitted(true);
      setDescription("");
      setGithubName("");
      setRepositoryName("");
      setReward("");
      setEndTime("");
      open(false);
      console.log(response.data);
    } catch (error) {
      setIsError(true);
      open(false);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-[#333]  mx-auto ">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center mt-2">
          Github Issues{" "}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 mx-auto mt-6"
      >
        <div className="form-group">
          <label className="form-label">Issue ID:</label>
          <input
            type="text"
            value={issueId}
            onChange={(event) => setIssueId(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
  
        <div className="form-group">
          <label className="form-label">GitHub Name:</label>
          <input
            type="text"
            value={githubName}
            onChange={(event) => setGithubName(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Repository Name:</label>
          <input
            type="text"
            value={repositoryName}
            onChange={(event) => setRepositoryName(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Reward:</label>
          <input
            type="number"
            value={reward}
            onChange={(event) => setReward(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group">
          <label className="form-label">End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button type="submit" className="shadow bg-[#4CAF50] hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
        <br/> <button onClick={() => open(false)}>X</button>  <br/>
      </form>

      {isSubmitted && <PopupNotification color="green" message="Issue added successfully!" onClose={() => setIsSubmitted(false)} />}

      {isError && <PopupNotification color="red" message="Error adding issue." onClose={() => setIsError(false)} />}
    </div>
  );
};

export default IssueForm;
