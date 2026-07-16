import React from 'react';

export const PostSkeleton = () => {
  return (
    <div className="bg-brand-card border border-white/5 rounded-3xl p-5 flex gap-4 w-full">
      {/* Vote skeleton */}
      <div className="flex flex-col items-center gap-2 shrink-0 bg-white/3 py-2 px-2 rounded-2xl w-9 h-24 skeleton-shimmer" />

      {/* Meta + Content */}
      <div className="flex-1 space-y-3">
        {/* Meta row */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 rounded-full skeleton-shimmer" />
          <div className="h-2 w-2 rounded-full skeleton-shimmer" />
          <div className="h-3 w-32 rounded skeleton-shimmer" />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />

        {/* Body content lines */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-5/6 rounded skeleton-shimmer" />
          <div className="h-3 w-2/3 rounded skeleton-shimmer" />
        </div>

        {/* Footer row */}
        <div className="flex gap-4 pt-3">
          <div className="h-6 w-20 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-20 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-20 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3 py-2">
          <div className="w-8 h-8 rounded-full skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-24 rounded skeleton-shimmer" />
              <div className="h-2 w-2 rounded-full skeleton-shimmer" />
              <div className="h-3 w-12 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-4/5 rounded skeleton-shimmer" />
            
            {/* Nested Reply Skeleton Indentation */}
            <div className="pl-6 border-l border-white/5 space-y-3 mt-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-20 rounded skeleton-shimmer" />
                  <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CommunityListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded skeleton-shimmer" />
            <div className="h-2.5 w-1/2 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="bg-brand-card border border-white/5 rounded-3xl p-6 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full skeleton-shimmer mb-4" />
      <div className="h-5 w-32 rounded skeleton-shimmer mb-2" />
      <div className="h-3.5 w-48 rounded skeleton-shimmer mb-6" />
      
      <div className="grid grid-cols-3 gap-6 w-full max-w-sm pt-4 border-t border-white/5">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex flex-col items-center space-y-1.5">
            <div className="h-4 w-6 rounded skeleton-shimmer" />
            <div className="h-3 w-16 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
