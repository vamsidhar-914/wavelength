import { WavePost } from "~/app/_components/WavePost";
import { getServerSideUser } from "~/lib/user_utils";

export default async function WavePage({
  params: { waveId },
}: {
  params: { waveId: string };
}) {
  const user = await getServerSideUser();
  return <WavePost waveId={waveId} user={user} />;
}
