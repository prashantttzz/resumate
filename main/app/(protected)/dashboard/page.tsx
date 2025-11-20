import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';

import { getAllResume } from '@/actions/resume-actions';
import { getAllCoverLetter } from '@/actions/coverLetter-action'; 
import { isPremium as fetchPremiumStatus } from '@/query/user/query';
import { QUERY_KEYS } from '@/query/resume/query';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardPage() {
  const queryClient = getQueryClient(); 
  const fetchAllCoverLetters = getAllCoverLetter;

  await Promise.all([
    queryClient.prefetchQuery({ 
      queryKey: QUERY_KEYS.RESUME.ALL,  
      queryFn: getAllResume 
    }),
    
    queryClient.prefetchQuery({ 
      queryKey: QUERY_KEYS.COVER_LETTER.ALL, 
      queryFn: fetchAllCoverLetters 
    }),
    
    queryClient.prefetchQuery({ 
      queryKey: ['isPremium'], 
      queryFn: fetchPremiumStatus 
    }),
  ]);
  
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardClient />
    </HydrationBoundary>
  );
}