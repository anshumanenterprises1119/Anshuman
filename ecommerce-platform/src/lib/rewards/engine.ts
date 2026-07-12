import { supabaseAdmin } from '../supabase/admin';
import { sendEmail } from '../email/engine';

export async function processCustomerSpend(profileId: string, orderAmount: number) {
  try {
    console.log(`[Reward Engine] Processing spend for customer ${profileId}, amount: ₹${orderAmount}`);

    // 1. Calculate points to award: 1 point per ₹100 spent
    const pointsAwarded = Math.floor(orderAmount / 100);

    if (pointsAwarded > 0) {
      // Record points in public.reward_history
      const { error: pointsError } = await supabaseAdmin.from('reward_history').insert({
        profile_id: profileId,
        points_change: pointsAwarded,
        reason: `Earned points for purchase of value ₹${orderAmount}`,
      });

      if (pointsError) {
        console.error('[Reward Engine] Error adding reward history:', pointsError.message);
      }
    }

    // 2. Fetch customer email and current profile level
    const { data: customerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, level')
      .eq('id', profileId)
      .single();

    if (profileError || !customerProfile) {
      console.error('[Reward Engine] Profile not found:', profileError?.message);
      return;
    }

    const currentLevel = customerProfile.level || 'bronze';

    // 3. Sum up total lifetime spend for paid orders
    const { data: paidOrders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('total_amount')
      .eq('profile_id', profileId)
      .eq('payment_status', 'paid');

    if (ordersError) {
      console.error('[Reward Engine] Error fetching paid orders:', ordersError.message);
      return;
    }

    const totalLifetimeSpend = (paidOrders || []).reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    );

    // 4. Determine target level based on thresholds
    // Bronze: < 5000, Silver: >= 5000 and < 20000, Gold: >= 20000
    let targetLevel: 'bronze' | 'silver' | 'gold' = 'bronze';
    if (totalLifetimeSpend >= 20000) {
      targetLevel = 'gold';
    } else if (totalLifetimeSpend >= 5000) {
      targetLevel = 'silver';
    }

    // 5. If level upgraded, update profile and send notification
    if (targetLevel !== currentLevel) {
      console.log(`[Reward Engine] Upgrading customer ${profileId} from ${currentLevel} to ${targetLevel} (lifetime spend: ₹${totalLifetimeSpend})`);
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ level: targetLevel })
        .eq('id', profileId);

      if (updateError) {
        console.error('[Reward Engine] Error updating profile level:', updateError.message);
        return;
      }

      // Record level change in reward history
      await supabaseAdmin.from('reward_history').insert({
        profile_id: profileId,
        points_change: 0,
        reason: `Loyalty status upgraded to ${targetLevel.toUpperCase()} (Total spend: ₹${totalLifetimeSpend})`,
      });

      // Send reward update notification email
      await sendEmail({
        to: customerProfile.email,
        template: 'REWARD_UPDATE',
        data: {
          level: targetLevel,
          reason: `Your lifetime spend has reached ₹${totalLifetimeSpend.toLocaleString()}! Enjoy your new benefits.`,
        },
      });
    }

  } catch (err: any) {
    console.error('[Reward Engine] Unexpected error processing rewards:', err.message || err);
  }
}
