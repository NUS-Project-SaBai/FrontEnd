import { useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "@/utils/auth";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // User is logged in
    router.push("/registration");
  }, [router]);

  return null;
};

export default withAuth(Index);
