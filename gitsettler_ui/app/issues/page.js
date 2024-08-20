"use client";

import IssueForm from "../_components/AddIssue";
import IssueTable from "../_components/IssueTable";
import { getAllIssuesData } from "../_fns/actions";
import { useEffect, useState } from "react";

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllIssuesData();
      setIssues(response);
    };
    fetchData();
  }, []);

  return (
    <main className="bg-[#333] mt-6">
      {open ? (
        <IssueForm open={setOpen} />
      ) : (
        <button
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4 mb-4"
          onClick={() => setOpen(true)}
        >
          Add Issue +{" "}
        </button>
      )}

      <IssueTable issues={issues} />
    </main>
  );
}
