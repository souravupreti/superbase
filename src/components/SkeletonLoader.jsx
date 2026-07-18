import { Avatar, Box, Card, Divider, Skeleton, Stack } from '@mui/joy';

export const PostSkeleton = () => (
  <Card variant="outlined" sx={{ p: 2, borderRadius: '16px', bgcolor: 'background.surface' }}>
    <Stack direction="row" spacing={1.75}>
      <Stack alignItems="center" spacing={0.75} sx={{ width: 42, flexShrink: 0 }}>
        <Skeleton variant="circular" width={28} height={28} />
        <Skeleton variant="text" width={22} />
        <Skeleton variant="circular" width={28} height={28} />
      </Stack>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="circular">
            <Avatar size="sm" />
          </Skeleton>
          <Skeleton variant="text" width={110} />
          <Skeleton variant="text" width={80} />
        </Stack>
        <Skeleton variant="text" width="72%" sx={{ mt: 1.5, fontSize: '1.25rem' }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="84%" />
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rectangular" width={92} height={30} sx={{ borderRadius: '10px' }} />
          <Skeleton variant="rectangular" width={72} height={30} sx={{ borderRadius: '10px' }} />
          <Skeleton variant="rectangular" width={72} height={30} sx={{ borderRadius: '10px' }} />
        </Stack>
      </Box>
    </Stack>
  </Card>
);

export const CommentSkeleton = () => (
  <Stack spacing={2}>
    {[1, 2].map((i) => (
      <Stack key={i} direction="row" spacing={1.25}>
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={140} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="78%" />
          <Box sx={{ pl: 3, mt: 2, borderLeft: '1px solid', borderColor: 'neutral.outlinedBorder' }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width="72%" />
          </Box>
        </Box>
      </Stack>
    ))}
  </Stack>
);

export const CommunityListSkeleton = () => (
  <Stack spacing={1.5}>
    {[1, 2, 3].map((i) => (
      <Stack key={i} direction="row" spacing={1.25} alignItems="center">
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="44%" />
        </Box>
      </Stack>
    ))}
  </Stack>
);

export const ProfileHeaderSkeleton = () => (
  <Card variant="outlined" sx={{ p: 3, alignItems: 'center', borderRadius: '16px', bgcolor: 'background.surface' }}>
    <Skeleton variant="circular" width={80} height={80} />
    <Skeleton variant="text" width={150} sx={{ mt: 1.5, fontSize: '1.2rem' }} />
    <Skeleton variant="text" width={220} />
    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={32} />
          <Skeleton variant="text" width={64} />
        </Box>
      ))}
    </Stack>
  </Card>
);
