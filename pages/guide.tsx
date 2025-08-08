import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "@/Context/app_context";
import { AssetContext } from "@/Context/asset_context";

export default function Guide() {
  const { currentPage, toggleSidePanelVisible, setSidePanelButtonVisible } = useContext(AppContext);
  const { currentAsset } = useContext(AssetContext);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bug");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(null);

  useEffect(() => {
    // Hide side panel button on this page (match Settings behavior)
    setSidePanelButtonVisible(false);
  }, [setSidePanelButtonVisible]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, category }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ ok: true, message: "Thanks! Your report was submitted." });
        setSubject("");
        setDescription("");
      } else {
        setResult({ ok: false, message: data.error || "Failed to submit." });
      }
    } catch (err: any) {
      setResult({ ok: false, message: String(err?.message || err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-4">
      <h1 className="text-xl font-semibold">Report an issue</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Subject</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Brief summary"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            className="select select-bordered"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="bug">Bug</option>
            <option value="feedback">Feedback</option>
            <option value="request">Feature request</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered min-h-[8rem]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Steps to reproduce, expected vs actual, screenshots (paste links), etc."
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {result && (
          <div className={result.ok ? "text-success" : "text-error"}>{result.message}</div>
        )}
      </form>
    </div>
  );
}
