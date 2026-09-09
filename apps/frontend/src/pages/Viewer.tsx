import { useEffect, useMemo, useState } from "react";
import {
  RefreshCcw,
  Users,
  Box,
  CreditCard,
  Search,
  Pencil,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

type Entry = {
  id: number;
  name: string;
  unit: number;
  cardType: string;
  createdAt: string;
};

const API_URL = "http://localhost:3001";

export default function Viewer() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filtered, setFiltered] = useState<Entry[]>([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const [totalPeople, setTotalPeople] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const [spin, setSpin] = useState(false);

  // EDIT STATE
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editName, setEditName] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editCardType, setEditCardType] = useState("AAY");

  // --------------------------------
  // UPDATE STATES
  // --------------------------------
  const updateState = (data: Entry[]) => {
    setEntries(data);
    setFiltered(data);

    setTotalPeople(data.length);

    const units = data.reduce(
      (sum, item) => sum + Number(item.unit),
      0
    );

    setTotalUnits(units);
  };

  // --------------------------------
  // GET ENTRIES
  // --------------------------------
  const fetchData = async () => {
    try {
      setSpin(true);

      let url = `${API_URL}/api/v1/entries`;

      if (from && to) {
        url += `?from=${from}&to=${to}`;
      }

      let res = await fetch(url, {
        cache: "no-store",
      });

      // Retry once
      if (!res.ok) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        res = await fetch(url, {
          cache: "no-store",
        });
      }

      if (!res.ok) {
        throw new Error("Failed to fetch entries");
      }

      const result = await res.json();

      const data: Entry[] = result.data ?? result;

      updateState(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setTimeout(() => {
        setSpin(false);
      }, 800);
    }
  };

  // --------------------------------
  // INITIAL LOAD + AUTO REFRESH
  // --------------------------------
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [from, to]);

  // --------------------------------
  // SEARCH
  // --------------------------------
  useEffect(() => {
    const searchValue = search.toLowerCase();

    const filteredData = entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchValue) ||
        entry.cardType.toLowerCase().includes(searchValue)
    );

    setFiltered(filteredData);
  }, [search, entries]);

  // --------------------------------
  // CARD TYPE COUNT
  // --------------------------------
  const cardTypesCount = useMemo(() => {
    const types = new Set(
      entries.map((entry) => entry.cardType)
    );

    return types.size;
  }, [entries]);

  // --------------------------------
  // OPEN EDIT
  // --------------------------------
  const handleEditClick = (entry: Entry) => {
    setEditingEntry(entry);

    setEditName(entry.name);
    setEditUnit(String(entry.unit));
    setEditCardType(entry.cardType);
  };

  // --------------------------------
  // UPDATE ENTRY
  // --------------------------------
  const handleUpdate = async () => {
    if (!editingEntry) return;

    if (!editName || !editUnit) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/v1/entries/${editingEntry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            unit: Number(editUnit),
            cardType: editCardType,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      // Close edit modal
      setEditingEntry(null);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to update entry");
    }
  };


  return (
    <div className="min-h-screen bg-[#f6f8fb] p-3 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">

        <div className="flex items-center gap-3">

         <Link to="/add">
  <div className="bg-green-500 p-3 rounded-2xl text-white shadow cursor-pointer transition active:scale-95 hover:scale-105">
    <Box size={20} />
  </div>
</Link>

          <div>
            <h1 className="text-lg font-semibold">
              Ration Distribution
            </h1>

            <p className="text-sm text-gray-400">
              Live tracking system
            </p>
          </div>

        </div>

        <button
          onClick={fetchData}
          className="text-gray-400 hover:text-black"
        >
          <RefreshCcw
            size={20}
            className={spin ? "animate-spin" : ""}
          />
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-6">

        <div className="bg-blue-100 rounded-2xl p-5 text-center shadow">
          <Users
            className="mx-auto mb-2 text-blue-600"
            size={18}
          />

          <p className="text-xl sm:text-2xl font-bold">
            {totalPeople}
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            People
          </p>
        </div>

        <div className="bg-green-100 rounded-2xl p-5 text-center shadow">
          <Box
            className="mx-auto mb-2 text-green-600"
            size={18}
          />

          <p className="text-xl sm:text-2xl font-bold">
            {totalUnits}
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            Units
          </p>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5 text-center shadow">
          <CreditCard
            className="mx-auto mb-2 text-yellow-600"
            size={18}
          />

          <p className="text-xl sm:text-2xl font-bold">
            {cardTypesCount}
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            Card Types
          </p>
        </div>

      </div>

      {/* SEARCH + DATE */}
      <div className="flex gap-2 mb-6 flex-wrap">

        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow w-full sm:min-w-[40%]">

          <Search
            size={16}
            className="text-gray-400 mr-2"
          />

          <input
            placeholder="Search name or card type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full outline-none text-sm"
          />

        </div>

        {/* FROM */}
        <div className="relative w-[48%] sm:w-[30%]">

          {!from && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              From date
            </span>
          )}

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            className="bg-white rounded-xl px-2 h-11 shadow text-sm w-full"
          />

        </div>

        {/* TO */}
        <div className="relative w-[48%] sm:w-[30%]">

          {!to && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              To date
            </span>
          )}

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            className="bg-white rounded-xl px-2 h-11 shadow text-sm w-full"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-[30px_1fr_70px_90px_70px] px-6 py-4 text-xs sm:text-sm text-gray-600 font-semibold bg-gray-200">

          <p>#</p>

          <p>NAME</p>

          <p className="text-center">
            UNITS
          </p>

          <p className="text-center">
            CARD TYPE
          </p>

          <p className="text-center">
            ACTION
          </p>

        </div>

        {/* ROWS */}
        {filtered.map((entry, index) => (

          <div
            key={entry.id}
            className={`grid grid-cols-[30px_1fr_70px_90px_70px] px-6 py-2 items-center border-t border-gray-200 ${
              index % 2 === 0
                ? "bg-white"
                : "bg-gray-50"
            }`}
          >

            {/* NUMBER */}
            <p className="text-gray-400 text-xs sm:text-sm">
              {index + 1}
            </p>

            {/* NAME */}
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {entry.name}
            </p>

            {/* UNIT */}
            <div className="flex justify-center">

              <span className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-50 rounded-full text-red-500 text-xs sm:text-sm font-medium">
                {entry.unit}
              </span>

            </div>

            {/* CARD TYPE */}
            <div className="flex justify-center">

              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                  entry.cardType === "AAY"
                    ? "bg-yellow-100 text-yellow-600"
                    : entry.cardType === "PHH"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {entry.cardType}
              </span>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-center gap-1">

              {/* EDIT */}
              <button
                onClick={() =>
                  handleEditClick(entry)
                }
                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 active:scale-95 transition"
                title="Edit"
              >
                <Pencil size={15} />
              </button>

            </div>

          </div>

        ))}

        {/* TOTAL */}
        <div className="grid grid-cols-[30px_1fr_70px_90px_70px] px-6 py-4 items-center border-t border-gray-300 bg-gray-200 font-bold text-xs sm:text-sm">

          <p></p>

          <p>
            Total Ration Distribution
          </p>

          <div className="text-center text-gray-800">
            {filtered.length} People
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 text-xs sm:text-sm text-gray-400 border-t border-gray-200 gap-2">

          <p>
            Showing {filtered.length} of{" "}
            {entries.length} records
          </p>

          <p className="text-green-500 flex items-center gap-2">

            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

            Auto-refreshing

          </p>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* EDIT MODAL */}
      {/* -------------------------------- */}

      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Edit Person
                </h2>

                <p className="text-sm text-gray-400">
                  Update ration details
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingEntry(null)
                }
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>

            </div>

            {/* NAME */}
            <input
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              placeholder="Name"
              className="w-full h-11 px-4 bg-gray-50 rounded-xl outline-none mb-3"
            />

            {/* UNIT */}
            <input
              type="number"
              value={editUnit}
              onChange={(e) =>
                setEditUnit(e.target.value)
              }
              placeholder="Units"
              className="w-full h-11 px-4 bg-gray-50 rounded-xl outline-none mb-3"
            />

            {/* CARD TYPE */}
            <select
              value={editCardType}
              onChange={(e) =>
                setEditCardType(e.target.value)
              }
              className="w-full h-11 px-4 bg-gray-50 rounded-xl outline-none mb-5"
            >
              <option value="AAY">AAY</option>
              <option value="SYF">SYF</option>
              <option value="PHH">PHH</option>
            </select>

            {/* BUTTONS */}
            <div className="flex gap-2">

              <button
                onClick={() =>
                  setEditingEntry(null)
                }
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                Update
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}