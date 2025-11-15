import { Input } from "~/components/ui/input";

interface GlossarySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  showResults: boolean;
}

export function GlossarySearch({
  searchQuery,
  onSearchChange,
  resultCount,
  showResults,
}: GlossarySearchProps) {
  return (
    <div className="w-full max-w-2xl">
      <Input
        type="text"
        placeholder="Search by code, description, or category..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      {showResults && (
        <p className="text-sm text-gray-500 mt-2">
          Found {resultCount} item{resultCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

