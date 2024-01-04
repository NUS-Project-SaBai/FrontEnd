import React from "react";
import axios from "axios";
import Router from "next/router";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";
import RecordsComponent from "@/components/RecordsComponent";

import React from 'react'

function Records() {
  return (
    <div>
      <RecordsComponent />
    </div>
  )
}


export default withAuth(Records);
