import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const reminders = [
  { label: "7 days before reminder", daysBefore: 7 },
  { label: "5 days before reminder", daysBefore: 5 },
  { label: "2 days before reminder", daysBefore: 2 },
  { label: "1 day before reminder", daysBefore: 1 },
  { label: "Final day reminder", daysBefore: 0 },
];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription){
        console.error('Subscription not found');
        return;
    }

    if(subscription.status !== 'active'){
        console.log(`Subscription "${subscription.name}" is not active. Stopping workflow.`);
        return;
    }

    const result = await context.run('check renewal date', async () => {
        const renewalDate = dayjs(subscription.renewalDate);
        const now = dayjs();

        const shouldStop = renewalDate.isBefore(now, 'day');

        return {
            shouldStop,
            renewalDate: renewalDate.toISOString(),
            now: now.toISOString()
        };
    });

    if(result.shouldStop){
        console.log(`Renewal date of ${subscription.name} is in the past. Stopping workflow.`);
        return;
    }

    const renewalDate = dayjs(result.renewalDate);
    let now = dayjs(result.now);

    for(const reminder of reminders){
        const reminderDate = renewalDate.subtract(reminder.daysBefore, 'day');
        
        if(now.isBefore(reminderDate)){
            await sleepUntilReminder(context, reminder.label, reminderDate);

            now = dayjs();
        }

        if(now.isSame(reminderDate, 'day')){
            console.log(`Sending ${reminder.label} email.`);

            await triggerReminder(context, reminder.label, subscription);

            if (reminder.daysBefore === 0) {
                console.log("Final day reached. Stopping workflow.");
                return;
            }
        }        
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}

const sleepUntilReminder = async (context, label, date) =>  {
    console.log(`Sleeping until next reminder: ${label} on ${date.toISOString()}`);

    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`${label} triggered at ${dayjs().toISOString()}`);

        // Send Email, SMS, Push Notification ...

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription: subscription,
        });
    });
}