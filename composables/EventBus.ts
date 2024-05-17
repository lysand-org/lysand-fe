import mitt from "mitt";
import type { Status } from "~/types/mastodon/status";

export type NotificationEvent = {
    type: "error" | "info";
    title: string;
    message?: string;
    persistent?: boolean;
    onDismiss?: () => void;
};

type ApplicationEvents = {
    "note:reply": Status;
    "note:delete": Status;
    "note:edit": Status;
    "note:like": Status;
    "note:unlike": Status;
    "note:reblog": Status;
    "note:unreblog": Status;
    "note:quote": Status;
    "composer:open": undefined;
    "composer:reply": Status;
    "composer:quote": Status;
    "composer:send": Status;
    "composer:close": undefined;
    "notification:new": NotificationEvent;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
