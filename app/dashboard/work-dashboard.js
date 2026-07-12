"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROLE_OPTIONS = ["User", "Content Writer", "Worker"];
const STATUS_OPTIONS = ["Assigned", "In Progress", "Submitted", "Completed"];

async function api(url, options) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Something went wrong.");
  return result;
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",", 2)[1]);
    reader.onerror = () => reject(new Error("The file could not be read."));
    reader.readAsDataURL(file);
  });
}

function formatDueDate(value) {
  return new Date(value).toLocaleString();
}

function TaskCard({ task, isAdmin, isDue, onStatusChange, onSubmitWork }) {
  return (
    <article className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-6">{task.title}</h3>
          <p className="mt-1 truncate text-xs text-black/45">{task.assignee}</p>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide " +
            (isDue ? "bg-red-50 text-red-700" : "bg-[#edf4f1] text-[#1b5e59]")
          }
        >
          {isDue ? "Past due" : task.status}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-black/65">
        {task.instructions || "No additional instructions."}
      </p>

      {task.dueAtUtc && (
        <p className={"mt-3 text-xs font-medium " + (isDue ? "text-red-700" : "text-black/50")}>
          Due {formatDueDate(task.dueAtUtc)}
        </p>
      )}

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-black/45">
        Status
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#152321]"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>

      {task.submittedAtUtc && (
        <div className="mt-5 rounded-2xl bg-[#f7f2ea] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider">Submitted work</p>
          {task.submissionText && (
            <p className="mt-2 whitespace-pre-wrap text-sm">{task.submissionText}</p>
          )}
          {task.submissionNotes && (
            <p className="mt-2 text-sm text-black/60">Notes: {task.submissionNotes}</p>
          )}
          {task.submissionLink && (
            <a
              href={task.submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm font-semibold text-[#1b5e59] underline"
            >
              Open submitted link
            </a>
          )}
          {task.hasSubmissionFile && (
            <a
              href={"/api/work/tasks/" + task.id + "/submission-file"}
              className="mt-2 block text-sm font-semibold text-[#1b5e59] underline"
            >
              Download {task.submissionFileName}
            </a>
          )}
        </div>
      )}

      {!isAdmin && task.status !== "Completed" && (
        <form
          onSubmit={(event) => onSubmitWork(event, task.id)}
          className="mt-5 border-t border-black/10 pt-5"
        >
          <h4 className="font-semibold">Submit work</h4>
          <textarea
            name="content"
            maxLength={10000}
            defaultValue={task.submissionText}
            placeholder="Paste your completed work"
            className="mt-3 min-h-28 w-full rounded-xl border border-black/10 p-3"
          />
          <textarea
            name="notes"
            maxLength={2000}
            defaultValue={task.submissionNotes}
            placeholder="Notes for the administrator"
            className="mt-3 min-h-20 w-full rounded-xl border border-black/10 p-3"
          />
          <input
            name="link"
            type="url"
            maxLength={500}
            defaultValue={task.submissionLink}
            placeholder="https:// link (optional)"
            className="mt-3 w-full rounded-xl border border-black/10 p-3"
          />
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.docx"
            className="mt-3 block w-full text-sm"
          />
          <p className="mt-2 text-xs text-black/50">
            JPEG, PNG, WebP, PDF, DOCX, or TXT. Maximum 5 MB.
          </p>
          <button className="mt-3 rounded-xl bg-[#1b5e59] px-4 py-2 font-semibold text-white">
            Submit for review
          </button>
        </form>
      )}
    </article>
  );
}

export default function WorkDashboard() {
  const roleDialogRef = useRef(null);
  const taskDialogRef = useRef(null);
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const load = useCallback(async () => {
    try {
      const nextSession = await api("/api/auth/session");
      setError("");
      setSession(nextSession);

      if (!nextSession.authenticated) {
        setTasks([]);
        setUsers([]);
        return;
      }

      const taskList = await api("/api/work/tasks");
      setTasks(taskList);
      setCurrentTime(Date.now());
      setUsers(nextSession.user.isTeamAdmin ? await api("/api/work/users") : []);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
    const handleAuthChange = () => load();
    const clock = window.setInterval(() => setCurrentTime(Date.now()), 60000);
    window.addEventListener("glennluna:auth-changed", handleAuthChange);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener("glennluna:auth-changed", handleAuthChange);
    };
  }, [load]);

  async function setRole(id, role) {
    try {
      setError("");
      await api("/api/work/users/" + id + "/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setMessage("Role updated.");
      await load();
    } catch (roleError) {
      setError(roleError.message);
    }
  }

  async function addTask(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setAssigning(true);
    setError("");

    try {
      await api("/api/work/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          instructions: data.get("instructions"),
          dueAtUtc: data.get("dueAtUtc") || null,
          assignedToUserId: data.get("assignedToUserId"),
        }),
      });
      form.reset();
      taskDialogRef.current?.close();
      setMessage("Task assigned.");
      await load();
    } catch (taskError) {
      setError(taskError.message);
    } finally {
      setAssigning(false);
    }
  }

  async function setStatus(id, status) {
    try {
      setError("");
      await api("/api/work/tasks/" + id + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (statusError) {
      setError(statusError.message);
    }
  }

  async function submitWork(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");

    try {
      setError("");
      if (file instanceof File && file.size > 5 * 1024 * 1024) {
        throw new Error("The file must be 5 MB or smaller.");
      }

      await api("/api/work/tasks/" + id + "/submission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.get("content"),
          notes: data.get("notes"),
          link: data.get("link"),
          fileName: file instanceof File && file.size ? file.name : null,
          fileContentType: file instanceof File && file.size ? file.type : null,
          fileBase64: file instanceof File && file.size ? await readFile(file) : null,
        }),
      });
      setMessage("Your work was submitted for review.");
      await load();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  if (!session) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-32">
        Loading dashboard…
      </main>
    );
  }

  if (!session.authenticated) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-32">
        <h1 className="text-4xl font-semibold">Work dashboard</h1>
        <p className="mt-4 text-black/60">
          Please use the Login button above to access your tasks.
        </p>
      </main>
    );
  }

  const isAdmin = session.user.isTeamAdmin;
  const workers = users.filter(
    (user) => user.role === "Content Writer" || user.role === "Worker",
  );
  const doneTasks = tasks.filter((task) => task.status === "Completed");
  const dueTasks = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      task.dueAtUtc &&
      new Date(task.dueAtUtc).getTime() <= currentTime,
  );
  const ongoingTasks = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      !dueTasks.some((dueTask) => dueTask.id === task.id),
  );
  const columns = [
    {
      key: "ongoing",
      title: "Ongoing",
      description: "Active work that is still within its deadline.",
      tasks: ongoingTasks,
      accent: "bg-[#1b5e59]",
    },
    {
      key: "due",
      title: "Due",
      description: "Tasks that have reached or passed their deadline.",
      tasks: dueTasks,
      accent: "bg-[#c8643f]",
    },
    {
      key: "done",
      title: "Done",
      description: "Completed tasks kept for reference.",
      tasks: doneTasks,
      accent: "bg-[#152321]",
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-[92rem] px-6 py-28 text-[#152321] sm:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.25em] text-[#1b5e59]">
            Team workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Welcome, {session.user.displayName || session.user.email}
          </h1>
          <p className="mt-2 text-black/55">
            Role: {isAdmin ? "Administrator" : session.user.role}
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                roleDialogRef.current?.showModal();
              }}
              className="rounded-full border border-[#152321]/15 bg-white px-6 py-3 font-semibold text-[#152321] shadow-[0_14px_30px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f7f2ea]"
            >
              Account roles
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                taskDialogRef.current?.showModal();
              }}
              className="rounded-full bg-[#152321] px-6 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(21,35,33,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
            >
              Add task
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-3 text-red-700" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-emerald-800" aria-live="polite">
          {message}
        </p>
      )}

      <section className="mt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.22em] text-black/40">
            Task board
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{isAdmin ? "All tasks" : "My tasks"}</h2>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-3">
          {columns.map((column) => (
            <section
              key={column.key}
              className="min-h-[32rem] rounded-[1.75rem] border border-black/8 bg-[#f5f1ea] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={"h-2.5 w-2.5 rounded-full " + column.accent} />
                    <h3 className="text-xl font-semibold">{column.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-black/50">{column.description}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                  {column.tasks.length}
                </span>
              </div>

              <div className="mt-4 grid gap-4">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAdmin={isAdmin}
                    isDue={column.key === "due"}
                    onStatusChange={setStatus}
                    onSubmitWork={submitWork}
                  />
                ))}
                {column.tasks.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-black/12 bg-white/60 px-4 py-8 text-center text-sm text-black/45">
                    No {column.title.toLowerCase()} tasks.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      {isAdmin && (
        <dialog
          ref={roleDialogRef}
          onClick={(event) => {
            if (event.target === roleDialogRef.current) roleDialogRef.current.close();
          }}
          className="m-auto max-h-[90vh] w-[min(94vw,52rem)] overflow-y-auto rounded-[2rem] border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/60 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">
                  Administration
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Account roles</h2>
                <p className="mt-2 text-sm text-black/55">
                  Workers and Content Writers can receive and submit assigned tasks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => roleDialogRef.current?.close()}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Close
              </button>
            </div>

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p
                className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-[#f7f2ea] p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.displayName || user.email}
                    </p>
                    {user.displayName && (
                      <p className="mt-1 truncate text-xs text-black/45">{user.email}</p>
                    )}
                  </div>
                  <select
                    value={user.role}
                    onChange={(event) => setRole(user.id, event.target.value)}
                    aria-label={"Role for " + (user.displayName || user.email)}
                    className="max-w-40 rounded-xl border border-black/10 bg-white p-2 text-sm"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </dialog>
      )}

      {isAdmin && (
        <dialog
          ref={taskDialogRef}
          onClick={(event) => {
            if (event.target === taskDialogRef.current) taskDialogRef.current.close();
          }}
          className="m-auto max-h-[90vh] w-[min(94vw,38rem)] overflow-y-auto rounded-[2rem] border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/60 backdrop:backdrop-blur-sm"
        >
          <form onSubmit={addTask} className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">
                  Task board
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Add task</h2>
              </div>
              <button
                type="button"
                onClick={() => taskDialogRef.current?.close()}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Close
              </button>
            </div>

            <label className="mt-7 block text-sm font-semibold" htmlFor="task-title">
              Task name
            </label>
            <input
              id="task-title"
              name="title"
              required
              maxLength={160}
              placeholder="Task name"
              autoFocus
              className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
            />

            <label className="mt-4 block text-sm font-semibold" htmlFor="task-instructions">
              Instructions
            </label>
            <textarea
              id="task-instructions"
              name="instructions"
              maxLength={2000}
              placeholder="What needs to be done?"
              className="mt-2 min-h-32 w-full rounded-xl border border-black/10 bg-white p-3"
            />

            <label className="mt-4 block text-sm font-semibold" htmlFor="task-due">
              Due date
            </label>
            <input
              id="task-due"
              name="dueAtUtc"
              type="datetime-local"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
            />

            <label className="mt-4 block text-sm font-semibold" htmlFor="task-worker">
              Assign to
            </label>
            <select
              id="task-worker"
              name="assignedToUserId"
              required
              disabled={workers.length === 0}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.displayName || worker.email}
                </option>
              ))}
            </select>
            {workers.length === 0 && (
              <p className="mt-2 text-xs text-red-700">
                Assign a Worker or Content Writer role before creating a task.
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => taskDialogRef.current?.close()}
                className="rounded-full border border-[#152321]/15 px-5 py-2.5 text-sm font-semibold hover:bg-[#f3ece0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning || workers.length === 0}
                className="rounded-full bg-[#152321] px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning ? "Assigning…" : "Assign task"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </main>
  );
}
