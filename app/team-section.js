"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTH_CHANGED_EVENT = "glennluna:auth-changed";

const EMPTY_FORM = {
  name: "",
  role: "",
  focus: "",
  description: "",
  skills: "",
  sortOrder: "0",
  isActive: true,
  applicationUserId: "",
  useAccountProfileImage: false,
};

function getInitials(name, role) {
  const value = (name || role || "Team member").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
  }
  return value.slice(0, 2).toUpperCase();
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected photo."));
    reader.readAsDataURL(file);
  });
}

function responseError(payload, fallback) {
  if (typeof payload?.error === "string") return payload.error;
  if (payload?.errors && typeof payload.errors === "object") {
    const message = Object.values(payload.errors).flat().find(Boolean);
    if (message) return message;
  }
  return typeof payload?.title === "string" ? payload.title : fallback;
}

async function fetchJson(url, options, fallback) {
  const response = await fetch(url, options);
  const payload = response.status === 204
    ? null
    : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseError(payload, fallback));
  }

  return payload;
}

function MemberPhoto({ member, version, size = "large" }) {
  const dimensions = size === "small" ? "h-12 w-12" : "h-16 w-16";
  const pixels = size === "small" ? 48 : 64;

  return (
    <div
      className={`flex ${dimensions} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,_#dd8c36,_#f0bc74)] text-sm font-bold tracking-[0.12em] text-[#152321] shadow-[0_10px_24px_rgba(0,0,0,0.18)]`}
    >
      {member.hasPhoto && member.isActive !== false ? (
        <Image
          src={`/api/team/${member.id}/photo?v=${version}`}
          alt={`${member.name} team photo`}
          width={pixels}
          height={pixels}
          unoptimized
          className={`${dimensions} object-cover`}
        />
      ) : (
        getInitials(member.name, member.role)
      )}
    </div>
  );
}

