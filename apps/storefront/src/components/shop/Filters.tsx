import Link from "next/link";
import { ChevronDown } from "lucide-react";

const GENDERS = ["Men", "Women", "Children", "Unisex"] as const;

export type FacetOption = { value: string; label: string; count: number };

type FiltersProps = {
  basePath: string;
  activeGenders: string[];
  genderCounts: Record<string, number>;
  activeScents: string[];
  scentOptions: FacetOption[];
  activePriceBuckets: string[];
  priceOptions: FacetOption[];
  activeBrands: string[];
  brandOptions: FacetOption[];
};

function toggle(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

function hrefFor(
  basePath: string,
  params: Record<string, string[]>,
): string {
  const query = new URLSearchParams();
  for (const [key, values] of Object.entries(params)) {
    values.forEach((v) => query.append(key, v));
  }
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function CheckboxRow({
  href,
  isSelected,
  label,
  count,
}: {
  href: string;
  isSelected: boolean;
  label: string;
  count: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between text-sm text-charcoal hover:text-aubergine transition-colors"
      >
        <span className="flex items-center gap-2">
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              isSelected ? "bg-aubergine border-aubergine" : "border-charcoal/30"
            }`}
            aria-hidden="true"
          >
            {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
          </span>
          {label}
        </span>
        <span className="text-charcoal-soft text-xs">{count}</span>
      </Link>
    </li>
  );
}

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className="border-t border-charcoal/8 first:border-t-0 py-4 group"
      open={defaultOpen}
    >
      <summary className="flex items-center justify-between cursor-pointer select-none list-none text-sm font-semibold text-charcoal">
        {title}
        <ChevronDown
          size={16}
          className="text-charcoal-soft transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export function Filters({
  basePath,
  activeGenders,
  genderCounts,
  activeScents,
  scentOptions,
  activePriceBuckets,
  priceOptions,
  activeBrands,
  brandOptions,
}: FiltersProps) {
  const anyActive =
    activeGenders.length > 0 ||
    activeScents.length > 0 ||
    activePriceBuckets.length > 0 ||
    activeBrands.length > 0;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-charcoal/8 px-5">
        <h2 className="font-display text-lg font-semibold text-aubergine pt-5 pb-1">
          Filters
        </h2>

        <Section title="Category">
          <ul className="space-y-2.5">
            {GENDERS.map((gender) => {
              const isSelected = activeGenders.includes(gender);
              return (
                <CheckboxRow
                  key={gender}
                  href={hrefFor(basePath, {
                    gender: toggle(activeGenders, gender),
                    scent: activeScents,
                    price: activePriceBuckets,
                    brand: activeBrands,
                  })}
                  isSelected={isSelected}
                  label={`For ${gender}`}
                  count={genderCounts[gender] ?? 0}
                />
              );
            })}
          </ul>
        </Section>

        <Section title="Scent Profile">
          {scentOptions.length === 0 ? (
            <p className="text-xs text-charcoal-soft">
              Scent profiles coming soon.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {scentOptions.map((opt) => (
                <CheckboxRow
                  key={opt.value}
                  href={hrefFor(basePath, {
                    gender: activeGenders,
                    scent: toggle(activeScents, opt.value),
                    price: activePriceBuckets,
                    brand: activeBrands,
                  })}
                  isSelected={activeScents.includes(opt.value)}
                  label={opt.label}
                  count={opt.count}
                />
              ))}
            </ul>
          )}
        </Section>

        <Section title="Price">
          <ul className="space-y-2.5">
            {priceOptions.map((opt) => (
              <CheckboxRow
                key={opt.value}
                href={hrefFor(basePath, {
                  gender: activeGenders,
                  scent: activeScents,
                  price: toggle(activePriceBuckets, opt.value),
                  brand: activeBrands,
                })}
                isSelected={activePriceBuckets.includes(opt.value)}
                label={opt.label}
                count={opt.count}
              />
            ))}
          </ul>
        </Section>

        <Section title="Brand">
          {brandOptions.length === 0 ? (
            <p className="text-xs text-charcoal-soft">No brands yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {brandOptions.map((opt) => (
                <CheckboxRow
                  key={opt.value}
                  href={hrefFor(basePath, {
                    gender: activeGenders,
                    scent: activeScents,
                    price: activePriceBuckets,
                    brand: toggle(activeBrands, opt.value),
                  })}
                  isSelected={activeBrands.includes(opt.value)}
                  label={opt.label}
                  count={opt.count}
                />
              ))}
            </ul>
          )}
        </Section>

        {anyActive && (
          <div className="pb-5 pt-1">
            <Link
              href={basePath}
              className="inline-block text-xs font-medium text-magenta hover:text-magenta-light transition-colors"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
