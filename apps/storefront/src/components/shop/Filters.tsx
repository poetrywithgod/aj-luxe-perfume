import Link from "next/link";

const GENDERS = ["Men", "Women", "Children", "Unisex"] as const;

type FiltersProps = {
  basePath: string;
  activeGenders: string[];
  counts: Record<string, number>;
};

function toggleParam(
  current: string[],
  value: string,
  isSelected: boolean,
): string[] {
  return isSelected ? current.filter((v) => v !== value) : [...current, value];
}

export function Filters({ basePath, activeGenders, counts }: FiltersProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-charcoal/8 p-5">
        <h2 className="font-display text-lg font-semibold text-aubergine mb-4">
          Filters
        </h2>

        <fieldset>
          <legend className="text-sm font-semibold text-charcoal mb-3">
            Category
          </legend>
          <ul className="space-y-2.5">
            {GENDERS.map((gender) => {
              const isSelected = activeGenders.includes(gender);
              const nextGenders = toggleParam(
                activeGenders,
                gender,
                isSelected,
              );
              const query = new URLSearchParams();
              nextGenders.forEach((g) => query.append("gender", g));
              const href = query.toString()
                ? `${basePath}?${query.toString()}`
                : basePath;

              return (
                <li key={gender}>
                  <Link
                    href={href}
                    className="flex items-center justify-between text-sm text-charcoal hover:text-aubergine transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? "bg-aubergine border-aubergine"
                            : "border-charcoal/30"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                        )}
                      </span>
                      For {gender}
                    </span>
                    <span className="text-charcoal-soft text-xs">
                      {counts[gender] ?? 0}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {activeGenders.length > 0 && (
          <Link
            href={basePath}
            className="inline-block mt-5 text-xs font-medium text-magenta hover:text-magenta-light transition-colors"
          >
            Clear filters
          </Link>
        )}
      </div>
    </aside>
  );
}
