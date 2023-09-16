import './globals.css';
import { getServerSession } from 'next-auth/next';
import { DefaultSession } from 'next-auth';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  get4DOTD,
  getLast5,
  getManFixRequiredCount,
} from '@/lib/prismaFunctions';
import TableBody from '@/components/TableBody';
import Upload from './upload/page';
import UserSummaryHome from '@/components/UserSummaryHome';
import RegistrationDisplay from '@/components/RegistrationDisplay';
import { options } from './api/auth/[...nextauth]/options';

type SessionUser = DefaultSession['user'] & {
  id?: string;
};
// import UserSummaryHome from '@/components/UserSummaryHome';

export default async function Page() {
  const dotd = await get4DOTD();
  const session = await getServerSession(options);

  const last5 = await getLast5();

  // eslint-disable-next-line operator-linebreak
  const userId =
    session?.user && (session?.user as SessionUser).id
      ? Number((session?.user as SessionUser).id)
      : 0;

  const manfixRequiredCount = await getManFixRequiredCount(userId);

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='w-full flex-col justify-center'>
          <div className='flex w-full justify-center text-center text-2xl font-semibold text-gray-700'>
            4DOTD
          </div>
          <div className='flex w-full justify-center '>
            <RegistrationDisplay regNumber={dotd?.reg || ''} />
          </div>
          <div className='flex w-full justify-center text-center'>
            Find and upload the 4DOTD to score 10x Points
          </div>
          <div className='flex w-full justify-center text-center'>
            {manfixRequiredCount > 0 ? (
              <Link href='/manfix'>
                <button
                  type='button'
                  className='my-2 inline-flex items-center rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300'
                >
                  Plates Reviews
                  <span className='ml-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                    {manfixRequiredCount}
                  </span>
                </button>
              </Link>
            ) : null}
          </div>
        </div>
        <div className='mt-2 w-full justify-center text-center '>
          <Suspense fallback={<div>Loading...</div>}>
            {session?.user?.name ? (
              <UserSummaryHome usernick={session.user.name} />
            ) : (
              <div className='pointer-events-none blur-sm'>
                <UserSummaryHome usernick='TrisK' />
                Please Log In to Upload
              </div>
            )}
          </Suspense>
        </div>
      </div>

      <div className='grid grid-cols-3 grid-rows-1 gap-4'>
        <div className='col-span-3 col-start-1 mr-5 md:col-span-1 md:col-start-2'>
          {session?.user?.name ? (
            <Upload />
          ) : (
            <div className='pointer-events-none blur-sm'>
              <Upload />
              Please Log In to Upload
            </div>
          )}
        </div>
      </div>

      <div className='flex w-full justify-center'>Last 5 Uploads</div>
      <div className='flex w-full justify-center'>
        <Suspense fallback={<div>Loading...</div>}>
          <div className='mx-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5'>
            {last5.map((registration) => (
              <TableBody registration={registration} key={registration.id} />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
