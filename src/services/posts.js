import supabase from '../lib/supabase';

export const postService = {
  /**
   * Get main feed posts with optional filters and sorting.
   * Can filter by communityId, user_id (author), or savedPosts.
   */
  async getPosts({ communityId = null, userId = null, savedByUser = null, sortBy = 'newest' } = {}) {
    // We select post columns, and do left joins on communities, comments, and votes to calculate aggregates
    let query = supabase
      .from('posts')
      .select('*, communities(*), comments(id), votes(vote_type)');

    if (communityId) {
      query = query.eq('community_id', communityId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (savedByUser) {
      // First, get saved post IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', savedByUser);

      if (savedError) throw savedError;
      if (!savedData || savedData.length === 0) return [];

      const savedIds = savedData.map(item => item.post_id);
      query = query.in('id', savedIds);
    }

    // Newest is database sorted, others are calculated in JS
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    const { data: posts, error } = await query;
    if (error) throw error;

    // Process posts: compute scores and formats
    const processedPosts = posts.map(post => {
      const votes = post.votes || [];
      const score = votes.reduce((acc, vote) => acc + (vote.vote_type || 0), 0);
      const commentCount = post.comments?.length || 0;
      
      return {
        ...post,
        score,
        commentCount,
        community: post.communities || null
      };
    });

    // Client-side sorting for Top and Trending if requested
    if (sortBy === 'top') {
      processedPosts.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'trending') {
      // Trending: defined as highest combined comments and votes
      processedPosts.sort((a, b) => (b.score + b.commentCount * 2) - (a.score + a.commentCount * 2));
    }

    return processedPosts;
  },

  /**
   * Fetch single post by ID.
   */
  async getPostById(id) {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*, communities(*), comments(id), votes(vote_type)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;

    const votes = post.votes || [];
    const score = votes.reduce((acc, vote) => acc + (vote.vote_type || 0), 0);
    const commentCount = post.comments?.length || 0;

    return {
      ...post,
      score,
      commentCount,
      community: post.communities || null
    };
  },

  /**
   * Create a new post.
   */
  async createPost({ title, content, userId, communityId }) {
    if (!title?.trim()) throw new Error('Post title is required');
    
    const insertData = {
      title: title.trim(),
      content: content?.trim() || '',
      user_id: userId
    };

    if (communityId) {
      insertData.community_id = communityId;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a post.
   */
  async updatePost(id, { title, content }) {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        content: content?.trim() || ''
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a post.
   */
  async deletePost(id) {
    // Delete dependent tables first if cascade isn't on
    // But Supabase typically handles FK cascade deletes. Just in case:
    await supabase.from('comments').delete().eq('post_id', id);
    await supabase.from('votes').delete().eq('post_id', id);
    await supabase.from('saved_posts').delete().eq('post_id', id);
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
