import { diaper } from './diaper.js';
import { feeding } from './feeding.js';

// Every trackable event type. The timeline renders from this list.
export const eventTypes = [feeding, diaper];

export const eventTypeByName = Object.fromEntries(eventTypes.map((type) => [type.name, type]));
