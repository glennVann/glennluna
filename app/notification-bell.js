"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const AUTH_CHANGED_EVENT = "glennluna:auth-changed";

function formatNotificationTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationBell() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (response.status === 401) {
        setIsVisible(false);
        setIsOpen(false);
        setUnreadCount(0);
        setNotifications([]);
        return;
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to load notifications.");

      setIsVisible(true);
      setUnreadCount(result.unreadCount || 0);
      setNotifications(Array.isArray(result.notifications) ? result.notifications : []);
    } catch {
      setIsVisible(false);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const handleAuthChange = () => loadNotifications();
    const interval = window.setInterval(loadNotifications, 60000);

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    };
  }, [loadNotifications]);

  async function markAllRead() {
    await fetch("/api/notifications/read", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    await loadNotifications();
  }

  if (!isVisible) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#152321]/15 bg-white text-[#152321] shadow-[0_10px_24px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f4eee5]"
        aria-label={isOpen ? "Close notifications" : "Open notifications"}
        aria-expanded={isOpen}
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M15 17H9m9-2.8V11a6 6 0 0 0-12 0v3.2L4.8 16a1 1 0 0 0 .84 1.54h12.72A1 1 0 0 0 19.2 16L18 14.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20a2.2 2.2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 min-w-5 rounded-full bg-[#dd8c36] px-1 text-[10px] font-bold leading-5 text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-[min(86vw,22rem)] overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#fffdfa] text-sm shadow-[0_24px_70px_rgba(21,35,33,0.18)]">
          <div className="flex items-center justify-between gap-3 border-b border-black/8 p-4">
            <div>
              <p className="font-semibold text-[#152321]">Notifications</p>
              <p className="mt-1 text-xs text-black/48">
                {unreadCount ? `${unreadCount} unread` : "You are all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
              >
                Mark read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading && notifications.length === 0 ? (
              <p className="rounded-2xl bg-[#f7f2ea] px-4 py-5 text-center text-black/45">
                Loading notifications...
              </p>
            ) : notifications.length ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href || "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className={
                    "block rounded-2xl p-3 transition hover:bg-[#f7f2ea] " +
                    (notification.isRead ? "text-black/62" : "bg-[#edf4f1] text-[#152321]")
                  }
                >
                  <div className="flex items-start gap-2">
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1b5e59]" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold">{notification.title}</p>
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-black/58">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-[11px] text-black/40">
                        {formatNotificationTime(notification.createdAtUtc)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl bg-[#f7f2ea] px-4 py-5 text-center text-black/45">
                No notifications yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
