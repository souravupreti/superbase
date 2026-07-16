import supabase from '../lib/supabase';

export const communityService = {
  /**
   * Fetch all communities.
   */
  async getCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get community by ID.
   */
  async getCommunityById(id) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a new community.
   */
  async createCommunity(name, description, ownerId) {
    if (!name?.trim()) throw new Error('Community name is required');

    // Check if community with same name exists
    const { data: existing, error: checkError } = await supabase
      .from('communities')
      .select('id')
      .eq('name', name.trim())
      .maybeSingle();
      
    if (checkError) throw checkError;
    if (existing) throw new Error('A community with this name already exists.');

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: name.trim(),
        description: description?.trim() || '',
        owner_id: ownerId
      })
      .select()
      .single();

    if (error) throw error;

    // Join the newly created community as owner
    await this.joinCommunity(data.id, ownerId, 'owner');

    return data;
  },

  /**
   * Add a member to a community.
   */
  async joinCommunity(communityId, userId, role = 'member') {
    const { data, error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
        role: role
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Remove a member from a community.
   */
  async leaveCommunity(communityId, userId) {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  },

  /**
   * Fetch members for a community.
   */
  async getMembersCount(communityId) {
    const { count, error } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Check if a user is a member of a community.
   */
  async checkMemberStatus(communityId, userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  },

  /**
   * Get all communities joined by a specific user.
   */
  async getJoinedCommunities(userId) {
    if (!userId) return [];
    
    // Fetch members table
    const { data, error } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', userId);

    if (error) throw error;
    if (data.length === 0) return [];

    const communityIds = data.map(item => item.community_id);

    // Fetch matching communities
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .in('id', communityIds);

    if (communitiesError) throw communitiesError;
    return communities;
  }
};
