import supabase from '../lib/supabase';

export const notificationService = {
  /**
   * Fetch notification stream for a specific user.
   */
  async getNotifications(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*, posts(id, title), comments(id, content)')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId) {
    if (!userId) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  },

  /**
   * Get total count of unread notifications for a user.
   */
  async getUnreadCount(userId) {
    if (!userId) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};
