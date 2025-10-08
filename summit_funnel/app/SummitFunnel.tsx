/opt/homebrew/bin/node
./app/SummitFunnel.tsx
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";

type LeadFields = {
  name: string;
  email: string;
  phone: string;
  currentIncome: string;
  targetIncome: string;
  objection: string;
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
};

const initialFields: LeadFields = {
  name: "",
  email: "",
  phone: "",
  currentIncome: "",
  targetIncome: "",
  objection: "",
  source: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  referrer: "",
};

const visibleFieldConfig: Array<{ key: keyof LeadFields; label: string; placeholder: string; type?: string; required?: boolean }> = [
  { key: "name", label: "Full name", placeholder: "Jordan Lee", required: true },
  { key: "email", label: "Email", placeholder: "closer@summitinc.com", type: "email", required: true },
  { key: "phone", label: "Phone (optional)", placeholder: "(555) 123-4567" },
  { key: "source", label: "How did you hear about us?", placeholder: "Referral, podcast, ad..." },
  { key: "currentIncome", label: "Current monthly income", placeholder: "$8K" },
  { key: "targetIncome", label: "Target monthly income", placeholder: "$25K" },
];

const hiddenKeys: Array<keyof LeadFields> = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"];

export function SummitFunnel(): JSX.Element {
  const [fields, setFields] = useState<LeadFields>({ ...initialFields });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setFields((prev) => ({
      ...prev,
      utm_source: search.get("utm_source") ?? prev.utm_source,
      utm_medium: search.get("utm_medium") ?? prev.utm_medium,
      utm_campaign: search.get("utm_campaign") ?? prev.utm_campaign,
      utm_term: search.get("utm_term") ?? prev.utm_term,
      utm_content: search.get("utm_content") ?? prev.utm_content,
      referrer: document.referrer,
    }));
  }, []);

  const handleChange = (key: keyof LeadFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const override = typeof window !== "undefined" ? (window as { __SUMMIT_API__?: string }).__SUMMIT_API__ : undefined;
    const endpoint = override && override.trim().length > 0 ? override : "http://localhost:8000/api/lead";
    const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer } = fields;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ts: new Date().toISOString() }),
      });
      if (!response.ok) {
        throw new Error();
      }
      setFields({ ...initialFields, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row">
      <section className="w-full space-y-6 md:w-1/2">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
            <Sparkles className="h-4 w-4" /> Summit Inc.
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Stop Renting Your Income</h1>
          <p className="text-lg text-slate-600">
            Summit Inc. helps U.S.-based closers build unkillable pipelines with live coaching, battle-tested playbooks, and Day-1 outbound campaigns. Average first-year earnings: $100K+.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Apply for the 7-Day Pipeline Sprint</CardTitle>
            <CardDescription>Claim the roadmap, scripts, and done-for-you outbound built for hungry closers.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                {visibleFieldConfig.map(({ key, label, placeholder, type, required }) => (
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={key} key={key}>
                    <span>{label}</span>
                    <Input id={key} type={type ?? "text"} placeholder={placeholder} required={required} value={fields[key]} onChange={handleChange(key)} />
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="objection">
                <span>What’s in your way right now?</span>
                <Textarea id="objection" rows={4} placeholder="Break down the biggest obstacle keeping you from consistent appointments." value={fields.objection} onChange={handleChange("objection")} />
              </label>
              <div className="hidden">
                {hiddenKeys.map((key) => (
                  <input key={key} type="hidden" name={key} value={fields[key]} readOnly />
                ))}
              </div>
              {status === "error" && <p className="text-sm text-red-600">Submission failed. Try again.</p>}
              {status === "success" && <p className="text-sm font-semibold text-emerald-600">Got it. Check your email for next steps.</p>}
              <Button className="w-full" disabled={status === "loading"} type="submit">
                {status === "loading" ? "Submitting..." : "Get the Sprint Checklist"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
      <section className="w-full space-y-6 md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Proof you can bank on</CardTitle>
            <CardDescription>Real deals closed by Summit operators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-600">
            <p>Ryan Carroll went from sleeping in his car to earning $2.5M in commissions and driving $30M in new revenue in one year after our coaching.</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Day-1 outbound campaigns built for you while you train.</li>
              <li>Live deal reviews to sharpen your objections-to-appointments game.</li>
              <li>Battle-tested outreach frameworks the top 1% closers deploy daily.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What you get weekly</CardTitle>
            <CardDescription>Plug-and-play assets to stack commissions faster.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-slate-600">
              <li>7-Day Pipeline Sprint checklist.</li>
              <li>Objection-to-Appointment script map.</li>
              <li>Day-1 outreach templates (email, social, voicemail).</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
export default SummitFunnel;
