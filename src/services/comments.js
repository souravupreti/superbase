import supabase from '../lib/supabase';

export const commentService = {
  /**
   * Fetch all comments for a post.
   */
  async getCommentsForPost(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true }); // chronological order

    if (error) throw error;
    return data;
  },

  /**
   * Create a comment or reply.
   */
  async createComment({ postId, content, userId, parentCommentId = null }) {
    if (!content?.trim()) throw new Error('Comment content is required');

    const insertData = {
      post_id: postId,
      content: content.trim(),
      user_id: userId
    };

    if (parentCommentId) {
      insertData.parent_comment_id = parentCommentId;
    }

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    // Trigger Notification for the post owner or parent comment owner
    try {
      if (parentCommentId) {
        // Fetch parent comment owner
        const { data: parentComment } = await supabase
          .from('comments')
          .select('user_id')
          .eq('id', parentCommentId)
          .single();
        
        if (parentComment && parentComment.user_id !== userId) {
          await supabase.from('notifications').insert({
            post_id: postId,
            comment_id: newComment.id,
            sender_id: userId,
            receiver_id: parentComment.user_id,
            type: 'reply',
            is_read: false
          });
        }
      } else {
        // Fetch post owner
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();
        
        if (post && post.user_id !== userId) {
          await supabase.from('notifications').insert({
            post_id: postId,
            comment_id: newComment.id,
            sender_id: userId,
            receiver_id: post.user_id,
            type: 'comment',
            is_read: false
          });
        }
      }
    } catch (notifErr) {
      console.warn('Failed to send comment notification:', notifErr);
    }

    return newComment;
  },

  /**
   * Update a comment.
   */
  async updateComment(id, content) {
    if (!content?.trim()) throw new Error('Comment content is required');

    const { data, error } = await supabase
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a comment.
   */
  async deleteComment(id) {
    // Note: If comments have replies, we can either set content to [deleted]
    // or delete them. Supabase Schema might reject delete if there are FK constraints
    // with restrict, or cascade will delete replies. Let's see:
    
    // First check if this comment has replies
    const { data: replies, error: checkError } = await supabase
      .from('comments')
      .select('id')
      .eq('parent_comment_id', id);

    if (checkError) throw checkError;

    if (replies && replies.length > 0) {
      // Soft-delete: update text to [deleted] and user_id to null so structure is kept
      const { data, error } = await supabase
        .from('comments')
        .update({
          content: '[deleted]',
          user_id: null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { softDeleted: true, data };
    } else {
      // Hard delete
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { softDeleted: false };
    }
  }
};

/**
 * Utility to organize flat comments array into hierarchical comments tree
 */
export function buildCommentTree(comments) {
  const commentMap = {};
  const rootComments = [];

  // Initialize comment map
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Build tree
  comments.forEach(comment => {
    const mappedComment = commentMap[comment.id];
    if (comment.parent_comment_id) {
      const parent = commentMap[comment.parent_comment_id];
      if (parent) {
        parent.replies.push(mappedComment);
      } else {
        // Parent not found or deleted, treat as root
        rootComments.push(mappedComment);
      }
    } else {
      rootComments.push(mappedComment);
    }
  });

  // Sort root comments by created_at ascending
  rootComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  // Recursively sort replies by created_at ascending
  const sortReplies = (comment) => {
    comment.replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    comment.replies.forEach(sortReplies);
  };
  rootComments.forEach(sortReplies);

  return rootComments;
}
