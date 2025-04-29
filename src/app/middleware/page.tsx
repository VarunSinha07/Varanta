import { getUser } from '@/lib/db/getUser';
import { Session } from '@/lib/session';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await Session();

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUser(session.user.id);

  if (!user) {
    return null;
  }

  // Make role check case-insensitive
  const role = user.role.toLowerCase();
  
  if (role === 'admin') {
    redirect('/admin');
  }
  if (role === 'user') {
    redirect('/dashboard');
  }
};

export default Page;