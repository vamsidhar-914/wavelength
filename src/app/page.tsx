import { api } from "~/trpc/server";

export default async function Home() {
  const user =  await api.user.getUser({ userId: '1' });

  return (
      <div className="container">
        <h1 className="text-blue-900 text-lg">{user.name}</h1>
      </div>
  );
}
