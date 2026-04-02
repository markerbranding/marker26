"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useLocale, useTranslations} from "next-intl";
import {z} from "zod";
import {toast} from "sonner";

type Props = {
  title?: string;
  className?: string;
  disableRedirect?: boolean;
  thankYouPath?: string; // sin locale, ej: "/thank-you"
};

type FieldErrors = Partial<Record<string, string>>;

export default function HubspotForm({
  title,
  className = "",
  disableRedirect = false,
  thankYouPath = "/thank-you"
}: Props) {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ContactForm");

  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID!;
  const formId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID!;

  // 💪 Validación fuerte con zod
  const schema = z.object({
    firstname: z
      .string()
      .min(2, t("errors.firstnameRequired"))   // ahora 1 letra ya NO pasa
      .max(60, t("errors.firstnameTooLong"))
      .trim(),
    lastname: z
      .string()
      .min(2, t("errors.lastnameRequired"))
      .max(60, t("errors.lastnameTooLong"))
      .trim(),
    phone: z
      .string()
      .min(7, t("errors.phoneRequired"))
      .max(20, t("errors.phoneTooLong"))
      .regex(/^[0-9+\-\s()]+$/, t("errors.phoneInvalid"))
      .trim(),
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailInvalid"))
      .trim(),
    city: z.string().optional(),
    company: z.string().optional(),
    service: z
      .string()
      .min(1, t("errors.serviceRequired")),
    message: z.string().optional()
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // 🕳️ Honeypot
    const honeypotValue = formData.get("website");
    if (typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
      setLoading(false);
      toast.success(t("successInline"));
      form.reset();
      return;
    }

    const values = {
      firstname: String(formData.get("firstname") ?? ""),
      lastname: String(formData.get("lastname") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      city: String(formData.get("city") ?? ""),
      company: String(formData.get("company") ?? ""),
      service: String(formData.get("service") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    // ✅ Validación
    const result = schema.safeParse(values);

    if (!result.success) {
      const zodErrors = result.error.flatten().fieldErrors;
      const newFieldErrors: FieldErrors = {};
      let firstMessage: string | undefined;

      Object.entries(zodErrors).forEach(([field, messages]) => {
        if (!messages || !messages.length) return;
        newFieldErrors[field] = messages[0];
        if (!firstMessage) firstMessage = messages[0];
      });

      setFieldErrors(newFieldErrors);

      if (firstMessage) {
        toast.error(firstMessage);
      } else {
        toast.error(t("errorGeneric"));
      }

      setLoading(false);
      return;
    }

    // Campos para HubSpot
    const fields = Object.entries(values).map(([name, value]) => ({
      name,
      value
    }));

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            submittedAt: Date.now(),
            fields
          })
        }
      );

      if (!response.ok) {
        throw new Error("HubSpot error");
      }

      form.reset();
      toast.success(t("successInline"));

      // ⏱ Pequeño delay para ver el toast antes de redirigir
      if (!disableRedirect) {
        const url = `/${locale}${thankYouPath}`;
        setTimeout(() => {
          router.push(url);
        }, 700);
      }
    } catch (err) {
      toast.error(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={`hubspot-form ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Título opcional
      {(title || t("title")) && <h3>{title ?? t("title")}</h3>}
      */}

      {/* Honeypot */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <label htmlFor="firstname">
        {t("firstnameLabel")} <span>*</span>
        <input
          id="firstname"
          name="firstname"
          aria-invalid={!!fieldErrors.firstname}
        />
        {fieldErrors.firstname && (
          <span className="field-error">{fieldErrors.firstname}</span>
        )}
      </label>

      <label htmlFor="lastname">
        {t("lastnameLabel")} <span>*</span>
        <input
          id="lastname"
          name="lastname"
          aria-invalid={!!fieldErrors.lastname}
        />
        {fieldErrors.lastname && (
          <span className="field-error">{fieldErrors.lastname}</span>
        )}
      </label>

      <label htmlFor="phone">
        {t("phoneLabel")} <span>*</span>
        <input
          id="phone"
          name="phone"
          aria-invalid={!!fieldErrors.phone}
        />
        {fieldErrors.phone && (
          <span className="field-error">{fieldErrors.phone}</span>
        )}
      </label>

      <label htmlFor="email">
        {t("emailLabel")} <span>*</span>
        <input
          id="email"
          type="email"
          name="email"
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <span className="field-error">{fieldErrors.email}</span>
        )}
      </label>

      <label htmlFor="city">
        {t("cityLabel")}
        <input id="city" name="city" />
      </label>

      <label htmlFor="company">
        {t("companyLabel")}
        <input id="company" name="company" />
      </label>

      <label htmlFor="service">
        {t("serviceLabel")} <span>*</span>
        <select
          id="service"
          name="service"
          defaultValue=""
          aria-invalid={!!fieldErrors.service}
        >
          <option value="" disabled>
            {t("servicePlaceholder")}
          </option>
          <option value="branding">{t("serviceBranding")}</option>
          <option value="web">{t("serviceWeb")}</option>
          <option value="ads">{t("serviceAds")}</option>
          <option value="strategy">{t("serviceStrategy")}</option>
        </select>
        {fieldErrors.service && (
          <span className="field-error">{fieldErrors.service}</span>
        )}
      </label>

      <label htmlFor="message">
        {t("messageLabel")}
        <textarea id="message" name="message" rows={4} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? t("submitLoading") : t("submit")}
      </button>

      {/* Región aria para lectores de pantalla */}
      <div
        aria-live="polite"
        style={{minHeight: "1.5em", position: "absolute", left: "-9999px"}}
      />
    </form>
  );
}