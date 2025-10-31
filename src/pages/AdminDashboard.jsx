import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const defaultCar = {
  id: "2019-fiat-500",
  make: "Fiat",
  model: "500",
  logo: "https://framerusercontent.com/images/ELPJflVOVAUOOEqZmPzcyDYmo.png",
  year: 2019,
  overview:
    "A turbocharged 1.4-liter four-cylinder is now the sole engine available; the car isn't lightning-quick, but its 135 ponies scoot it around town just fine. The last time we tested a 500 with this engine was in 2013 and it delivered a zero-to-60-mph time of 8.1 seconds. A six-speed automatic is optional, but those who prefer to shift for themselves can stay with the standard five-speed manual.\n \nDespite Fiat's claim that the 500's suspension is sport tuned, there's not much athleticism in this chassis. But no one buys a Fiat 500 for the performance—well, maybe those interested in the hot Abarth model do—as the diminutive city car is more of a fashion accessory.",
  body_type: "Hatchback",
  seats: 2,
  fuel_consumption: "12-18 mpg",
  engine: {
    type: "4-Cylinder",
    displacement: "1.4L",
    configuration: "I4 8V GDI",
    power_hp: 135,
  },
  transmission: "Automatic",
  drivetrain: "FWD",
  fuel_type: "Gasoline",
  colors: {
    exterior: "#CFCFCF",
    interior: "#EBEBEB",
  },
  primary_features: [
    "17-inch aluminum wheels",
    "LED headlights",
    "Rain-sensing windshield wipers",
    "Push-button start",
    "Forward collision warning",
    "Lane departure warning",
    "Front and rear parking sensors",
  ],
  additional_features: [
    "Keyless access",
    "Power moonroof",
    "Heated front seats",
    "Heated steering wheel",
    "Wireless device charging",
    "Harman Kardon stereo",
  ],
  images: {
    main: "https://framerusercontent.com/images/piP6vECWdDgFFQpiFmHNyzvDO0g.jpg",
    sub1: "https://framerusercontent.com/images/HGsi7BjXwHAYVf11AvwOHYzJo8.jpeg",
    sub2: "https://framerusercontent.com/images/TqNxJmgl4C80Quso07lFuYMNss.jpeg",
    sub3: "https://framerusercontent.com/images/OC9tPNJKsDOrahAT6eBrLVwiQA.jpeg",
    sub4: "https://framerusercontent.com/images/VE6hCt4PNz94ntTDfTX3bPRU2s.jpeg",
  },
  price_per_day: 19,
  currency: "USD",
  rental_conditions:
    "Renting a sports car also allows you to explore Dubai in a way that you never thought was possible. You can take a leisurely drive along the stunning coastline of Dubai, take a scenic route through the desert or simply enjoy the breathtaking views of the city. No matter where you go, a sports car rental in Dubai will always make your journey a memorable one.",
  rental_class: "Economy",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(defaultCar);
  const [msg, setMsg] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // fetch all cars (only when user is present)
    const fetchItems = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:3000/api/items/allItems", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) throw new Error("Failed to load items");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setMsg({ type: "error", text: err.message });
      }
    };
    fetchItems();
  }, [user]);

  if (!user || user.role !== "admin") {
    navigate("/signin");
    return null;
  }

  const refreshItems = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/items/allItems", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: err.message });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      // required fields
      if (
        !car ||
        !car.id ||
        !car.make ||
        !car.model ||
        car.price_per_day === undefined ||
        car.price_per_day === null
      ) {
        throw new Error("Please provide id, make, model and price_per_day");
      }

      // Prepare payload: convert comma-separated features to arrays
      const payload = {
        ...car,
        primary_features:
          typeof car.primary_features === "string"
            ? car.primary_features
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : car.primary_features || [],
        additional_features:
          typeof car.additional_features === "string"
            ? car.additional_features
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : car.additional_features || [],
      };

      const method = selectedId ? "PUT" : "POST";
      const url = selectedId
        ? `http://localhost:3000/api/items/${encodeURIComponent(selectedId)}`
        : "http://localhost:3000/api/items";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save car");

      setMsg({
        type: "success",
        text: selectedId ? "Car updated" : "Car added",
      });
      setSelectedId(null);
      setCar(defaultCar);
      await refreshItems();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setCar({
      ...item,
      primary_features: Array.isArray(item.primary_features)
        ? item.primary_features.join(", ")
        : item.primary_features || "",
      additional_features: Array.isArray(item.additional_features)
        ? item.additional_features.join(", ")
        : item.additional_features || "",
    });
    setMsg(null);
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Delete this car?")) return;
    setMsg(null);
    try {
      const res = await fetch(
        `http://localhost:3000/api/items/${encodeURIComponent(itemId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete car");
      setMsg({ type: "success", text: "Car deleted" });
      // clear selection if it was the deleted one
      if (selectedId === itemId) {
        setSelectedId(null);
        setCar(defaultCar);
      }
      await refreshItems();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-4">
        Signed in as <strong>{user.email}</strong>
      </p>

      {msg && (
        <div
          className={
            msg.type === "error" ? "text-red-600 mb-4" : "text-green-600 mb-4"
          }
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="mb-2 font-medium">All Cars ({items.length})</div>
          <div className="space-y-2 max-h-[70vh] overflow-auto">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-2 border rounded flex items-center justify-between"
              >
                <div className="text-sm">
                  <div className="font-semibold">
                    {it.make} {it.model}{" "}
                    <span className="text-xs text-gray-500">
                      ({it.year || "--"})
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{it.id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect(it)}
                    className="px-2 py-1 bg-yellow-400 text-xs rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setSelectedId(null);
                setCar(defaultCar);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              New Car
            </button>
          </div>
        </div>

        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">ID</label>
                  <input
                    value={car.id || ""}
                    onChange={(e) => setCar({ ...car, id: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Make</label>
                  <input
                    value={car.make || ""}
                    onChange={(e) => setCar({ ...car, make: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Model</label>
                  <input
                    value={car.model || ""}
                    onChange={(e) => setCar({ ...car, model: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Logo URL</label>
                  <input
                    value={car.logo || ""}
                    onChange={(e) => setCar({ ...car, logo: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Year</label>
                  <input
                    type="number"
                    value={car.year || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        year: e.target.value ? parseInt(e.target.value) : "",
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Body type</label>
                  <input
                    value={car.body_type || ""}
                    onChange={(e) =>
                      setCar({ ...car, body_type: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Seats</label>
                  <input
                    type="number"
                    value={car.seats || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        seats: e.target.value ? parseInt(e.target.value) : "",
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Fuel consumption
                  </label>
                  <input
                    value={car.fuel_consumption || ""}
                    onChange={(e) =>
                      setCar({ ...car, fuel_consumption: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium">Overview</label>
                <textarea
                  value={car.overview || ""}
                  onChange={(e) => setCar({ ...car, overview: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium">
                    Transmission
                  </label>
                  <input
                    value={car.transmission || ""}
                    onChange={(e) =>
                      setCar({ ...car, transmission: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Drivetrain
                  </label>
                  <input
                    value={car.drivetrain || ""}
                    onChange={(e) =>
                      setCar({ ...car, drivetrain: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Fuel type</label>
                  <input
                    value={car.fuel_type || ""}
                    onChange={(e) =>
                      setCar({ ...car, fuel_type: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Price per day
                  </label>
                  <input
                    type="number"
                    value={car.price_per_day || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        price_per_day: e.target.value
                          ? parseFloat(e.target.value)
                          : "",
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Currency</label>
                  <input
                    value={car.currency || ""}
                    onChange={(e) =>
                      setCar({ ...car, currency: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Rental class
                  </label>
                  <input
                    value={car.rental_class || ""}
                    onChange={(e) =>
                      setCar({ ...car, rental_class: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Engine type
                  </label>
                  <input
                    value={(car.engine && car.engine.type) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        engine: { ...(car.engine || {}), type: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Engine displacement
                  </label>
                  <input
                    value={(car.engine && car.engine.displacement) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        engine: {
                          ...(car.engine || {}),
                          displacement: e.target.value,
                        },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Engine configuration
                  </label>
                  <input
                    value={(car.engine && car.engine.configuration) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        engine: {
                          ...(car.engine || {}),
                          configuration: e.target.value,
                        },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Engine power (hp)
                  </label>
                  <input
                    type="number"
                    value={(car.engine && car.engine.power_hp) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        engine: {
                          ...(car.engine || {}),
                          power_hp: e.target.value
                            ? parseInt(e.target.value)
                            : "",
                        },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Color exterior (hex)
                  </label>
                  <input
                    value={(car.colors && car.colors.exterior) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        colors: {
                          ...(car.colors || {}),
                          exterior: e.target.value,
                        },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Color interior (hex)
                  </label>
                  <input
                    value={(car.colors && car.colors.interior) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        colors: {
                          ...(car.colors || {}),
                          interior: e.target.value,
                        },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Primary features (comma separated)
                  </label>
                  <input
                    value={car.primary_features || ""}
                    onChange={(e) =>
                      setCar({ ...car, primary_features: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Additional features (comma separated)
                  </label>
                  <input
                    value={car.additional_features || ""}
                    onChange={(e) =>
                      setCar({ ...car, additional_features: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Image - main
                  </label>
                  <input
                    value={(car.images && car.images.main) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        images: { ...(car.images || {}), main: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Image - sub1
                  </label>
                  <input
                    value={(car.images && car.images.sub1) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        images: { ...(car.images || {}), sub1: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Image - sub2
                  </label>
                  <input
                    value={(car.images && car.images.sub2) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        images: { ...(car.images || {}), sub2: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Image - sub3
                  </label>
                  <input
                    value={(car.images && car.images.sub3) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        images: { ...(car.images || {}), sub3: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Image - sub4
                  </label>
                  <input
                    value={(car.images && car.images.sub4) || ""}
                    onChange={(e) =>
                      setCar({
                        ...car,
                        images: { ...(car.images || {}), sub4: e.target.value },
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium">
                  Rental conditions
                </label>
                <textarea
                  value={car.rental_conditions || ""}
                  onChange={(e) =>
                    setCar({ ...car, rental_conditions: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {selectedId ? "Save Changes" : "Add Car"}
              </button>
              <button
                type="button"
                onClick={() => setCar(defaultCar)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Reset Defaults
              </button>
              {selectedId && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null);
                    setCar(defaultCar);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
