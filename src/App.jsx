import React, { useState, useEffect } from "react";

// คีย์สำหรับเก็บข้อมูลใน Local Storage
const STORAGE_KEY = "effort_tracker_data_v1";

// ฟังก์ชันช่วยจัดการวันที่แบบ Local (YYYY-MM-DD) เพื่อป้องกันปัญหา Timezone
const toLocalYYYYMMDD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// --- สไตล์สีและค่าคงที่ ---
const COLORS = {
  primary: "#4f46e5",
  primaryHover: "#4338ca",
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  textLight: "#64748b",
  border: "#f1f5f9",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#facc15",
  statsBg: "#1e1b4b",
};

// --- ไอคอน SVG ---
const IconTrophy = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f59e0b"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const IconChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const IconChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const IconFlame = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="2"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  </svg>
);
const IconHeart = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="2"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const IconBook = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="2"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M8 7h6" />
    <path d="M8 11h8" />
  </svg>
);
const IconStar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ color: COLORS.primary }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconSave = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(toLocalYYYYMMDD(new Date()));
  const [formData, setFormData] = useState({
    work: 10,
    exercise: 0,
    learning: 0,
    future: 0,
    bonusDiscipline: false,
    bonusNewThing: false,
    bonusSelfCare: false,
    note: "",
  });

  // โหลดข้อมูล
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLogs(parsed);
        const todayStr = toLocalYYYYMMDD(new Date());
        if (parsed[todayStr]) setFormData(parsed[todayStr]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const totalScore =
    (Number(formData.work) || 0) +
    (Number(formData.exercise) || 0) +
    (Number(formData.learning) || 0) +
    (Number(formData.future) || 0) +
    (formData.bonusDiscipline ? 5 : 0) +
    (formData.bonusNewThing ? 5 : 0) +
    (formData.bonusSelfCare ? 5 : 0);

  const save = () => {
    const newLogs = { ...logs, [selectedDate]: { ...formData, totalScore } };
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));

    const btn = document.getElementById("save-btn");
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerText = "บันทึกสำเร็จ! ✓";
      btn.style.background = COLORS.success;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = COLORS.primary;
      }, 2000);
    }
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    if (logs[dateStr]) setFormData(logs[dateStr]);
    else
      setFormData({
        work: 10,
        exercise: 0,
        learning: 0,
        future: 0,
        bonusDiscipline: false,
        bonusNewThing: false,
        bonusSelfCare: false,
        note: "",
      });
  };

  const getDayColor = (score) => {
    if (score === 0) return { bg: "#f8fafc", text: "#94a3b8" };
    if (score <= 45) return { bg: "#fee2e2", text: "#ef4444" }; // ปรับเป็น 10-45%
    if (score <= 70) return { bg: "#fef9c3", text: "#ca8a04" }; // ปรับเป็น 46-70%
    return { bg: "#dcfce7", text: "#16a34a" }; // 71-100%
  };

  const monthName = currentDate.toLocaleString("th-TH", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // --- Inline Styles ---
  const s = {
    app: {
      minHeight: "100vh",
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      justifyContent: "center",
    },
    container: {
      width: "100%",
      maxWidth: "1000px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      textAlign: "left",
    },
    card: {
      background: COLORS.card,
      borderRadius: "24px",
      padding: "30px",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      textAlign: "left",
    },
    gridMain: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "25px",
    },
    gridCal: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "8px",
    },
    dayBtn: (dateStr, score) => {
      const style = getDayColor(score);
      const isSelected = selectedDate === dateStr;
      return {
        aspectRatio: "1",
        borderRadius: "14px",
        border: isSelected
          ? `2px solid ${COLORS.primary}`
          : "2px solid transparent",
        backgroundColor: style.bg,
        color: style.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "0.2s",
        position: "relative",
        transform: isSelected ? "scale(1.05)" : "none",
        boxShadow: isSelected ? "0 0 15px rgba(79,70,229,0.2)" : "none",
      };
    },
    inputRange: {
      width: "100%",
      height: "8px",
      background: "#f1f5f9",
      borderRadius: "10px",
      appearance: "none",
      cursor: "pointer",
      margin: "10px 0",
    },
    bonusItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px",
      border: `1px solid ${COLORS.border}`,
      borderRadius: "16px",
      marginBottom: "8px",
      cursor: "pointer",
      fontSize: "14px",
    },
    saveBtn: {
      width: "100%",
      padding: "18px",
      background: COLORS.primary,
      color: "white",
      border: "none",
      borderRadius: "18px",
      fontWeight: "800",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "0.3s",
      marginTop: "10px",
    },
  };

  return (
    <div style={s.app}>
      <div style={s.container}>
        {/* Header */}
        <header style={s.header}>
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "900",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <IconTrophy /> My Full Effort
            </h1>
            <p
              style={{
                color: COLORS.textLight,
                fontSize: "15px",
                marginTop: "5px",
              }}
            >
              ทำให้เต็มที่ในทุกวัน เพื่อมองย้อนกลับมาอย่างภูมิใจ
            </p>
          </div>
          <div
            style={{
              background: "white",
              padding: "15px 25px",
              borderRadius: "20px",
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                borderRight: `2px solid ${COLORS.border}`,
                paddingRight: "15px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: COLORS.textLight,
                  fontWeight: "bold",
                }}
              >
                วันนี้
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "900",
                  color: COLORS.primary,
                }}
              >
                {logs[toLocalYYYYMMDD(new Date())]?.totalScore || 0}%
              </div>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: COLORS.danger,
                }}
                title="10-45%"
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: COLORS.warning,
                }}
                title="46-70%"
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: COLORS.success,
                }}
                title="71-100%"
              ></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={s.gridMain}>
          {/* Calendar Card */}
          <div style={s.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <button
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                    ),
                  )
                }
              >
                <IconChevronLeft />
              </button>
              <h2 style={{ fontSize: "22px", fontWeight: "900", margin: 0 }}>
                {monthName}
              </h2>
              <button
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                    ),
                  )
                }
              >
                <IconChevronRight />
              </button>
            </div>
            <div style={s.gridCal}>
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: COLORS.textLight,
                    padding: "10px 0",
                  }}
                >
                  {d}
                </div>
              ))}
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`}></div>;
                const dStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const score = logs[dStr]?.totalScore || 0;
                return (
                  <button
                    key={i}
                    onClick={() => handleDateClick(dStr)}
                    style={s.dayBtn(dStr, score)}
                  >
                    {day}
                    {score > 0 && (
                      <span style={{ fontSize: "9px", fontWeight: 900 }}>
                        {score}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={s.card}>
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "18px",
                  fontWeight: "900",
                  color: COLORS.primary,
                }}
              >
                วันที่{" "}
                {new Date(selectedDate).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                })}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {[
                  {
                    label: "งานประจำ / หน้าที่",
                    val: formData.work,
                    max: 40,
                    key: "work",
                    icon: <IconFlame />,
                  },
                  {
                    label: "ออกกำลังกาย",
                    val: formData.exercise,
                    max: 30,
                    key: "exercise",
                    icon: <IconHeart />,
                  },
                  {
                    label: "เรียนรู้สิ่งใหม่",
                    val: formData.learning,
                    max: 20,
                    key: "learning",
                    icon: <IconBook />,
                  },
                  {
                    label: "Portfolio / อนาคต",
                    val: formData.future,
                    max: 30,
                    key: "future",
                    icon: <IconTrophy />,
                  },
                ].map((item) => (
                  <div key={item.key}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        {item.icon} {item.label}
                      </span>
                      <span style={{ color: COLORS.primary }}>{item.val}%</span>
                    </div>
                    <input
                      style={s.inputRange}
                      type="range"
                      min="0"
                      max={item.max}
                      step="10"
                      value={item.val}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [item.key]: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: COLORS.primary,
                    marginBottom: "12px",
                  }}
                >
                  แต้มบุญพิเศษ (+5%)
                </div>
                {[
                  {
                    k: "bonusDiscipline",
                    l: "วินัยชนะเลิศ (ฝืนทำทั้งที่ไม่อยาก)",
                  },
                  { k: "bonusNewThing", l: "เปิดโลกกว้าง (รู้อะไรใหม่ๆ)" },
                  { k: "bonusSelfCare", l: "พักอย่างมีคุณภาพ (ฮีลใจ)" },
                ].map((b) => (
                  <label key={b.k} style={s.bonusItem}>
                    <input
                      type="checkbox"
                      checked={formData[b.k]}
                      onChange={(e) =>
                        setFormData({ ...formData, [b.k]: e.target.checked })
                      }
                    />
                    <span style={{ fontWeight: 600 }}>{b.l}</span>
                  </label>
                ))}
              </div>

              <textarea
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "18px",
                  border: `1px solid ${COLORS.border}`,
                  background: "#f8fafc",
                  resize: "none",
                  minHeight: "80px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  marginTop: "15px",
                }}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="จดบันทึกสั้นๆ ของวันนี้..."
              />
              <button id="save-btn" style={s.saveBtn} onClick={save}>
                <IconSave /> บันทึกความพยายามลงเครื่อง
              </button>
            </div>

            {/* Stats Card */}
            <div
              style={{
                background: COLORS.statsBg,
                color: "white",
                padding: "25px",
                borderRadius: "28px",
                display: "flex",
                gap: "20px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#a5b4fc",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  บันทึกแล้ว
                </div>
                <div style={{ fontSize: "22px", fontWeight: 900 }}>
                  {Object.keys(logs).length} วัน
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#a5b4fc",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  เฉลี่ย
                </div>
                <div style={{ fontSize: "22px", fontWeight: 900 }}>
                  {Object.keys(logs).length > 0
                    ? Math.round(
                        Object.values(logs).reduce(
                          (a, b) => a + (b.totalScore || 0),
                          0,
                        ) / Object.keys(logs).length,
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