export default function TeamSection() {
  const dialogRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [managedMembers, setManagedMembers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [managerError, setManagerError] = useState("");
  const [managerMessage, setManagerMessage] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoData, setPhotoData] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [photoVersion, setPhotoVersion] = useState(0);

  useEffect(() => {
    function handleAuthChange(event) {
      const nextIsAdmin = Boolean(event.detail?.user?.isTeamAdmin);
      setIsAdmin(nextIsAdmin);
      if (!nextIsAdmin) dialogRef.current?.close();
    }

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
  }, []);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      fetchJson(
        "/api/team",
        { cache: "no-store" },
        "Unable to load the team right now.",
      ),
      fetchJson(
        "/api/auth/session",
        { cache: "no-store" },
        "Unable to check your account.",
      ),
    ]).then(([teamResult, sessionResult]) => {
      if (!active) return;

      if (teamResult.status === "fulfilled") {
        setMembers(Array.isArray(teamResult.value) ? teamResult.value : []);
      } else {
        setTeamError(teamResult.reason.message);
      }

      if (sessionResult.status === "fulfilled") {
        setIsAdmin(Boolean(
          sessionResult.value?.authenticated &&
          sessionResult.value?.user?.isTeamAdmin,
        ));
      }

      setTeamLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  async function openManager() {
    setManagerLoading(true);
    setManagerError("");
    setManagerMessage("");
    setEditorOpen(false);
    dialogRef.current?.showModal();

    try {
      const [result, users] = await Promise.all([
        fetchJson("/api/team/manage", { cache: "no-store" }, "Unable to load the team manager."),
        fetchJson("/api/work/users", { cache: "no-store" }, "Unable to load registered accounts."),
      ]);
      setManagedMembers(Array.isArray(result) ? result : []);
      setRegisteredUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      setManagerError(error.message);
    } finally {
      setManagerLoading(false);
    }
  }

  function startAdd() {
    setEditingMember(null);
    setForm({
      ...EMPTY_FORM,
      sortOrder: String(managedMembers.length + 1),
    });
    setPhotoData(null);
    setRemovePhoto(false);
    setManagerError("");
    setManagerMessage("");
    setEditorOpen(true);
  }

  function startEdit(member) {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      role: member.role || "",
      focus: member.focus || "",
      description: member.description || "",
      skills: Array.isArray(member.skills) ? member.skills.join(", ") : "",
      sortOrder: String(member.sortOrder ?? 0),
      isActive: Boolean(member.isActive),
      applicationUserId: member.applicationUserId || "",
      useAccountProfileImage: Boolean(member.useAccountProfileImage),
    });
    setPhotoData(null);
    setRemovePhoto(false);
    setManagerError("");
    setManagerMessage("");
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingMember(null);
    setPhotoData(null);
    setRemovePhoto(false);
    setManagerError("");
  }

  function updateField(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "applicationUserId" && !value ? { useAccountProfileImage: false } : {}),
    }));
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoData(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setManagerError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setManagerError("Worker photo must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readImage(file);
      setPhotoData({
        preview: dataUrl,
        base64: dataUrl.split(",", 2)[1],
        contentType: file.type,
      });
      setRemovePhoto(false);
      setManagerError("");
    } catch (error) {
      setManagerError(error.message);
    }
  }

  async function refreshLists() {
    const [publicMembers, allMembers] = await Promise.all([
      fetchJson(
        "/api/team",
        { cache: "no-store" },
        "Unable to refresh the team.",
      ),
      fetchJson(
        "/api/team/manage",
        { cache: "no-store" },
        "Unable to refresh the team manager.",
      ),
    ]);
    setMembers(Array.isArray(publicMembers) ? publicMembers : []);
    setManagedMembers(Array.isArray(allMembers) ? allMembers : []);
    setPhotoVersion(Date.now());
    setTeamError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setManagerError("");
    setManagerMessage("");

    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill, index, list) => (
        skill && list.findIndex((item) => item.toLowerCase() === skill.toLowerCase()) === index
      ));

    if (skills.length > 10 || skills.some((skill) => skill.length > 40)) {
      setManagerError("Add up to 10 skills, each 40 characters or fewer.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      focus: form.focus.trim(),
      description: form.description.trim(),
      skills,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isActive: form.isActive,
      applicationUserId: form.applicationUserId || null,
      useAccountProfileImage: form.useAccountProfileImage,
      photoBase64: photoData?.base64 || null,
      photoContentType: photoData?.contentType || null,
      removePhoto,
    };

    try {
      await fetchJson(
        editingMember ? `/api/team/${editingMember.id}` : "/api/team",
        {
          method: editingMember ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        editingMember ? "Unable to update this worker." : "Unable to add this worker.",
      );
      await refreshLists();
      setManagerMessage(
        editingMember
          ? `${payload.name} was updated.`
          : `${payload.name} was added to the team.`,
      );
      closeEditor();
    } catch (error) {
      setManagerError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(member) {
    if (!window.confirm(`Remove ${member.name} from the team? This cannot be undone.`)) {
      return;
    }

    setDeletingId(member.id);
    setManagerError("");
    setManagerMessage("");
    try {
      await fetchJson(
        `/api/team/${member.id}`,
        { method: "DELETE" },
        "Unable to remove this worker.",
      );
      await refreshLists();
      setManagerMessage(`${member.name} was removed from the team.`);
    } catch (error) {
      setManagerError(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  const photoPreview = photoData?.preview || (
    editingMember?.hasPhoto && editingMember.isActive && !removePhoto
      ? `/api/team/${editingMember.id}/photo?v=${photoVersion}`
      : ""
  );

  return (
    <section
      id="team"
      className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12"
    >
      <div className="fade-up overflow-hidden rounded-[2.25rem] border border-black/8 bg-[#152321] p-8 text-white shadow-[0_24px_60px_rgba(21,35,33,0.16)] sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
              The Team
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              A few people I work with.
            </h3>
            {isAdmin && (
              <button
                type="button"
                onClick={openManager}
                className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-[#f3ece0]"
              >
                Manage team
              </button>
            )}
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/68 lg:justify-self-end">
            When a project needs help beyond development, I work with people
            who can handle the visuals and the writing.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {teamLoading && [0, 1].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/7"
              aria-hidden="true"
            />
          ))}

          {!teamLoading && teamError && (
            <p className="rounded-[1.75rem] border border-red-200/20 bg-red-400/10 p-6 text-sm text-red-50 md:col-span-2">
              {teamError}
            </p>
          )}

          {!teamLoading && !teamError && members.length === 0 && (
            <p className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6 text-sm leading-7 text-white/68 md:col-span-2">
              Team profiles will appear here as they are added.
            </p>
          )}

          {!teamLoading && !teamError && members.map((member) => (
            <article
              key={member.id}
              className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6 backdrop-blur sm:p-7"
            >
              <div className="flex items-center gap-4">
                <MemberPhoto member={member} version={photoVersion} />
                <div className="min-w-0">
                  <h4 className="truncate text-xl font-semibold">{member.name}</h4>
                  {member.role?.toLowerCase() !== member.name?.toLowerCase() && (
                    <p className="mt-1 text-sm font-medium text-[#f0bc74]">{member.role}</p>
                  )}
                  {member.focus && (
                    <p className="mt-1 text-sm text-white/55">{member.focus}</p>
                  )}
                </div>
              </div>
              {member.description && (
                <p className="mt-5 text-sm leading-7 text-white/72">
                  {member.description}
                </p>
              )}
              {member.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/72"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto max-h-[90vh] w-[min(94vw,60rem)] overflow-y-auto rounded-[2rem] border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">
                Administration
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {editorOpen
                  ? editingMember ? "Edit worker" : "Add worker"
                  : "Team manager"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5"
            >
              Close
            </button>
          </div>

          {managerMessage && !editorOpen && (
            <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" aria-live="polite">
              {managerMessage}
            </p>
          )}
          {managerError && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {managerError}
            </p>
          )}

          {!editorOpen && (
            <>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm leading-6 text-black/60">
                  Add workers, update their details, or control who appears on the public page.
                </p>
                <button
                  type="button"
                  onClick={startAdd}
                  className="shrink-0 rounded-full bg-[#152321] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1a18]"
                >
                  Add worker
                </button>
              </div>

              {managerLoading ? (
                <div className="mt-6 h-40 animate-pulse rounded-3xl bg-black/6" aria-label="Loading team members" />
              ) : (
                <div className="mt-6 grid gap-3">
                  {managedMembers.length === 0 && !managerError && (
                    <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-sm text-black/55">
                      No workers have been added yet.
                    </p>
                  )}
                  {managedMembers.map((member) => (
                    <article
                      key={member.id}
                      className={`flex flex-col gap-4 rounded-2xl border border-black/8 p-4 sm:flex-row sm:items-center ${member.isActive ? "bg-white" : "bg-black/4 opacity-70"}`}
                    >
                      <MemberPhoto member={member} version={photoVersion} size="small" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold">{member.name}</h3>
                          {!member.isActive && (
                            <span className="rounded-full bg-black/8 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-black/55">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-black/55">
                          {member.role} · Order {member.sortOrder}
                        </p>
                        <p className="mt-1 text-xs text-black/45">
                          {member.applicationUserEmail ? `Linked to ${member.applicationUserEmail}` : "No registered account linked"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(member)}
                          className="rounded-full border border-[#152321]/15 px-4 py-2 text-sm font-semibold hover:bg-[#f3ece0]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMember(member)}
                          disabled={deletingId === member.id}
                          className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                        >
                          {deletingId === member.id ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {editorOpen && (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Name
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={updateField}
                    maxLength={100}
                    autoComplete="name"
                    required
                    autoFocus
                    className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Role
                  <input
                    name="role"
                    type="text"
                    value={form.role}
                    onChange={updateField}
                    maxLength={100}
                    required
                    className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                  />
                </label>
              </div>

              <label className="mt-5 block text-sm font-semibold">
                Registered account
                <select
                  name="applicationUserId"
                  value={form.applicationUserId}
                  onChange={updateField}
                  className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                >
                  <option value="">Not linked</option>
                  {registeredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName ? `${user.displayName} (${user.email})` : user.email}
                    </option>
                  ))}
                </select>
                <span className="mt-2 block text-xs font-normal leading-5 text-black/50">
                  Link this worker profile to one registered login account.
                </span>
              </label>

              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
                <input
                  name="useAccountProfileImage"
                  type="checkbox"
                  checked={form.useAccountProfileImage}
                  disabled={!form.applicationUserId}
                  onChange={updateField}
                  className="h-4 w-4 rounded border-black/20"
                />
                Use the profile photo uploaded by this registered worker
              </label>

              <label className="mt-5 block text-sm font-semibold">
                Focus
                <input
                  name="focus"
                  type="text"
                  value={form.focus}
                  onChange={updateField}
                  maxLength={160}
                  placeholder="What this person helps with"
                  className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none placeholder:text-black/35 focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                />
              </label>

              <label className="mt-5 block text-sm font-semibold">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  maxLength={1000}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                />
              </label>

              <label className="mt-5 block text-sm font-semibold">
                Skills
                <input
                  name="skills"
                  type="text"
                  value={form.skills}
                  onChange={updateField}
                  placeholder="Brand Design, Illustration, Creative Direction"
                  className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none placeholder:text-black/35 focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-black/50">
                  Separate skills with commas. Up to 10 skills, 40 characters each.
                </span>
              </label>

              <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-end">
                <label className="block text-sm font-semibold">
                  Sort order
                  <input
                    name="sortOrder"
                    type="number"
                    value={form.sortOrder}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 font-normal outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={updateField}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  Show this worker on the public page
                </label>
              </div>

              <div className="mt-6 rounded-2xl border border-black/8 bg-[#f7f3ec] p-4 sm:flex sm:items-center sm:gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,_#dd8c36,_#f0bc74)] font-bold tracking-[0.12em] text-[#152321]">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Worker photo preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="h-20 w-20 object-cover"
                    />
                  ) : (
                    getInitials(form.name, form.role)
                  )}
                </div>
                <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                  <label className="block text-sm font-semibold">
                    Worker photo
                    <input
                      key={editingMember?.id ?? "new"}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      disabled={form.useAccountProfileImage}
                      className="mt-2 block w-full text-sm text-black/60 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-[#152321]"
                    />
                  </label>
                  <p className="mt-2 text-xs text-black/50">JPEG, PNG, or WebP. Maximum 2 MB.</p>
                  {editingMember?.hasPhoto && !form.useAccountProfileImage && (
                    <label className="mt-3 flex items-center gap-2 text-sm text-black/65">
                      <input
                        type="checkbox"
                        checked={removePhoto}
                        onChange={(event) => {
                          setRemovePhoto(event.target.checked);
                          if (event.target.checked) setPhotoData(null);
                        }}
                        className="h-4 w-4 rounded border-black/20"
                      />
                      Remove the current photo and use initials
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-full border border-[#152321]/15 px-5 py-2.5 text-sm font-semibold hover:bg-[#f3ece0]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#152321] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f1a18] disabled:cursor-wait disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : editingMember ? "Save changes" : "Add worker"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
