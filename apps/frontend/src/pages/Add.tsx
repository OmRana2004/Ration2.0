import { useEffect, useRef, useState } from "react";
import {
  User,
  Users,
  CreditCard,
  Plus,
  Trash2
} from "lucide-react";

type Entry = {
  id: number;
  name: string;
  unit: number;
  cardType: string;
  createdAt: string;
};

const API_URL = "http://localhost:3001";

export default function Add() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [cardType, setCardType] = useState("AAY");

  const [entries, setEntries] = useState<Entry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const unitRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLSelectElement>(null);

  // --------------------------------
  // GET ENTRIES
  // --------------------------------
  const fetchData = async () => {
    try {
      let res = await fetch(
        `${API_URL}/api/v1/entries`
      );

      // Retry once if request fails
      if (!res.ok) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        res = await fetch(
          `${API_URL}/api/v1/entries`
        );
      }

      if (!res.ok) {
        throw new Error("Failed to fetch entries");
      }

      const result = await res.json();

      // Supports both:
      // { data: [...] }
      // and
      // [...]
      const data: Entry[] = result.data ?? result;

      setEntries(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // --------------------------------
  // INITIAL LOAD
  // --------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  // --------------------------------
  // ADD ENTRY
  // --------------------------------
  const handleAdd = async () => {
    if (!name.trim() || !unit) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      let res = await fetch(
        `${API_URL}/api/v1/entries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            unit: Number(unit),
            cardType,
          }),
        }
      );

      // Retry once if DB/API fails
      if (!res.ok) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        res = await fetch(
          `${API_URL}/api/v1/entries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.trim(),
              unit: Number(unit),
              cardType,
            }),
          }
        );
      }

      if (!res.ok) {
        throw new Error("Failed to add entry");
      }

      // Clear form after successful add
      setName("");
      setUnit("");

      // Refresh list
      await fetchData();

    } catch (error) {
      console.error("Add error:", error);

      // Only show popup on error
      alert("❌ Failed to add. Please try again");

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // DELETE ALL
  // --------------------------------
  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Delete ALL entries?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/api/v1/entries`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setEntries([]);
      setShowAll(false);

    } catch (error) {
      console.error("Delete all error:", error);

      alert("❌ Failed to delete");

    }
  };

  const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this entry?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `${API_URL}/api/v1/entries/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // Remove deleted entry immediately from UI
    setEntries((prev) =>
      prev.filter((entry) => entry.id !== id)
    );

  } catch (error) {
    console.error("Delete error:", error);
    alert("❌ Failed to delete entry");
  }
};

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4">

      <div className="max-w-md mx-auto">

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">

            <div className="bg-blue-500 p-3 rounded-xl text-white">
              <Plus size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                Add Person
              </h1>

              <p className="text-sm text-gray-400">
                Enter ration details
              </p>
            </div>

          </div>

          {/* NAME */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-10 mb-2">

            <User
              size={16}
              className="text-gray-400 mr-2"
            />

            <input
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  unitRef.current?.focus();
                }
              }}
              className="w-full bg-transparent outline-none text-sm"
            />

          </div>

          {/* UNIT */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-10 mb-2">

            <Users
              size={16}
              className="text-gray-400 mr-2"
            />

            <input
  ref={unitRef}
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="Enter units"
  value={unit}
  onChange={(e) => {
    const value = e.target.value;

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setUnit(value);
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      cardRef.current?.focus();
    }
  }}
  className="w-full bg-transparent outline-none text-sm"
/>

          </div>

          {/* CARD TYPE */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-11 mb-3">

            <CreditCard
              size={16}
              className="text-gray-400 mr-2"
            />

            <select
              ref={cardRef}
              value={cardType}
              onChange={(e) =>
                setCardType(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="w-full bg-transparent outline-none text-sm"
            >
              <option value="AAY">AAY</option>
              <option value="SFY">SFY</option>
              <option value="PHH">PHH</option>
            </select>

          </div>

          {/* ADD BUTTON */}
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-1.5 rounded-xl font-medium disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Adding..." : "Add Person"}
          </button>

        </div>

        {/* PEOPLE LIST */}
        <div className="bg-white rounded-2xl shadow-md p-3">

          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            Recent Entries
          </h2>

          {entries.length === 0 ? (

            <p className="text-gray-400 text-sm">
              No data yet
            </p>

          ) : (

            <>

              {(showAll
                ? entries
                : entries.slice(0, 10)
              ).map((entry, index) => (

                <div
  key={entry.id}
  className="flex justify-between items-center py-1.5 border-b last:border-none"
>
  <p className="text-sm text-gray-800 truncate pr-2">
    {index + 1}. {entry.name}
  </p>

  <div className="flex items-center gap-2 shrink-0">
    <p className="text-sm text-gray-500">
      {entry.unit} ({entry.cardType})
    </p>

    <button
      onClick={() => handleDelete(entry.id)}
      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 active:scale-95 transition"
      title="Delete"
    >
      <Trash2 size={15} />
    </button>
  </div>
</div>

              ))}

              {/* VIEW ALL */}
              {entries.length > 10 && (

                <button
                  onClick={() =>
                    setShowAll(!showAll)
                  }
                  className="w-full mt-3 text-blue-500 text-sm font-medium"
                >
                  {showAll
                    ? "Show Less ▲"
                    : "View All ▼"}
                </button>

              )}

            </>

          )}

        </div>

        {/* DELETE ALL */}
        <button
          onClick={handleDeleteAll}
          disabled={entries.length === 0}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition disabled:opacity-50 cursor-pointer"
        >
          Delete All Entries
        </button>

      </div>

    </div>
  );
}