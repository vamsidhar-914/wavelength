import { notFound } from "next/navigation"
import { getServerSideUser, getServerSideUserById } from "~/lib/user_utils"
import UserPage from "~/app/_components/UserPage"

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const authUser = await getServerSideUser()
    const user= await getServerSideUserById(params.userId,authUser)
    if (!user || !authUser) {
        notFound()
    }

  return (
    <div className="container max-w-4xl py-6">
      <UserPage authUser={authUser} userId={params.userId} />
    </div>
  )
}
