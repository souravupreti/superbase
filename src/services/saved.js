import supabase from '../lib/supabase';

export const savedService = {
  /**
   * Check if a post is saved by a user.
   */
  async isSaved(postId, userId) {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  /**
   * Save a post.
   */
  async savePost(postId, userId) {
    if (!userId) throw new Error('User must be logged in to save posts');

    const { data, error } = await supabase
      .from('saved_posts')
      .insert({
        post_id: postId,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Unsave a post.
   */
  async unsavePost(postId, userId) {
    if (!userId) throw new Error('User must be logged in to unsave posts');

    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
};
