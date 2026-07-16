"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ROLE_OPTIONS = [
  "User",
  "Admin",
  "Content Writer",
  "Worker",
  "Graphic Designer",
  "KidCreator",
  "ParentReviewer",
];
const TASK_STATUS_OPTIONS = ["Assigned", "In Progress", "Submitted", "Completed"];
const QUOTE_STATUS_OPTIONS = ["New", "Reviewing", "Quoted", "Accepted", "Declined", "Closed"];
const DESIGN_STATUS_OPTIONS = ["Draft", "Submitted", "Approved", "Published"];
const DESIGN_KANBAN_COLUMNS = [
  {
    status: "Draft",
    title: "Draft",
    description: "Ideas still being shaped before review.",
    accent: "bg-stone-400",
    panel: "bg-[#f7f2ea]",
  },
  {
    status: "Submitted",
    title: "Submitted",
    description: "Ready for an adult reviewer to check.",
    accent: "bg-amber-500",
    panel: "bg-amber-50",
  },
  {
    status: "Approved",
    title: "Approved",
    description: "Reviewed, but not public yet.",
    accent: "bg-sky-500",
    panel: "bg-sky-50",
  },
  {
    status: "Published",
    title: "Published",
    description: "Visible in the public Kids Corner gallery.",
    accent: "bg-emerald-500",
    panel: "bg-emerald-50",
  },
];
const OFFER_STATUS_OPTIONS = ["New", "Reviewing", "Accepted", "Declined"];
const DESIGN_FILE_ACCEPT =
  "image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.docx";

async function api(url, options) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "Something went wrong.");
  }
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

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : "Not set";
}

function formatMoney(amount, currency) {
  if (!amount) return "Not set";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency || "CAD",
  }).format(amount);
}

