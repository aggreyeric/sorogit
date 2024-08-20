"use client";

import React, { useState, useEffect } from 'react'
import IssueTableBits from '../_components/IssueTableBids'
import { getAllIssuesData } from '../_fns/actions';


function Bids() {


    const [issues, setIssues] = useState([]);

  
    useEffect(() => {
      const fetchData = async () => {
        const response = await getAllIssuesData();
      ;
        setIssues(response);
      };
      fetchData();
    }, []);
  
  
  return (
    <div>

  <IssueTableBits issues={issues} />



    </div>
  )
}

export default Bids