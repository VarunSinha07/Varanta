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

  
  if (user.role === 'admin') {
    redirect('/admin');
  }
  if(user.role === 'user') {
    redirect('/dashboard');
  }
};

export default Page;
