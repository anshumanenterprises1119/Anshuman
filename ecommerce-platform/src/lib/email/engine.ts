import { supabaseAdmin } from '../supabase/admin';

export type EmailTemplate =
  | 'WELCOME'
  | 'ORDER_CONFIRMATION'
  | 'ORDER_UPDATE'
  | 'INVOICE'
  | 'DOWNLOAD_DELIVERY'
  | 'REVIEW_REQUEST'
  | 'REWARD_UPDATE';

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

export async function sendEmail({ to, template, data }: SendEmailParams) {
  console.log(`[Email Engine] Sending ${template} email to ${to}...`, data);

  // Build subject and body content based on the template
  let subject = '';
  let body = '';

  switch (template) {
    case 'WELCOME':
      subject = `Welcome to Anshuman Commerce!`;
      body = `Hi ${data.name || 'there'},\n\nWelcome to our platform! We are excited to have you on board.`;
      break;
    case 'ORDER_CONFIRMATION':
      subject = `Order Confirmation #${data.orderNumber}`;
      body = `Thank you for your order! Your order #${data.orderNumber} for ₹${data.totalAmount} has been received and is being processed.`;
      break;
    case 'ORDER_UPDATE':
      subject = `Order #${data.orderNumber} Status Updated`;
      body = `Hi,\n\nYour order #${data.orderNumber} status has been updated to: ${data.status}.`;
      break;
    case 'INVOICE':
      subject = `Invoice for Order #${data.orderNumber}`;
      body = `Hi,\n\nPlease find attached the invoice for order #${data.orderNumber} of amount ₹${data.totalAmount}.`;
      break;
    case 'DOWNLOAD_DELIVERY':
      subject = `Your Digital Assets are Ready!`;
      body = `Hi,\n\nYour purchase is complete. You can download your files here: ${data.downloadUrl}\n\nSecure Access Token: ${data.token}`;
      break;
    case 'REVIEW_REQUEST':
      subject = `How was your purchase?`;
      body = `Hi,\n\nWe'd love to know what you think about your recent purchase. Please leave a review here: ${data.reviewUrl}`;
      break;
    case 'REWARD_UPDATE':
      subject = `Loyalty Tier Level Update!`;
      body = `Congratulations! Your loyalty level has been updated to ${data.level.toUpperCase()}.\n\nReason: ${data.reason}`;
      break;
    default:
      subject = `Notification from Anshuman Commerce`;
      body = `Please check your dashboard for updates.`;
  }

  // Insert operational log to public.operation_logs via supabaseAdmin
  try {
    const { error } = await supabaseAdmin.from('operation_logs').insert({
      type: 'task_queue',
      severity: 'info',
      message: `Mock Email Dispatched: ${template} to ${to}`,
      details: {
        to,
        template,
        subject,
        body,
        templateData: data,
        dispatchedAt: new Date().toISOString(),
      },
    });

    if (error) {
      console.error('[Email Engine] Error saving email log to database:', error.message);
    }
  } catch (err: any) {
    console.error('[Email Engine] Unexpected error logging email dispatch:', err.message || err);
  }

  return { success: true, messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` };
}
