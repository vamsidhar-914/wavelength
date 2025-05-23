import type React from "react";
import { getServerSideUser } from "~/lib/user_utils";
import Createwave from "../_components/Createwave";

export default async function CreatePost() {
  const user = await getServerSideUser();

  return (
    <div className="container max-w-2xl py-6">
      <h1 className="text-2xl font-bold mb-6">Create a new wave</h1>
      <Createwave user={user} />
    </div>
  );
}