function getDesignStatusTone(status) {
  switch (status) {
    case "Submitted":
      return "bg-amber-100 text-amber-800";
    case "Approved":
      return "bg-sky-100 text-sky-800";
    case "Published":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function getQuoteStatusTone(status) {
  switch (status) {
    case "Reviewing":
      return "bg-amber-100 text-amber-800";
    case "Quoted":
      return "bg-sky-100 text-sky-800";
    case "Accepted":
      return "bg-emerald-100 text-emerald-800";
    case "Declined":
      return "bg-red-50 text-red-700";
    case "Closed":
      return "bg-stone-200 text-stone-700";
    default:
      return "bg-[#edf4f1] text-[#1b5e59]";
  }
}

async function buildDesignPayload(form, submit) {
  const data = new FormData(form);
  const file = data.get("file");

  if (file instanceof File && file.size > 5 * 1024 * 1024) {
    throw new Error("The file must be 5 MB or smaller.");
  }

  return {
    title: data.get("title"),
    description: data.get("description"),
    designLink: data.get("designLink"),
    fileName: file instanceof File && file.size ? file.name : null,
    fileContentType: file instanceof File && file.size ? file.type : null,
    fileBase64: file instanceof File && file.size ? await readFile(file) : null,
    removeFile: data.get("removeFile") === "on",
    submit,
  };
}

function QuoteCard({ quote, isAdmin, savingQuoteId, onStatusChange }) {
  return (
    <article className="rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold">{quote.projectType || "Project quote"}</h3>
            <span
              className={
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] " +
                getQuoteStatusTone(quote.status)
              }
            >
              {quote.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-black/55">
            {quote.company || "No company listed"} · {formatDateTime(quote.createdAtUtc)}
          </p>
          {isAdmin && (
            <p className="mt-1 text-xs text-black/45">
              {quote.ownerName || quote.name} · {quote.email}
            </p>
          )}
        </div>

        {isAdmin && (
          <label className="block text-xs font-semibold uppercase tracking-wide text-black/45">
            Status
            <select
              value={quote.status}
              onChange={(event) => onStatusChange(quote.id, event.target.value)}
              disabled={savingQuoteId === quote.id}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#152321] disabled:opacity-60"
            >
              {QUOTE_STATUS_OPTIONS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl bg-[#f7f2ea] p-4 text-sm text-black/65 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-[#152321]">Timeline:</span>{" "}
          {quote.timeline || "Not provided"}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Budget:</span>{" "}
          {quote.budget || "Not provided"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold text-[#152321]">Services:</span>{" "}
          {quote.services?.length ? quote.services.join(", ") : "Not provided"}
        </p>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-7 text-black/68">
        <p className="whitespace-pre-wrap">{quote.details}</p>
        {quote.infrastructureNotes && (
          <p className="whitespace-pre-wrap rounded-2xl border border-black/8 bg-[#fbfaf6] p-4">
            <span className="font-semibold text-[#152321]">Infrastructure notes:</span>{" "}
            {quote.infrastructureNotes}
          </p>
        )}
      </div>
    </article>
  );
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
          Due {formatDateTime(task.dueAtUtc)}
        </p>
      )}

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-black/45">
        Status
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#152321]"
        >
          {TASK_STATUS_OPTIONS.map((status) => (
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
          <input name="file" type="file" accept={DESIGN_FILE_ACCEPT} className="mt-3 block w-full text-sm" />
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

function KidDesignCard({
  design,
  canEdit,
  canReview,
  currentUserId,
  savingKey,
  statusSavingId,
  onSave,
  onReviewSave,
}) {
  const isOwner = design.ownerUserId === currentUserId;
  const cardKey = design.id + "-" + design.updatedAtUtc;

  return (
    <article className="rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold">{design.title}</h3>
            <span
              className={
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] " +
                getDesignStatusTone(design.status)
              }
            >
              {design.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-black/55">
            {design.ownerName || "Private owner"}{isOwner ? " · Your design" : ""}
          </p>
        </div>
        <div className="text-xs text-black/45 sm:text-right">
          <p>Updated {formatDateTime(design.updatedAtUtc)}</p>
          {design.reviewedAtUtc && <p className="mt-1">Reviewed {formatDateTime(design.reviewedAtUtc)}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl bg-[#f7f2ea] p-4 text-sm text-black/65 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-[#152321]">Created:</span>{" "}
          {formatDateTime(design.createdAtUtc)}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Submitted:</span>{" "}
          {formatDateTime(design.submittedAtUtc)}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Reviewed by:</span>{" "}
          {design.reviewerName || "Not reviewed yet"}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Published:</span>{" "}
          {formatDateTime(design.publishedAtUtc)}
        </p>
      </div>

      {canEdit ? (
        <form key={cardKey} onSubmit={(event) => onSave(event, design.id)} className="mt-5">
          <label className="block text-sm font-semibold" htmlFor={"design-title-" + design.id}>
            Project title
          </label>
          <input
            id={"design-title-" + design.id}
            name="title"
            maxLength={120}
            required
            defaultValue={design.title}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor={"design-description-" + design.id}>
            Description
          </label>
          <textarea
            id={"design-description-" + design.id}
            name="description"
            maxLength={2000}
            defaultValue={design.description}
            placeholder="Tell the reviewer what you made."
            className="mt-2 min-h-28 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor={"design-link-" + design.id}>
            Design link
          </label>
          <input
            id={"design-link-" + design.id}
            name="designLink"
            type="url"
            maxLength={500}
            defaultValue={design.designLink}
            placeholder="https://"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor={"design-file-" + design.id}>
            Upload file
          </label>
          <input
            id={"design-file-" + design.id}
            name="file"
            type="file"
            accept={DESIGN_FILE_ACCEPT}
            className="mt-2 block w-full text-sm"
          />

          {design.hasDesignFile && (
            <div className="mt-3 rounded-xl border border-black/8 bg-[#fbfaf6] p-3 text-sm">
              <a
                href={"/api/work/designs/" + design.id + "/file"}
                className="font-semibold text-[#1b5e59] underline"
              >
                Download {design.designFileName}
              </a>
              <label className="mt-3 flex items-center gap-2 text-black/60">
                <input type="checkbox" name="removeFile" className="h-4 w-4 rounded border-black/20" />
                Remove current file
              </label>
            </div>
          )}

          <p className="mt-3 text-xs text-black/50">
            JPEG, PNG, WebP, PDF, DOCX, or TXT. Maximum 5 MB.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              value="draft"
              disabled={savingKey === "design-" + design.id}
              className="rounded-full border border-[#152321]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#152321] disabled:opacity-50"
            >
              {savingKey === "design-" + design.id ? "Saving..." : "Save draft"}
            </button>
            <button
              type="submit"
              value="submit"
              disabled={savingKey === "design-" + design.id}
              className="rounded-full bg-[#152321] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {savingKey === "design-" + design.id ? "Saving..." : "Submit for review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5">
          {isOwner && (design.status === "Approved" || design.status === "Published") && (
            <p className="mb-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
              This design is locked because it has already been approved or published.
            </p>
          )}
          <p className="whitespace-pre-wrap text-sm leading-7 text-black/68">
            {design.description || "No description yet."}
          </p>
          {design.designLink && (
            <a
              href={design.designLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm font-semibold text-[#1b5e59] underline"
            >
              Open design link
            </a>
          )}
          {design.hasDesignFile && (
            <a
              href={"/api/work/designs/" + design.id + "/file"}
              className="mt-3 block text-sm font-semibold text-[#1b5e59] underline"
            >
              Download {design.designFileName}
            </a>
          )}
        </div>
      )}

      {canReview && (
        <form onSubmit={(event) => onReviewSave(event, design.id)} className="mt-5 border-t border-black/10 pt-5">
          <label className="block text-sm font-semibold" htmlFor={"design-status-" + design.id}>
            Review status
          </label>
          <select
            id={"design-status-" + design.id}
            name="status"
            defaultValue={design.status}
            disabled={statusSavingId === design.id}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 text-sm disabled:opacity-60"
          >
            {DESIGN_STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <div className="mt-4 rounded-2xl bg-[#f7f2ea] p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                name="isForSale"
                type="checkbox"
                defaultChecked={design.isForSale}
                className="h-4 w-4 rounded border-black/20"
              />
              List for public offers
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_0.55fr]">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-black/45" htmlFor={"asking-price-" + design.id}>
                  Asking price
                </label>
                <input
                  id={"asking-price-" + design.id}
                  name="askingPrice"
                  type="number"
                  min="0.01"
                  max="10000"
                  step="0.01"
                  defaultValue={design.askingPrice || ""}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-black/45" htmlFor={"sale-currency-" + design.id}>
                  Currency
                </label>
                <select
                  id={"sale-currency-" + design.id}
                  name="saleCurrency"
                  defaultValue={design.saleCurrency || "CAD"}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 text-sm"
                >
                  <option>CAD</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-black/50">
              Only published designs can be listed publicly for offers.
            </p>
          </div>

          <p className="mt-2 text-xs text-black/50">
            Parent reviewers and administrators decide when a design can be approved or published.
          </p>

          <button
            type="submit"
            disabled={statusSavingId === design.id}
            className="mt-4 rounded-full bg-[#152321] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {statusSavingId === design.id ? "Saving..." : "Save review settings"}
          </button>
        </form>
      )}
    </article>
  );
}

function KidDesignKanbanCard({ design, canReview, savingId, onStatusChange }) {
  return (
    <article className="rounded-[1.25rem] border border-black/8 bg-white/86 p-4 shadow-[0_12px_28px_rgba(21,35,33,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-base font-semibold">{design.title}</h4>
          <p className="mt-1 truncate text-xs text-black/48">
            {design.ownerName || "Private creator"}
          </p>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] " +
            getDesignStatusTone(design.status)
          }
        >
          {design.status}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-xs leading-5 text-black/58">
        {design.description || "No description yet."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#152321]">
        <span className="rounded-full bg-[#f7f2ea] px-2.5 py-1">
          {design.hasDesignFile ? "File attached" : "No file"}
        </span>
        {design.isForSale && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">
            Offers open
          </span>
        )}
      </div>

      <div className="mt-4 text-[11px] leading-5 text-black/45">
        <p>Updated {formatDateTime(design.updatedAtUtc)}</p>
        {design.publishedAtUtc && <p>Published {formatDateTime(design.publishedAtUtc)}</p>}
      </div>

      {canReview && (
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-black/45">
          Move to
          <select
            value={design.status}
            onChange={(event) => onStatusChange(design, event.target.value)}
            disabled={savingId === design.id}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-2.5 text-sm font-normal normal-case tracking-normal text-[#152321] disabled:opacity-60"
          >
            {DESIGN_STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      )}
    </article>
  );
}

function OfferCard({ offer, savingOfferId, onStatusChange }) {
  return (
    <article className="rounded-[1.25rem] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold">{offer.designTitle}</h4>
          <p className="mt-1 text-sm text-black/55">
            {offer.buyerName} · {offer.buyerEmail}
          </p>
        </div>
        <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#1b5e59]">
          {offer.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl bg-[#f7f2ea] p-4 text-sm text-black/65 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-[#152321]">Offer:</span>{" "}
          {formatMoney(offer.offerAmount, offer.currency)}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Creator:</span>{" "}
          {offer.ownerName || "Private creator"}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Received:</span>{" "}
          {formatDateTime(offer.createdAtUtc)}
        </p>
        <p>
          <span className="font-semibold text-[#152321]">Reviewed:</span>{" "}
          {formatDateTime(offer.reviewedAtUtc)}
        </p>
      </div>

      {offer.message && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/68">
          {offer.message}
        </p>
      )}

      <label className="mt-4 block text-sm font-semibold" htmlFor={"offer-status-" + offer.id}>
        Offer status
      </label>
      <select
        id={"offer-status-" + offer.id}
        value={offer.status}
        onChange={(event) => onStatusChange(offer.id, event.target.value)}
        disabled={savingOfferId === offer.id}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 text-sm disabled:opacity-60"
      >
        {OFFER_STATUS_OPTIONS.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </article>
  );
}

export default function WorkDashboard() {
  const roleDialogRef = useRef(null);
  const taskDialogRef = useRef(null);
  const [session, setSession] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [designOffers, setDesignOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [savingDesignKey, setSavingDesignKey] = useState("");
  const [savingDesignStatusId, setSavingDesignStatusId] = useState(null);
  const [savingQuoteId, setSavingQuoteId] = useState(null);
  const [savingOfferId, setSavingOfferId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const load = useCallback(async () => {
    try {
      const nextSession = await api("/api/auth/session");
      setError("");
      setSession(nextSession);

      if (!nextSession.authenticated) {
        setQuotes([]);
        setTasks([]);
        setDesigns([]);
        setDesignOffers([]);
        setUsers([]);
        return;
      }

      const canReviewKidDesigns =
        nextSession.user.isTeamAdmin ||
        nextSession.user.role === "ParentReviewer";
      const quoteRequest = api("/api/work/quotes").catch((quoteLoadError) => {
        console.warn("Quote requests could not be loaded:", quoteLoadError);
        return [];
      });
      const [quoteList, taskList, designList, offerList, userList] = await Promise.all([
        quoteRequest,
        api("/api/work/tasks"),
        api("/api/work/designs"),
        canReviewKidDesigns ? api("/api/work/design-offers") : Promise.resolve([]),
        nextSession.user.isTeamAdmin ? api("/api/work/users") : Promise.resolve([]),
      ]);

      setQuotes(quoteList);
      setTasks(taskList);
      setDesigns(designList);
      setDesignOffers(offerList);
      setUsers(userList);
      setCurrentTime(Date.now());
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

  async function setTaskStatus(id, status) {
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

  async function setQuoteStatus(id, status) {
    try {
      setError("");
      setSavingQuoteId(id);
      await api("/api/work/quotes/" + id + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMessage("Quote status updated.");
      await load();
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setSavingQuoteId(null);
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

  async function saveDesign(event, id = null) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = event.nativeEvent.submitter?.value === "submit";
    const requestPath = id ? "/api/work/designs/" + id : "/api/work/designs";
    const requestMethod = id ? "PUT" : "POST";
    const savingKey = id ? "design-" + id : "new-design";

    try {
      setError("");
      setSavingDesignKey(savingKey);

      const payload = await buildDesignPayload(form, submit);
      await api(requestPath, {
        method: requestMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!id) {
        form.reset();
      }

      setMessage(submit ? "Design submitted for review." : "Design draft saved.");
      await load();
    } catch (designError) {
      setError(designError.message);
    } finally {
      setSavingDesignKey("");
    }
  }

  async function saveDesignReview(event, id) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const askingPrice = data.get("askingPrice");

    try {
      setError("");
      setSavingDesignStatusId(id);
      await api("/api/work/designs/" + id + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: data.get("status"),
          isForSale: data.get("isForSale") === "on",
          askingPrice: askingPrice ? Number(askingPrice) : null,
          saleCurrency: data.get("saleCurrency"),
        }),
      });
      setMessage("Design review settings updated.");
      await load();
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setSavingDesignStatusId(null);
    }
  }

  async function setDesignStatus(design, status) {
    try {
      setError("");
      setSavingDesignStatusId(design.id);
      await api("/api/work/designs/" + design.id + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          isForSale: status === "Published" && design.isForSale,
          askingPrice: status === "Published" ? design.askingPrice : null,
          saleCurrency: design.saleCurrency || "CAD",
        }),
      });
      setMessage("Design moved to " + status + ".");
      await load();
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setSavingDesignStatusId(null);
    }
  }

  async function setOfferStatus(id, status) {
    try {
      setError("");
      setSavingOfferId(id);
      await api("/api/work/design-offers/" + id + "/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMessage("Offer status updated.");
      await load();
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setSavingOfferId(null);
    }
  }

  if (!session) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-32">
        Loading dashboard...
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
  const canCreateDesigns = session.user.role === "KidCreator";
  const canReviewDesigns = isAdmin || session.user.role === "ParentReviewer";
  const canUseDesigns = canCreateDesigns || canReviewDesigns;
  const workers = users.filter(
    (user) =>
      user.role === "Content Writer" ||
      user.role === "Worker" ||
      user.role === "Graphic Designer",
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
  const taskColumns = [
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
  const designCounts = DESIGN_STATUS_OPTIONS.map((status) => ({
    status,
    count: designs.filter((design) => design.status === status).length,
  }));
  const designKanbanColumns = DESIGN_KANBAN_COLUMNS.map((column) => ({
    ...column,
    designs: designs.filter((design) => design.status === column.status),
  }));

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

      <section className="mt-10 rounded-[2rem] border border-black/8 bg-[#f5f1ea] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[.22em] text-[#1b5e59]">
              Quote dashboard
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              {isAdmin ? "Quote request inbox" : "My quote requests"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/62">
              {isAdmin
                ? "Review saved quote requests from signed-in users and update their status as the conversation moves forward."
                : "Create a quote request while signed in and track the request status here."}
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,35,33,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
          >
            Create quote request
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {quotes.length ? (
            quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                isAdmin={isAdmin}
                savingQuoteId={savingQuoteId}
                onStatusChange={setQuoteStatus}
              />
            ))
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-black/12 bg-white/72 p-8 text-center text-sm text-black/45 lg:col-span-2">
              {isAdmin
                ? "No saved quote requests yet."
                : "No quote requests yet. Start one when you are ready."}
            </p>
          )}
        </div>
      </section>

      {canUseDesigns && (
        <section className="mt-10 rounded-[2rem] border border-black/8 bg-[#f5f1ea] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[.22em] text-[#1b5e59]">
                Kids Corner studio
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {canReviewDesigns ? "Private review queue" : "My design submissions"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-black/62">
                {canReviewDesigns
                  ? "Review kid submissions privately, approve strong work, and publish only what is ready."
                  : "Save drafts, upload files, and submit finished designs for parent or administrator review."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {designCounts.map((item) => (
                <div key={item.status} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#152321]">
                  {item.status}: {item.count}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Studio Kanban</h3>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Track every kids design from first draft to public gallery.
                </p>
              </div>
              <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#152321]">
                {designs.length} total
              </p>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-4">
              {designKanbanColumns.map((column) => (
                <section
                  key={column.status}
                  className={"min-h-72 rounded-[1.5rem] border border-black/8 p-4 " + column.panel}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-black/8 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={"h-2.5 w-2.5 rounded-full " + column.accent} />
                        <h4 className="text-lg font-semibold">{column.title}</h4>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-black/52">{column.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                      {column.designs.length}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {column.designs.map((design) => (
                      <KidDesignKanbanCard
                        key={design.id}
                        design={design}
                        canReview={canReviewDesigns}
                        savingId={savingDesignStatusId}
                        onStatusChange={setDesignStatus}
                      />
                    ))}
                    {column.designs.length === 0 && (
                      <p className="rounded-2xl border border-dashed border-black/12 bg-white/58 px-4 py-8 text-center text-sm text-black/45">
                        No {column.title.toLowerCase()} designs.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {canCreateDesigns && (
            <form
              onSubmit={(event) => saveDesign(event)}
              className="mt-8 rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Start a new design</h3>
                  <p className="mt-2 text-sm text-black/58">
                    Add a title, a short description, a link, or a file. Save it as a draft until it is ready.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold" htmlFor="new-design-title">
                    Project title
                  </label>
                  <input
                    id="new-design-title"
                    name="title"
                    maxLength={120}
                    required
                    placeholder="My poster project"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold" htmlFor="new-design-description">
                    Description
                  </label>
                  <textarea
                    id="new-design-description"
                    name="description"
                    maxLength={2000}
                    placeholder="Tell us what you made and what idea it is based on."
                    className="mt-2 min-h-32 w-full rounded-xl border border-black/10 bg-white p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold" htmlFor="new-design-link">
                    Design link
                  </label>
                  <input
                    id="new-design-link"
                    name="designLink"
                    type="url"
                    maxLength={500}
                    placeholder="https://"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold" htmlFor="new-design-file">
                    Upload file
                  </label>
                  <input
                    id="new-design-file"
                    name="file"
                    type="file"
                    accept={DESIGN_FILE_ACCEPT}
                    className="mt-2 block w-full text-sm"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-black/50">
                JPEG, PNG, WebP, PDF, DOCX, or TXT. Maximum 5 MB.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  value="draft"
                  disabled={savingDesignKey === "new-design"}
                  className="rounded-full border border-[#152321]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#152321] disabled:opacity-50"
                >
                  {savingDesignKey === "new-design" ? "Saving..." : "Save draft"}
                </button>
                <button
                  type="submit"
                  value="submit"
                  disabled={savingDesignKey === "new-design"}
                  className="rounded-full bg-[#152321] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {savingDesignKey === "new-design" ? "Saving..." : "Submit for review"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <h3 className="text-2xl font-semibold">
              {canReviewDesigns ? "All private submissions" : "Saved designs"}
            </h3>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              {designs.map((design) => (
                <KidDesignCard
                  key={design.id}
                  design={design}
                  canEdit={
                    canCreateDesigns &&
                    design.ownerUserId === session.user.id &&
                    design.status !== "Approved" &&
                    design.status !== "Published"
                  }
                  canReview={canReviewDesigns}
                  currentUserId={session.user.id}
                  savingKey={savingDesignKey}
                  statusSavingId={savingDesignStatusId}
                  onSave={saveDesign}
                  onReviewSave={saveDesignReview}
                />
              ))}
              {designs.length === 0 && (
                <p className="rounded-2xl border border-dashed border-black/12 bg-white/70 px-4 py-8 text-center text-sm text-black/45 xl:col-span-2">
                  No private design submissions yet.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {canReviewDesigns && (
        <section className="mt-10 rounded-[2rem] border border-black/8 bg-[#f5f1ea] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[.22em] text-[#1b5e59]">
                Offer inbox
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Buyer offers</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-black/62">
                Buyer messages stay in this reviewer queue. Parent reviewers or admins handle any reply or sale decision.
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#152321]">
              {designOffers.length} offers
            </span>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {designOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                savingOfferId={savingOfferId}
                onStatusChange={setOfferStatus}
              />
            ))}
            {designOffers.length === 0 && (
              <p className="rounded-2xl border border-dashed border-black/12 bg-white/70 px-4 py-8 text-center text-sm text-black/45 xl:col-span-2">
                No buyer offers yet.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.22em] text-black/40">
            Task board
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{isAdmin ? "All tasks" : "My tasks"}</h2>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-3">
          {taskColumns.map((column) => (
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
                    onStatusChange={setTaskStatus}
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
            if (event.target === roleDialogRef.current) {
              roleDialogRef.current.close();
            }
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
                  New accounts start as normal Users. Admins can promote trusted accounts, assign work roles, and keep kids' design publishing supervised.
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

            <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-[#f7f2ea] p-4 text-sm text-black/60 sm:grid-cols-2">
              <p><span className="font-semibold text-[#152321]">User:</span> Standard account access.</p>
              <p><span className="font-semibold text-[#152321]">Admin:</span> Full dashboard access, role management, task assignment, and review controls.</p>
              <p><span className="font-semibold text-[#152321]">Worker:</span> Receives assigned tasks.</p>
              <p><span className="font-semibold text-[#152321]">Content Writer:</span> Receives writing tasks.</p>
              <p><span className="font-semibold text-[#152321]">Graphic Designer:</span> Receives graphics tasks and submits updated design files.</p>
              <p><span className="font-semibold text-[#152321]">KidCreator:</span> Creates and edits private design submissions.</p>
              <p><span className="font-semibold text-[#152321]">ParentReviewer:</span> Reviews kid submissions and controls approval or publication.</p>
            </div>

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
            if (event.target === taskDialogRef.current) {
              taskDialogRef.current.close();
            }
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
                Assign a Worker, Content Writer, or Graphic Designer role before creating a task.
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
                {assigning ? "Assigning..." : "Assign task"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </main>
  );
}
