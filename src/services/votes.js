import supabase from '../lib/supabase';

export const voteService = {
  /**
   * Fetch a user's vote status for a post.
   */
  async getUserVote(postId, userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  },

  /**
   * Cast or toggle an upvote (vote_type = 1).
   */
  async upvotePost(postId, userId) {
    if (!userId) throw new Error('User must be logged in to vote');

    const existingVote = await this.getUserVote(postId, userId);

    if (existingVote) {
      if (existingVote.vote_type === 1) {
        // Retract vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
        return { action: 'retracted', vote: null };
      } else {
        // Switch to upvote
        const { data, error } = await supabase
          .from('votes')
          .update({ vote_type: 1 })
          .eq('post_id', postId)
          .eq('user_id', userId)
          .select()
          .maybeSingle();

        if (error) throw error;
        return { action: 'updated', vote: data };
      }
    } else {
      // Insert new upvote
      const { data, error } = await supabase
        .from('votes')
        .insert({
          post_id: postId,
          user_id: userId,
          vote_type: 1
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      // Trigger notification for post author
      try {
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .maybeSingle();

        if (post && post.user_id !== userId) {
          await supabase.from('notifications').insert({
            post_id: postId,
            sender_id: userId,
            receiver_id: post.user_id,
            type: 'upvote',
            is_read: false
          });
        }
      } catch (e) {
        console.warn('Failed to send vote notification:', e);
      }

      return { action: 'created', vote: data };
    }
  },

  /**
   * Cast or toggle a downvote (vote_type = -1).
   */
  async downvotePost(postId, userId) {
    if (!userId) throw new Error('User must be logged in to vote');

    const existingVote = await this.getUserVote(postId, userId);

    if (existingVote) {
      if (existingVote.vote_type === -1) {
        // Retract vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
        return { action: 'retracted', vote: null };
      } else {
        // Switch to downvote
        const { data, error } = await supabase
          .from('votes')
          .update({ vote_type: -1 })
          .eq('post_id', postId)
          .eq('user_id', userId)
          .select()
          .maybeSingle();

        if (error) throw error;
        return { action: 'updated', vote: data };
      }
    } else {
      // Insert new downvote
      const { data, error } = await supabase
        .from('votes')
        .insert({
          post_id: postId,
          user_id: userId,
          vote_type: -1
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return { action: 'created', vote: data };
    }
  }
};
