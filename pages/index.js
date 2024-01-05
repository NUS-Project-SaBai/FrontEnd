import { useEffect } from "react";
import { useRouter } from "next/router";
import Redirect from "./api/redirect";
import withAuth from "../utils/auth";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // User is logged in
    router.push("/patients");
  }, [router]);

  // User is logged in, perform client-side redirect to '/patients'

  return null;
}

export default withAuth(Index);
