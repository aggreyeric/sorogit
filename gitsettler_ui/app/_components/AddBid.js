"use client";
import PopupNotification from "../_components/PopupNotification";
import { AddBid } from "../actions";
import { useState } from "react";
import { retrievePublicKey } from "../../sorobanfns/fns";

const BidForm = ({ issueid, githubName, repositoryName, open }) => {
  const [ userGithubName, setUserGithubName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let user = await retrievePublicKey();


    try {
      const response = await AddBid( issueid,githubName,repositoryName,user,userGithubName,);
      console.log(response);
      if (!response) {
        setIsError(true);
        open(false);
        return;
      }
      setIsSubmitted(true);
      setUserGithubName("");

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
         Bit On Github Issues{" "}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 mx-auto mt-6"
      >
        
        <div className="form-group">
          <label className="form-label">GitHub Name:</label>
          <input
            type="text"
            value={userGithubName}
            onChange={(event) => setUserGithubName(event.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="shadow bg-[#4CAF50] hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        <br /> <button onClick={() => open(issueid)}>X</button> <br />
      </form>

      {isSubmitted && (
        <PopupNotification
          color="green"
          message="Issue added successfully!"
          onClose={() => setIsSubmitted(false)}
        />
      )}

      {isError && (
        <PopupNotification
          color="red"
          message="Error adding issue."
          onClose={() => setIsError(false)}
        />
      )}
    </div>
  );
};

export default BidForm;
